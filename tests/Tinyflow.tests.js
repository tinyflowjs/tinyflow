/* eslint-env mocha */
import { Tinyflow } from '../lib/Tinyflow.js'
import { end, minimalFlow, minimalFlowWithExtension, setId, simpleId, start } from './utils.js'
import { expect } from 'chai'

describe('Tinyflow', function () {
  let instanceId
  let restoreId
  beforeEach(() => {
    instanceId = simpleId()
    restoreId = setId(() => {
      return instanceId
    })
  })
  afterEach(() => {
    Tinyflow.clear()
    restoreId()
  })
  describe('Tinyflow.create', function () {
    it('creates a new workflow by a minimal definition', () => {
      const def = minimalFlow()
      const instance = Tinyflow.create(def)
      expect(instance).to.deep.equal({
        id: instanceId,
        name: def.name,
        current: null,
        state: 'pending',
        custom: {},
        data: null,
        history: [],
        steps: [
          { name: 'one', next: 1 },
          { name: 'two', next: null }
        ]
      })
    })
  })
  describe('Tinyflow.get', function () {
    it('returns undefined if no instance exists by id', () => {
      expect(Tinyflow.get(simpleId())).to.equal(undefined)
    })
    it('returns an instance by id', () => {
      const instance = Tinyflow.create(minimalFlow())
      expect(Tinyflow.get(instanceId)).to.equal(instance)
    })
  })
  describe('Tinyflow.all', function () {
    it('returns all instances', () => {
      restoreId()
      expect(Tinyflow.all()).to.deep.equal([])
      const def = minimalFlow()
      const instance1 = Tinyflow.create(def)
      expect(Tinyflow.all()).to.deep.equal([instance1])
      const instance2 = Tinyflow.create(def)
      expect(Tinyflow.all()).to.deep.equal([
        instance1, instance2
      ])
    })
  })
  describe('Tinyflow.use', function () {
    it('allows to run extensions for workflows on start', () => {
      const def = minimalFlowWithExtension('workflow')
      const instance = Tinyflow.create(def)
      expect(instance).to.deep.equal({
        id: instanceId,
        name: def.name,
        current: null,
        history: [],
        state: 'pending',
        custom: {
          foo: { bar: 'baz' }
        },
        data: null,
        steps: [
          { name: 'one', next: 1 },
          { name: 'two', next: null }
        ]
      })
    })
    it('allows to run extensions for steps', () => {
      const def = minimalFlowWithExtension('steps')
      const instance = Tinyflow.create(def)
      expect(instance).to.deep.equal({
        id: instanceId,
        name: def.name,
        current: null,
        history: [],
        state: 'pending',
        custom: {},
        data: null,
        steps: [
          { name: 'one', next: 1, foo: { bar: 'baz' } },
          { name: 'two', next: null, foo: { bar: 'baz' } }
        ]
      })
    })
    it('allows to run extensions for workflows and steps', () => {
      const def = minimalFlowWithExtension('all')
      const instance = Tinyflow.create(def)
      expect(instance).to.deep.equal({
        id: instanceId,
        name: def.name,
        current: null,
        history: [],
        state: 'pending',
        custom: {
          foo: { bar: 'baz' }
        },
        data: null,
        steps: [
          { name: 'one', next: 1, foo: { bar: 'baz' } },
          { name: 'two', next: null, foo: { bar: 'baz' } }
        ]
      })
      it('defaults to all when no scope is given', () => {
        const def = minimalFlowWithExtension(null)
        const instance = Tinyflow.create(def)
        expect(instance).to.deep.equal({
          id: instanceId,
          name: def.name,
          current: null,
          history: [],
          state: 'pending',
          custom: {
            foo: { bar: 'baz' }
          },
          data: null,
          steps: [
            { name: 'one', next: 1, foo: { bar: 'baz' } },
            { name: 'two', next: null, foo: { bar: 'baz' } }
          ]
        })
      })
    })
    it('allows steps to override the extension', () => {
      const def = minimalFlowWithExtension('steps')
      def.steps.one.foo = null
      def.steps.two.foo = { moo: 1 }

      const instance = Tinyflow.create(def)
      expect(instance).to.deep.equal({
        id: instanceId,
        name: def.name,
        current: null,
        state: 'pending',
        history: [],
        custom: {},
        data: null,
        steps: [
          { name: 'one', next: 1, foo: null },
          { name: 'two', next: null, foo: { moo: 1 } }
        ]
      })
    })
    it('allows to unregister extensions', async () => {
      Tinyflow.use('bar', () => {
        throw new Error()
      })
      Tinyflow.use('bar', null) // unregister
      const def = minimalFlow()
      def.bar = true
      const wf = Tinyflow.create(def)
      await start(wf)
      // should not have thrown
    })
  })
  describe('Tinyflow.dispose', function () {
    it('throws if the workflow does not exist', () => {
      const id = simpleId()
      expect(() => Tinyflow.dispose(id))
        .to.throw(`Workflow does not exist by id ${id}`)
    })
    it('throws if the workflow is active and force flag is not truthy', async () => {
      const wf = Tinyflow.create(minimalFlow())
      await start(wf)
      const thrown = expect(() => Tinyflow.dispose(wf.id))
        .to.throw(`Cannot dispose active workflow "${wf.name}"`)
      thrown.with.deep.property('details', {
        instanceId: wf.id
      })
    })
    it('removes all listeners from workflow', function (done) {
      this.timeout(10000)
      const wf = Tinyflow.create(minimalFlow())
      const fail = () => done(new Error('should not reach'))
      wf.on('started', fail)
      wf.on('step', fail)
      wf.on('end', fail)
      const id = wf.id
      expect(Tinyflow.get(id)).to.equal(wf)
      Tinyflow.dispose(id)
      expect(Tinyflow.get(id)).to.equal(undefined)
      setTimeout(() => done(), 50)
    })
    it('allows to force-dispose an active workflow', async () => {
      const wf = Tinyflow.create(minimalFlow())
      const id = wf.id
      expect(Tinyflow.get(id)).to.equal(wf)

      await start(wf)

      Tinyflow.dispose(id, { force: true })
      expect(Tinyflow.get(id)).to.equal(undefined)
      try {
        await next(wf)
        expect.fail()
      } catch {}
    })
  })
  describe('set custom id', function () {
    let restoreId
    afterEach(() => {
      restoreId()
    })
    it('allows to register a core extension', async () => {
      restoreId = setId(() => 'foo')
      const def = minimalFlow()
      def.bar = true
      const wf = Tinyflow.create(def)
      expect(wf.id).to.equal('foo')
      await start(wf)
      expect(wf.current.id).to.equal('foo')
    })
  })
  describe('Tinyflow.clear', function () {
    it('it should detach any listeners so no events will fire after .clear has called')
  })
  describe('Tinyflow.x', () => {
    it('allows to extend Tinyflow', () => {
      Tinyflow.extend(({ listeners }) => {
        Tinyflow.listeners = (wf, name) => {
          return listeners.by(wf, name)
        }
      })

      const wf = Tinyflow.create(minimalFlow())
      expect(Tinyflow.listeners(wf)).to.deep.equal([])
      const fn1 = () => {}
      const fn2 = () => {}
      wf.on('foo', fn1)
      wf.on('bar', fn2)
      expect(Tinyflow.listeners(wf, 'foo')).to.deep.equal([fn1])
      expect(Tinyflow.listeners(wf, 'bar')).to.deep.equal([fn2])
    })
  })
})