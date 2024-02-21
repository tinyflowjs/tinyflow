/* eslint-env mocha */
import { Step } from '../lib/Tinyflow.js'
import { expect } from 'chai'
import { simpleId, start } from './utils.js'

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
    it('runs sync extensions')
    it('runs async extensions')
  })
  describe(Step.prototype.cancel.name, function () {
    it('dispatches the end event')
    it('removes the step data')
    it('sets the step to end with state cancelled')
  })
  describe(Step.prototype.complete.name, function () {
    it('sets the step to end with state completed')
    it('does not remove the step data')
    it('dispatches the end event')
  })
  describe(Step.prototype.update.name, function () {
    it('updates the step data')
    it('prevents prototype pollution')
  })
})