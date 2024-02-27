/**
 * Tinyflow is a minimalistic workflow engine with
 * easy customization.
 * You can use it with any JavaScript runtime as it
 * makes no use of any runtime-specifics.
 * @type {object}
 */
export const Tinyflow = {}

// ----------------------------------------------------------------------------
// Internal Variables
// ----------------------------------------------------------------------------
const _ = {
  /**
   * All registered extensions
   * @private
   * @type {Map<string, function>}
   */
  extensions: new Map(),

  /**
   * Listeners are mapped by emitters
   * in WeakMap in order to have GC remove them,
   * if the emitter is cleared
   * @private
   * @type {WeakMap<object, Map<string, function[]>>}
   */
  listeners: new WeakMap(),

  /**
   * The default id generation. You obviously want to use the {Tinyflow.extend} method to bring your own
   * @private
   */
  id: () => Math.random().toString(16).substring(2, 16),

  /**
   * Generates a history entry.
   * @private
   * @param step {Step}
   * @param workflow {Workflow}
   * @return {{at: Date, data, name}}
   */
  history: (step /* workflow */) => ({ name: step.name, data: { ...step.data }, at: new Date() })
}

// make available as local variables
// without the need for the _. prefix
const { extensions, listeners } = _

/**
 * Get the listeners for a given emitter.
 * Always returns an array.
 *
 * @private
 * @param emitter {Emitter}
 * @param name {string }
 * @returns {function[]}
 */
listeners.by = (emitter, name) => {
  if (!listeners.has(emitter)) {
    listeners.set(emitter, new Map())
  }
  return listeners.get(emitter).get(name) || []
}

// ----------------------------------------------------------------------------
// Public API
// ----------------------------------------------------------------------------
/**
 * Extend Tinyflow functionality. In contrast to register an extension this
 * method allows to extend Tinyflows core functionality.
 * @param fn
 */
Tinyflow.extend = fn => fn(_, { Tinyflow, TinyflowError, Workflow, Step, Emitter })

/**
 * Register an extension by name. Extensions run on workflow-properties that
 * are not part of the engine core.
 * Core properties are currently: id, next, name, prev
 *
 * Extensions can be registered for workflows and/or steps, which can be determined by
 * the second parameter of their callback.
 *
 * Callbacks can also be async, but they're not awaited (only caught).
 * If callback is null then the extension will be removed.
 *
 * @param name {string} name of the property to register an extension
 * @param handler {null|function(property, context):Promise|void} callback to execute
 */
Tinyflow.use = (name, handler) => {
  const fn = handler === null ? extensions.delete : extensions.set
  fn.call(extensions, name, handler)
}

// ----------------------------------------------------------------------------
// Internal Implementations
// ----------------------------------------------------------------------------
const tick = (fn, t = 0) => setTimeout(fn, t)
const promisify = (fn, args) => new Promise((resolve, reject) => {
  try {
    resolve(fn(...args))
  } catch (e) {
    reject(e)
  }
})

/**
 * @class
 * A tiny emitter that provides just the bare minimum.
 */
class Emitter {
  /**
   * Attach a new listener
   * @param name {string}
   * @param fn {function}
   */
  on (name, fn) {
    const list = listeners.by(this, name)
    list.push(fn)
    listeners.get(this).set(name, list)
  }

  /**
   * Fires a listener exactly once and then removes it
   * @param name {string}
   * @param fn {function}
   */
  once (name, fn) {
    fn.once = true
    this.on(name, fn)
  }

  /**
   * Remove listeners. Has multiple combinations:
   * - if no arg at all is passed will remove **everything**
   * - if only name is passed will remove all listeners by name
   * - if name and function is passed will remove only this specific
   *   listener, if it has been attached before
   * @param name {string=}
   * @param fn {function=}
   */
  off (name, fn) {
    if (!name) {
      listeners.get(this).clear()
      return // exit
    }
    const list = listeners.by(this, name)
    if (!fn) {
      list.length = 0
    }
    const index = list.length > 0 && list.findIndex((f) => f === fn)
    if (index > -1) {
      list.splice(index, 1)
    } else {
      throw new TinyflowError(`No listener found by function for event ${name}`, {
        id: this.id,
        name: this.name
      })
    }
    listeners.get(this).set(name, list)
  }

  /**
   * Fires a new single event for this emitter.
   * If a listener was registered with the "once" flag
   * then it will only be fired once, then removed
   * from the listeners list.
   *
   * Additional data can be added by an exact single second
   * argument. Use an object if you have complex data to
   * submit during the event.
   * @param name {string} name of the event
   * @param data {any=} optional data
   */
  emit (name, data) {
    const list = listeners.by(this, name).reverse()
    for (let i = list.length - 1; i >= 0; i--) {
      const f = list[i]
      tick(() => {
        promisify(f, [data])
          .catch(e => this.emit('error', { error: e, source: this }))
      })
      if (f.once) {
        list.splice(i, 1)
      }
    }
    listeners.get(this).set(name, list)
  }
}

/**
 * A minimal Error extension to add
 * details
 * @class
 */
class TinyflowError extends Error {
  constructor (message, details) {
    super(message)
    this.name = 'TinyflowError'
    this.details = details
  }
}

const runExtensions = ({ workflow, step, onSuccess, onError }) => {
  const target = workflow || step
  Promise.all(Object
    .keys(target.custom)
    .filter(key => extensions.has(key))
    .map(name => {
      const fn = extensions.get(name)
      const value = target.custom[name]
      return fn(value, { workflow, step })
    }))
    .then(onSuccess)
    .catch(onError)
}

/**
 * The main workflow execution class,
 * defined by the given definitions file.
 *
 * Initial state is pending, until `start()` is called.
 * Hooks will not run when pending.
 *
 * Next step is defined either by `next` being defined in the current step
 * or by user explicitly set the name or index of the step.
 * It's up to you to handle permissions for any of these methods.
 *
 * Emits various events, see the respective method documentation.
 *
 * @class
 */
export class Workflow extends Emitter {
  /**
   * Creates a new instance. Any properties in the definitions, hat are not
   * one of name, id or steps are considered "custom" and are (optionally) handled
   * by their respective extensions (if registered).
   *
   * @constructor
   * @param name {string} name of the workflow
   * @param id {string} identifier of this instance of the workflow (in case you run multiple of the same)
   * @param steps {object} the workflows step definitions
   * @param custom {object} contains all custom properties of this workflow's definitions
   * @see {Tinyflow.use}
   * @throws {TinyflowError} if steps are not defined or have length of 0
   */
  constructor ({ name, id, steps = {}, ...custom }) {
    super()
    this.name = name
    this.id = id || _.id()
    this.data = null
    this.state = 'pending'
    this.custom = {}
    this.history = []

    // parse extensions
    const stepExt = {}
    Object.entries(custom).forEach(([key, val]) => {
      // if extensions are not defined as array, we
      // assume them to run in global scope
      const [fn, scope] = Array.isArray(val) ? val : [val, 'all']

      // attach extensions for workflows directly
      if (['all', 'workflow'].includes(scope)) {
        this.custom[key] = fn
      }
      // attach extensions for steps to temp object,
      // so we can use them in the step parsing
      // note, that if a step defines the extensions as null
      // then it will prevent this extension for this step
      if (['all', 'steps'].includes(scope)) {
        stepExt[key] = fn
      }
    })

    this.steps = Object
      .entries(steps)
      .map(([name, value], index, array) => {
        const next = index < array.length - 1
          ? index + 1
          : null
        return { next, name, ...stepExt, ...value }
      })

    if (this.steps.length === 0) {
      throw new TinyflowError(
        'Workflow steps must have at least one entry, got 0',
        { name, id }
      )
    }

    /**
     * The current step
     * @type {Step|null}
     */
    this.current = null
  }

  /**
   * Starts the workflow, runs through all extensions.
   * Extensions are caught in a separate Microtask (Promise.catch) and will
   * not cause the workflow start to cancel.
   * Sets thw workflow state to "active"
   * @emits started - when the workflow instance has successfully started (state became 'active')
   * @param {autoStep=} if set to false it will not automatically step into the first available step
   * @throws {TinyflowError} if the state is other than "pending"
   */
  start ({ autoStep } = {}) {
    if (this.state === 'active') {
      throw new TinyflowError(
        'Cannot start active workflow',
        { name: this.name, id: this.id }
      )
    }
    this.data = Object.create(null)
    const workflow = this

    runExtensions({
      workflow,
      onSuccess: () => {
        this.state = 'active'
        this.emit('started', this)
        if (autoStep !== false) {
          this.step(0)
        }
      },
      onError: e => this.emit('error', { error: e, workflow })
    })
  }

  /**
   * Sets a given step by name or index as the new current one.
   * This method is for manually setting the next step.
   * If you want the engine to automatically set the next step you
   * should rather end the current step using {Step.prototype.complete} or {Step.prototype.cancel}!
   *
   * When a new step is set, the current step will be disposed properly,
   * so you don't have to do it.
   *
   * Will listen to the new step's "end" event and automatically
   * determine the next step to choose or to end the workflow.
   *
   * @param indexOrName {string|number|null} index of the step in linear flows or name of the step in non-linear flows
   * @param options {object=}
   * @param options.stepId {string=} an optional
   * @param options.autoOnEnd {boolean=} set to true to prevent workflow from automatically handling the next step
   *   if the current step ends
   * @emits step - when the new step is properly set up and active
   * @throws {TinyflowError} if no step is found by index or name
   */
  step (indexOrName, { stepId, autoOnEnd } = {}) {
    if (this.state !== 'active') {
      throw new TinyflowError(
        `Can only step in an active state, got "${this.state}"`,
        { indexOrName, name: this.name, id: this.id }
      )
    }

    const stepDef = typeof indexOrName === 'number'
      ? this.steps[indexOrName]
      : this.steps.find(({ name }) => name === indexOrName)

    if (!stepDef) {
      throw new TinyflowError(
        `Expected step definition, got ${stepDef}`,
        { indexOrName, name: this.name, id: this.id }
      )
    }

    const id = stepId || _.id()
    const workflowId = this.id
    const step = new Step({ id, workflowId, ...stepDef })
    const workflow = this
    const endStep = (step) => {
      if (step) {
        step.off()
        // for a most simple audit we save a minimal set of data
        // that allows for reproduction or implementing a "back to previous"
        // procedure, for example using extensions or other externals
        this.history.push(_.history(step, workflow))
      }
      return true
    }

    if (autoOnEnd !== false) {
      step.once('end', (step) => {
        workflow.data[step.name] = { ...step.data }

        const next = step.next
        return (next !== null && next <= workflow.steps.length - 1)
          ? tick(() => workflow.step(next))
          : endStep(step) && workflow.complete()
      })
    }

    step.start()
    endStep(this.current)
    this.current = step
    this.emit('step', this)
  }

  /**
   * Completes the workflow, sets the current step to null
   * and the state to "complete".
   * Does not delete the workflow data as opposed to the cancel event
   * @emits end - the workflow has ended, see the state property for in which state it ended
   */
  complete () {
    if (this.current) {
      this.current.off()
    }
    this.current = null
    this.state = 'complete'
    this.emit('end', this)
  }

  /**
   *
   *Completes the workflow but also wiped it's data
   * and sets state as "cancelled"
   * @emits end - the workflow has ended, see the state property for in which state it ended
   */
  cancel () {
    if (this.current) {
      this.current.off()
    }
    this.data = null
    this.current = null
    this.state = 'cancelled'
    this.emit('end', this)
  }
}

/**
 * Represents an executable unit of a workflow.
 * Steps work best when they are atomically related to exactly one
 * task. It is up to the user to define and implement what such
 * a task might be.
 * Examples of tasks can be fetching data from an endpoint or
 * users submitting a form.
 * Just make sure a step does not involve multiple tasks.
 * @class
 */
export class Step extends Emitter {
  /**
   * Creates a new step instance
   * @constructor
   * @param id {string}
   * @param workflowId {string}
   * @param name {string}
   * @param data {object=} optional data from start of the workflow
   * @param next {string|number|undefined}
   * @param custom {...object} all other properties that will be passed on to your custom handlers
   */
  constructor ({ id, workflowId, name, data = null, next, ...custom }) {
    super()
    this.id = id || _.id()
    this.workflowId = workflowId
    this.name = name
    this.next = next
    this.custom = custom
    this.state = 'pending'
    this.data = data
  }

  /**
   * Starts the step, changing its state from 'pending' to active.
   *
   * Note: This method is usually called by the workflow automatically. You
   * should by default not have the need to call this method.
   *
   * Runs through all extensions.
   *
   * Extensions are caught in a separate Microtask (Promise.catch) and will
   * not cause the step-start to cancel.
   *
   * @emits started - when the step instance has successfully started (state became 'active')
   * @throws {TinyflowError} if the current state is other than "pending"
   */
  start () {
    if (this.state === 'active') {
      throw new TinyflowError(
        'Cannot start a step in active state',
        { name: this.name, id: this.id, wf: this.workflowId }
      )
    }

    this.data = this.data || Object.create(null)
    const step = this

    runExtensions({
      step,
      onSuccess: () => {
        this.state = 'active'
        this.emit('started', this)
      },
      onError: e => this.emit('error', { error: e, step })
    })
  }

  /**
   * Updates the step's data (hard-override!)
   * Use it's existing data to merge
   * @example
   * step.update({ foo: 1 }) // { foo: 1}
   * step.update({ bar: 2, ...step.data }) // { foo: 1, bar: 2 }
   * @param data {object}
   * @emits update - the step's data has updated
   */
  update (data) {
    if (this.state !== 'active') {
      throw new TinyflowError(
        `Can only update in an active state, got "${this.state}"`,
        { name: this.name, id: this.id, wf: this.workflowId }
      )
    }
    this.data = Object.create(null)
    Object.assign(this.data, data)
    this.emit('update', this)
  }

  /**
   * Sets the workflow state to 'complete'
   * @emits end - the workflow has ended, see state for the way it ended
   */
  complete () {
    this.state = 'complete'
    this.emit('end', this)
  }

  /**
   * Sets the workflow state to 'cancelled' and wipes the data
   * @emits end - the workflow has ended, see state for the way it ended
   */
  cancel () {
    this.state = 'cancelled'
    this.data = null
    this.emit('end', this)
  }
}
