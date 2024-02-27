/* eslint-env mocha */
import { Workflow, Step } from '../../index.js'
import { minimalFlow, simpleId } from '@tinyflow/testutils'
import { expect } from 'chai'

describe('Emitter', function () {
  const runTests = ({ factory, name }) => describe(`extended by (${name})`, function () {
    it('allows to listen to a recurring event', (done) => {
      const max = 5
      let count = 0
      const instance = factory()
      instance.on('foo', () => {
        if (++count === max) {
          done()
        }
      })
      for (let i = 0; i < max; i++) {
        instance.emit('foo')
      }
    })
    it('allows to listen to a recurring async event', (done) => {
      const max = 5
      let count = 0
      const instance = factory()
      instance.on('foo', async () => {
        if (++count === max) {
          done()
        }
      })
      for (let i = 0; i < max; i++) {
        instance.emit('foo')
      }
    })
    it('allows to listen to a single event once', (done) => {
      const max = 5
      const wf = factory()
      wf.once('foo', () => done())
      for (let i = 0; i < max; i++) {
        wf.emit('foo')
      }
    })
    it('allows to listen to a single async event', (done) => {
      const max = 5
      const wf = factory()
      wf.once('foo', async () => done())
      for (let i = 0; i < max; i++) {
        wf.emit('foo')
      }
    })
    it('throws if a listener is not found by given function', () => {
      const instance = factory()
      instance.on('foo', () => {})
      expect(() => instance.off('foo', () => {}))
        .to.throw('No listener found by function for event foo')
    })
    it('allows to remove a listener by name and function', (done) => {
      const wf = factory()
      let count = 0
      const fn1 = () => {
        if (++count > 1) {
          done(new Error('should not reach'))
        }
      }
      const fn2 = () => {
        wf.off('foo', fn1)
        done()
      }
      wf.on('foo', fn1)
      wf.on('foo', fn2)
      wf.emit('foo')
    })
    it('allows to remove all listeners by name', (done) => {
      const instance = factory()
      instance.on('foo', () => {
        instance.off('foo')
        instance.emit('bar')
      })
      instance.on('bar', () => {
        instance.emit('foo')
        done()
      })
      instance.emit('foo')
    })
    const errorEvent = ({ fn, isAsync, message }) => {
      it(`catches errors thrown in ${isAsync ? 'async' : ''} event and bubbles them into error event`, done => {
        const instance = factory()
        instance.on('foo', fn)
        instance.on('error', ({ error }) => {
          expect(error.message).to.equal(message)
          done()
        })
        instance.emit('foo')
      })
    }

    errorEvent({
      message: 'expected error event',
      isAsync: false,
      fn: () => {
        throw new Error('expected error event')
      }
    })
    errorEvent({
      message: 'expected async error event',
      isAsync: true,
      fn: async () => {
        throw new Error('expected async error event')
      }
    })
  })

  runTests({
    name: 'Workflow',
    factory: () => new Workflow(minimalFlow())
  })
  runTests({
    name: 'Step',
    factory: () => new Step({
      id: simpleId(),
      workflowId: simpleId(),
      name: 'foo'
    })
  })
})