/* eslint-env mocha */
import { Tinyflow, Workflow, Step } from '../../Tinyflow.js'
import { expect } from 'chai'
import { minimalFlow, minimalFlowWithExtension, setId, simpleId, start } from '@tinyflow/testutils'

describe('Tinyflow', function () {
  let disposeExtension
  before(() => {
    disposeExtension = Tinyflow.extend(({ extensions }, { Tinyflow, Workflow }) => {
      Tinyflow.clear = () => extensions.clear()
      Tinyflow.create = def => new Workflow(def)
      return () => {
        delete Tinyflow.clear
        delete Tinyflow.create
      }
    })
  })
  after(() => {
    disposeExtension()
  })

  let instanceId
  let restoreId
  beforeEach(() => {
    instanceId = simpleId()
    restoreId = Tinyflow.extend(setId(() => instanceId))
  })
  afterEach(() => {
    Tinyflow.clear({ extensions: true })
    restoreId()
  })

  describe('Tinyflow.extend', () => {
    it('allows to use internals', () => {
      Tinyflow.extend(internals => {
        expect(internals.extensions).to.be.instanceOf(Map)
        expect(internals.listeners).to.be.instanceOf(WeakMap)
        expect(internals.id).to.be.a('function')
        expect(internals.history).to.be.a('function')
      })
    })
    it('allows to use implementations', () => {
      Tinyflow.extend((_, externals) => {
        expect(externals.Tinyflow).to.equal(Tinyflow)
        expect(externals.Workflow).to.equal(Workflow)
        expect(externals.Step).to.equal(Step)
        expect(externals.Emitter.name).to.equal('Emitter')
        expect(externals.TinyflowError.name).to.equal('TinyflowError')
      })
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
})
