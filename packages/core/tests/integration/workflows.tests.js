/* eslint-env mocha */
import { Tinyflow } from '../../index.js'
import { expect } from 'chai'
import { minimalFlow, simpleId, asyncTimeout, end, start, next, prev, setId } from '@tinyflow/testutils'

describe('Tinyflow - integration', function () {
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

  describe('most minimal workflow', () => {
    it('runs with the most minimal definitions', async () => {
      const wf = Tinyflow.create({
        name: 'foo',
        steps: {
          one: {},
          two: {}
        }
      })
      expect(wf.id).to.equal(instanceId)
      expect(wf.state).to.equal('pending')
      expect(wf.steps).to.deep.equal([
        { name: 'one', next: 1 },
        { name: 'two', next: null }
      ])
      await start(wf)
      expect(wf.state).to.equal('active')
      expect(wf.current.name).to.equal('one')
      expect(wf.current.state).to.equal('active')
      await next(wf)

      expect(wf.current.name).to.equal('two')
      await end(wf)

      expect(wf.current).to.equal(null)
      expect(wf.state).to.equal('complete')
      expect(wf.data).to.deep.equal({
        one: {},
        two: {}
      })
    })
    it('runs with data', async () => {
      const wf = Tinyflow.create({
        name: 'foo',
        steps: {
          one: {},
          two: { data: { moo: 1 } }
        }
      })
      expect(wf.id).to.equal(instanceId)
      expect(wf.state).to.equal('pending')
      expect(wf.data).to.equal(null)
      expect(wf.steps).to.deep.equal([
        { name: 'one', next: 1 },
        { name: 'two', next: null, data: { moo: 1 } }
      ])

      // empty after start
      await start(wf)
      expect(wf.data).to.deep.equal({})

      // update data to step 1
      wf.current.update({ foo: 2 })
      expect(wf.current.data).to.deep.equal({ foo: 2 })

      // should attach data from step 1 to wf
      await next(wf)
      expect(wf.data).to.deep.equal({ one: { foo: 2 } })

      // update step 2 => override existing data
      expect(wf.current.data).to.deep.equal({ moo: 1 })
      wf.current.update({ bar: 3 })
      expect(wf.current.data).to.deep.equal({ bar: 3 })

      // update step 2 => extend existing data
      wf.current.update({ ...wf.current.data, moo: 5 })

      // should attach data from step 2 to wf
      await end(wf)
      expect(wf.data).to.deep.equal({
        one: { foo: 2 },
        two: {
          bar: 3,
          moo: 5
        }
      })

      expect(wf.current).to.equal(null)
      expect(wf.state).to.equal('complete')
    })
  })
  describe('minimal with workflow extensions', () => {
    const minimalExtension = ({ name, config, handler, isAsync }) => {
      it(`runs with a minimal ${isAsync ? 'async' : ''} extension`, async () => {
        let called = 0
        Tinyflow.use(name, (...args) => {
          const p = handler(...args)
          called++
          return p
        })
        const def = minimalFlow()
        def[name] = [config, 'workflow']
        const wf = Tinyflow.create(def)
        await start(wf)
        await asyncTimeout(50)
        expect(called).to.equal(1)
        expect(wf.state).to.equal('active')
        expect(wf.current).to.not.equal(null)
      })
    }
    minimalExtension({
      name: 'moo',
      config: { foo: 1 },
      handler: (config) => {
        expect(config).to.deep.equal({ foo: 1 })
      }
    })
    minimalExtension({
      name: 'moo1111',
      config: { foo: 1 },
      handler: async (config) => {
        expect(config).to.deep.equal({ foo: 1 })
      },
      isAsync: true
    })
    it('passes down extensions to every step unless step overrides config', async () => {
      const history = []
      const add = (arr) => {
        history.push(arr)
      }
      Tinyflow.use('history', (active, { workflow, step }) => {
        if (!active) { return }
        if (workflow) {
          add([workflow.name, 'created'])
          workflow.on('started', () => add([workflow.name, 'started']))
          workflow.on('step', () => add([workflow.name, 'step', workflow.current.name]))
          workflow.on('end', () => add([workflow.name, workflow.state]))
        }

        if (step) {
          add([step.name, 'created'])
          step.on('started', () => add([step.name, 'started']))
          step.on('update', (current) => add([step.name, 'update', current.data]))
          step.on('end', () => add([step.name, step.state]))
        }
      })

      const wf = Tinyflow.create({
        name: 'foo',
        history: true,
        steps: {
          // pass down as true
          one: {},
          // overrides as false
          two: {
            history: false
          }
        }
      })
      await start(wf)
      wf.current.update({ bar: 3 })
      await next(wf)
      await end(wf)
      expect(history).to.deep.equal([
        ['foo', 'created'],
        ['one', 'created'],
        ['foo', 'started'],
        ['foo', 'step', 'one'],
        ['one', 'started'],
        ['one', 'update', { bar: 3 }],
        ['one', 'complete'],
        ['foo', 'step', 'two'],
        ['foo', 'complete']
      ])
    })
    it('prevents the workflow from starting (sync)', () => {
      const errId = simpleId()
      Tinyflow.use('err', () => {
        throw new Error(`Expected error ${errId}`)
      })
      const def = minimalFlow()
      def.err = true
      const wf = Tinyflow.create(def)
      expect(() => wf.start())
        .to.throw(`Expected error ${errId}`)
    })
    it('prevents the workflow from starting (async)', (done) => {
      const errId = simpleId()
      Tinyflow.use('asyncErr', async (err, { workflow, step }) => {
        await asyncTimeout(100)
        expect(workflow).to.equal(wf)
        expect(step).to.equal(undefined)
        throw new Error(`Expected error ${errId}`)
      })
      const def = minimalFlow()
      def.asyncErr = true

      const wf = Tinyflow.create(def)
      wf.on('error', ({ error, workflow, step }) => {
        expect(error.message).to.equal(`Expected error ${errId}`)
        expect(workflow).to.equal(wf)
        expect(workflow.state).to.equal('pending')
        expect(workflow.current).to.equal(null)
        expect(step).to.equal(undefined)
        done()
      })
      wf.on('started', () => done(new Error('should not start')))
      wf.start()
    })
  })
  describe('cyclic workflows', () => {
    it('allows for cyclic back and forth', async () => {
      const wf = Tinyflow.create({
        name: 'foo',
        steps: {
          one: {},
          two: {}
        }
      })

      const cycle = async () => {
        expect(wf.current.name).to.equal('one')
        await next(wf)
        expect(wf.current.name).to.equal('two')
        await prev(wf)
      }

      await start(wf)

      const expected = []
      for (let i = 0; i < 5; i++) {
        await cycle()
        expected.push('one')
        expected.push('two')
      }

      await next(wf)
      expected.push('one')
      await end(wf)
      expected.push('two')

      expect(wf.history.map(e => e.name)).to.deep.equal(expected)
    })
  })
})