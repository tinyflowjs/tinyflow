/* eslint-env mocha */
import { Tinyflow } from '@tinyflow/core'
import { withInstances } from '../withInstances.js'
import { minimalFlow, setId, simpleId, start, next } from '@tinyflow/testutils'
import { expect } from 'chai'

describe('Instances - Tinyflow unit tests', function () {
  let disposeExtension
  before(() => {
    disposeExtension = Tinyflow.extend(withInstances())
  })
  after(() => {
    disposeExtension()
    expect(Tinyflow.create).to.equal(undefined)
  })
  let instanceId
  let restoreId
  beforeEach(() => {
    instanceId = simpleId()
    restoreId = Tinyflow.extend(setId(() => {
      return instanceId
    }))
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
