/* eslint-env mocha */
import { Step, Tinyflow } from '../../Tinyflow.js'
import { expect } from 'chai'
import { asyncTimeout, end, objectProps, props, simpleId, start } from '@tinyflow/testutils'

describe('Step', function () {
  let name
  let id
  let workflowId
  beforeEach(() => {
    name = simpleId()
    id = simpleId()
    workflowId = simpleId()
  })
  describe('constructor', function () {
    it('creates a new step with at least an id', () => {
      const step = new Step({})
      expect(step.id).to.be.a('string')
    })
  })
  describe(Step.prototype.start.name, function () {
    it('activates the step', async () => {
      const step = new Step({})
      expect(step.state).to.equal('pending')
      await start(step)
      expect(step.state).to.equal('active')
    })
    it('throws if the step is already active', async () => {
      const step = new Step({
        name,
        id,
        workflowId
      })
      await start(step)
      const thrown = expect(() => step.start())
        .to.throw('Cannot start a step in active state')
      thrown.with.deep.property('details', { name, id, wf: workflowId })
    })

    const runExtension = ({ isAsync }) => {
      it(`runs ${isAsync ? 'async' : ''} extensions`, async () => {
        let called = 0
        const extension = { bar: 1 }
        const handler = (config, sources) => {
          expect(config).to.deep.equal(extension)
          expect(sources.workflow).to.equal(undefined)
          expect(sources.step).to.equal(step)
          called++
        }
        Tinyflow.use('fooStep', isAsync
          ? async (...args) => handler(...args)
          : handler)
        const step = new Step({
          fooStep: extension
        })
        expect(step.custom).to.deep.equal({ fooStep: extension })
        await start(step)
        await asyncTimeout(25)
        expect(called).to.equal(1)
        Tinyflow.use('fooStep', null)
      })
    }

    ;[false, true].forEach(isAsync => runExtension({ isAsync }))

    const extensionWithError = ({ isAsync }) => {
      it(`handles errors in ${isAsync ? 'async' : ''} extensions`, (done) => {
        const message = 'expected foo step error'
        let called = 0
        const extension = { bar: 1 }
        const handler = () => {
          called++
          throw new Error(message)
        }
        Tinyflow.use('fooStep', isAsync
          ? async (...args) => handler(...args)
          : handler)
        const st = new Step({ id, name, workflowId, fooStep: extension })

        if (isAsync) {
          st.on('error', ({ error, workflow, step }) => {
            expect(error.message).to.equal(message)
            expect(workflow).to.equal(undefined)
            expect(step).to.equal(st)
            expect(called).to.equal(1)
            Tinyflow.use('fooStep', null)
            done()
          })
          st.start()
        } else {
          expect(() => st.start()).to.throw(message)
          done()
        }
      })
    }
    ;[false, true].forEach(isAsync => extensionWithError({ isAsync }))
  })

  const endEvents = ({ name, state, data }) => {
    describe(Step.prototype[name].name, function () {
      it('sets the step to end with state cancelled', async () => {
        const step = new Step({})
        await start(step, () => step.start())
        expect(step.state).to.equal('active')
        await end(step, () => step[name]())
        expect(step.state).to.equal(state)
      })
      it(`${data ? 'prevails' : 'removes'} the step data`, async () => {
        const step = new Step({})
        await start(step, () => step.start())
        step.update({ foo: 1 })
        expect(step.data).to.deep.equal({ foo: 1 })
        await end(step, () => step[name]())
        expect(step.data).to.deep.equal(data ? { foo: 1 } : null)
      })
    })
  }
  endEvents({ name: 'cancel', state: 'cancelled', data: false })
  endEvents({ name: 'complete', state: 'complete', data: true })

  describe(Step.prototype.update.name, function () {
    it('updates the step data', async () => {
      const step = new Step({
        data: { foo: 2 }
      })
      await start(step, () => step.start())

      // optional prevail:
      step.update({ ...step.data, bar: 1 })
      expect(step.data).to.deep.equal({ foo: 2, bar: 1 })

      // overrides
      step.update({ bar: 1 })
      expect(step.data).to.deep.equal({ bar: 1 })
    })
    it('emits update event', done => {
      const step = new Step({
        data: { foo: 2 }
      })
      step.on('update', (st) => {
        expect(st).to.equal(step)
        expect(step.data).to.deep.equal({ bar: 1 })
        done()
      })
      step.on('started', () => step.update({ bar: 1 }))
      step.start()
    })
    it('throws if not in active state', () => {
      const step = new Step({ id, name, workflowId })
      const thrown = expect(() => step.update({}))
        .to.throw('Can only update in an active state, got "pending"')
      thrown.with.deep.property('details', {
        name: step.name,
        id: step.id,
        wf: step.workflowId
      })
    })
    it('prevents prototype pollution', async () => {
      const step = new Step({
        data: { foo: 2 }
      })
      await start(step, () => step.start())

      // optional prevail:
      step.update({ __proto__: { foo: 1 } })
      expect(objectProps).to.deep.equal(props({}))
    })
  })
})
