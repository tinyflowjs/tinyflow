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
  const handler = () => {
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

export const setId = fn => internal => {
  const original = internal.id
  internal.id = fn
  return () => {
    internal.id = original
  }
}

export const props = (obj) => {
  const p = []
  for (; obj != null; obj = Object.getPrototypeOf(obj)) {
    const op = Object.getOwnPropertyNames(obj)
    for (let i = 0; i < op.length; i++) { if (p.indexOf(op[i]) === -1) p.push(op[i]) }
  }
  return p
}
export const objectProps = props({})
