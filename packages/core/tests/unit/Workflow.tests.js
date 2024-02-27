/* eslint-env mocha */
import { Tinyflow, Workflow, Step } from '../../Tinyflow.js'
import { end, minimalFlow, next, setId, simpleId, start } from '@tinyflow/testutils'
import { expect } from 'chai'

describe('Workflow', function () {
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
    Tinyflow.clear()
    restoreId()
  })
  describe('constructor', function () {
    it('always assigns at least an id', () => {
      const wf = new Workflow(minimalFlow())
      expect(wf.id).to.be.a('string')
    })
    it('throws if def contains no steps', () => {
      const def = { name: 'foo' }
      const thrown = expect(() => Tinyflow.create(def))
        .to.throw('Workflow steps must have at least one entry, got 0')
      thrown.with.deep.property('details', {
        name: 'foo',
        id: undefined // not created yet
      })
    })
  })
  describe(Workflow.prototype.start.name, function () {
    it('activates the workflow', async () => {
      const wf = Tinyflow.create(minimalFlow())
      expect(wf.state).to.equal('pending')
      await start(wf)
      expect(wf.state).to.equal('active')
    })
    it('throws if called on an active workflow', async () => {
      const wf = Tinyflow.create(minimalFlow())
      await start(wf)
      const thrown = expect(() => wf.start())
        .to.throw(`Cannot start active workflow`)
      thrown.with.deep.property('details', {
        name: wf.name,
        id: wf.id
      })
    })
    it('automatically enters the first step', async () => {
      const wf = Tinyflow.create(minimalFlow())
      expect(wf.current).to.equal(null)
      await start(wf)
      expect(wf.current).to.not.equal(null)
      expect(wf.current).to.be.instanceof(Step)
    })
    it('optionally does not enter the first step if autoStep flag is set to false', async () => {
      const wf = Tinyflow.create(minimalFlow())
      expect(wf.current).to.equal(null)
      await start(wf, () => wf.start({ autoStep: false }))
      expect(wf.current).to.equal(null)
    })
    it('emits the started event once completed', done => {
      const wf = Tinyflow.create(minimalFlow())
      wf.on('started', () => {
        done()
      })
      wf.start({ autoEnd: false })
    })
    it('emits an error event when an async extensions throws an error', (done) => {
      const def = minimalFlow()
      def.foobar = {}
      Tinyflow.use('foobar', async () => {
        throw new Error('Expected error in foobar extension')
      })
      const wf = Tinyflow.create(def)
      wf.on('error', ({ error, workflow }) => {
        expect(workflow).to.equal(wf)
        expect(error.message).to.equal('Expected error in foobar extension')
        done()
      })
      wf.start()
    })
  })
  describe(Workflow.prototype.step.name, () => {
    it('throws if the workflow is not active', () => {
      const wf = Tinyflow.create(minimalFlow())
      const thrown = expect(() => wf.step())
        .to.throw(`Can only step in an active state, got "${wf.state}"`)
      thrown.with.deep.property('details', {
        indexOrName: undefined,
        name: wf.name,
        id: wf.id
      })
    })
    it('throws if it cannot find step by index', async () => {
      const wf = Tinyflow.create(minimalFlow())
      await start(wf)
      const thrown = expect(() => wf.step(3))
        .to.throw(`Expected step definition, got undefined`)
      thrown.with.deep.property('details', {
        indexOrName: 3,
        name: wf.name,
        id: wf.id
      })
    })
    it('throws if it cannot find step by name', async () => {
      const wf = Tinyflow.create(minimalFlow())
      await start(wf)
      const next = simpleId()
      const thrown = expect(() => wf.step(next))
        .to.throw(`Expected step definition, got undefined`)
      thrown.with.deep.property('details', {
        indexOrName: next,
        name: wf.name,
        id: wf.id
      })
    })
    it('saves a simple history', async () => {
      const wf = Tinyflow.create(minimalFlow())
      await start(wf)
      wf.current.update({ foo: 1 })
      await next(wf)
      expect(wf.history.length).to.equal(1)
      expect(wf.history[0].name).to.equal('one')
      expect(wf.history[0].data).to.deep.equal({ foo: 1 })
      expect(wf.history[0].at).to.be.instanceof(Date)
    })
    it('saves step data', async () => {
      const wf = Tinyflow.create(minimalFlow())
      await start(wf)
      wf.current.update({ foo: 1 })
      await next(wf)
      expect(wf.data).to.deep.equal({
        one: { foo: 1 }
      })
    })
  })
  describe('extension', () => {
    it('allows to directly extend the prototype', async () => {
      Workflow.prototype.hasNext = function () {
        const step = this.current
        if (step.next && step.next !== 'done') return true
        const index = this.steps.findIndex(({ name }) => name === step.name)
        return index > -1 && index < this.steps.length - 1
      }

      Workflow.prototype.isLast = function () {
        const step = this.current
        if (step.next && step.next !== 'done') return false
        const index = this.steps.findIndex(({ name }) => name === step.name)
        return index === this.steps.length - 1
      }

      const wf = Tinyflow.create(minimalFlow())
      await start(wf)
      expect(wf.hasNext()).to.equal(true)
      expect(wf.isLast()).to.equal(false)
      await next(wf)
      expect(wf.hasNext()).to.equal(false)
      expect(wf.isLast()).to.equal(true)

      delete Workflow.prototype.hasNext
      delete Workflow.prototype.isLast
    })
  })

  const endEvents = ({ name, state, data }) => {
    describe(Workflow.prototype[name].name, function () {
      it(`sets the state to ${state}`, async () => {
        const wf = new Workflow(minimalFlow())
        await start(wf, () => wf.start())
        expect(wf.state).to.equal('active')
        await end(wf, () => wf[name]())
        expect(wf.state).to.equal(state)
      })
      it(`${data ? 'prevails' : 'removes'} the data`, async () => {
        const wf = new Workflow(minimalFlow())
        await start(wf, () => wf.start())
        wf.current.update({ foo: 1 })
        wf.data = { foo: 1 }
        await end(wf, () => wf[name]())
        expect(wf.data).to.deep.equal(data ? { foo: 1 } : null)
      })
    })
  }
  endEvents({ name: 'cancel', state: 'cancelled', data: false })
  endEvents({ name: 'complete', state: 'complete', data: true })
})