import { Tinyflow } from '../lib/Tinyflow.js'

export const simpleId = () => Math.random().toString(36).substring(2, 16)

export const asyncTimeout = ms => new Promise(resolve => {
  setTimeout(() => resolve(), ms)
})

export const minimalFlow = () => ({
  name: 'foo',
  steps: {
    one: {},
    two: {}
  }
})

export const minimalFlowWithExtension = (bubble) => {
  const flow = minimalFlow()
  flow.foo = bubble === null
    ? { bar: 'baz' }
    : [{ bar: 'baz' }, bubble || 'all']
  return flow
}

export const asyncEvent = (wf, name, trigger) => new Promise((resolve, reject) => {
  let handler = () => {
    wf.off(name, handler)
    resolve()
  }
  try {
    wf.on(name, handler)
    trigger()
  } catch (e) {
    reject(e)
  }
})

export const start = async (wf, trigger = () => wf.start()) => asyncEvent(wf, 'started', trigger)

export const next = async (wf, trigger = () => wf.current.complete()) => asyncEvent(wf, 'step', trigger)

export const end = async (wf, trigger = () => wf.current.complete()) => asyncEvent(wf, 'end', trigger)

export const error = async (wf, trigger) => asyncEvent(wf, 'error', trigger)

export const prev = async (wf) => {
  const last = wf.history[wf.history.length - 1]
  await next(wf, () => wf.step(last.name))
}

export const setId = (fn) => {
  let original
  let returnFn
  Tinyflow.extend((internal) => {
    original = internal.id
    internal.id = fn
    returnFn = () => {
      internal.id = original
    }
  })
  return returnFn
}