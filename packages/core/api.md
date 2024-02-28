## Classes

<dl>
<dt><a href="#Emitter">Emitter</a></dt>
<dd><p>A tiny emitter that provides just the bare minimum.</p>
</dd>
<dt><a href="#TinyflowError">TinyflowError</a></dt>
<dd><p>A minimal Error extension to add
details</p>
</dd>
<dt><a href="#Workflow">Workflow</a></dt>
<dd><p>The main workflow execution class,
defined by the given definitions file.</p>
<p>Initial state is pending, until <code>start()</code> is called.
Hooks will not run when pending.</p>
<p>Next step is defined either by <code>next</code> being defined in the current step
or by user explicitly set the name or index of the step.
It&#39;s up to you to handle permissions for any of these methods.</p>
<p>Emits various events, see the respective method documentation.</p>
</dd>
<dt><a href="#Step">Step</a></dt>
<dd><p>Represents an executable unit of a workflow.
Steps work best when they are atomically related to exactly one
task. It is up to the user to define and implement what such
a task might be.
Examples of tasks can be fetching data from an endpoint or
users submitting a form.
Just make sure a step does not involve multiple tasks.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#Tinyflow">Tinyflow</a> : <code>object</code></dt>
<dd><p>Tinyflow is a minimalistic workflow engine with
easy customization.
You can use it with any JavaScript runtime as it
makes no use of any runtime-specifics.</p>
</dd>
</dl>

<a name="Emitter"></a>

## Emitter
A tiny emitter that provides just the bare minimum.

**Kind**: global class  

* [Emitter](#Emitter)
    * [.on(name, fn)](#Emitter+on)
    * [.once(name, fn)](#Emitter+once)
    * [.off([name], [fn])](#Emitter+off)
    * [.emit(name, [data])](#Emitter+emit)

<a name="Emitter+on"></a>

### emitter.on(name, fn)
Attach a new listener

**Kind**: instance method of [<code>Emitter</code>](#Emitter)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| fn | <code>function</code> | 

<a name="Emitter+once"></a>

### emitter.once(name, fn)
Fires a listener exactly once and then removes it

**Kind**: instance method of [<code>Emitter</code>](#Emitter)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| fn | <code>function</code> | 

<a name="Emitter+off"></a>

### emitter.off([name], [fn])
Remove listeners. Has multiple combinations:
- if no arg at all is passed will remove **everything**
- if only name is passed will remove all listeners by name
- if name and function is passed will remove only this specific
  listener, if it has been attached before

**Kind**: instance method of [<code>Emitter</code>](#Emitter)  

| Param | Type |
| --- | --- |
| [name] | <code>string</code> | 
| [fn] | <code>function</code> | 

<a name="Emitter+emit"></a>

### emitter.emit(name, [data])
Fires a new single event for this emitter.
If a listener was registered with the "once" flag
then it will only be fired once, then removed
from the listeners list.

Additional data can be added by an exact single second
argument. Use an object if you have complex data to
submit during the event.

**Kind**: instance method of [<code>Emitter</code>](#Emitter)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of the event |
| [data] | <code>any</code> | optional data |

<a name="TinyflowError"></a>

## TinyflowError
A minimal Error extension to add
details

**Kind**: global class  
<a name="Workflow"></a>

## Workflow
The main workflow execution class,
defined by the given definitions file.

Initial state is pending, until `start()` is called.
Hooks will not run when pending.

Next step is defined either by `next` being defined in the current step
or by user explicitly set the name or index of the step.
It's up to you to handle permissions for any of these methods.

Emits various events, see the respective method documentation.

**Kind**: global class  
**See**: {Tinyflow.use}  

* [Workflow](#Workflow)
    * [new Workflow(name, id, steps, custom)](#new_Workflow_new)
    * [.current](#Workflow+current) : [<code>Step</code>](#Step) \| <code>null</code>
    * [.start([if])](#Workflow+start)
    * [.step(indexOrName, [options])](#Workflow+step)
    * [.complete()](#Workflow+complete)
    * [.cancel()](#Workflow+cancel)

<a name="new_Workflow_new"></a>

### new Workflow(name, id, steps, custom)
Creates a new instance. Any properties in the definitions, hat are not
one of name, id or steps are considered "custom" and are (optionally) handled
by their respective extensions (if registered).

**Throws**:

- [<code>TinyflowError</code>](#TinyflowError) if steps are not defined or have length of 0


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of the workflow |
| id | <code>string</code> | identifier of this instance of the workflow (in case you run multiple of the same) |
| steps | <code>object</code> | the workflows step definitions |
| custom | <code>object</code> | contains all custom properties of this workflow's definitions |

<a name="Workflow+current"></a>

### workflow.current : [<code>Step</code>](#Step) \| <code>null</code>
The current step

**Kind**: instance property of [<code>Workflow</code>](#Workflow)  
<a name="Workflow+start"></a>

### workflow.start([if])
Starts the workflow, runs through all extensions.
Extensions are caught in a separate Microtask (Promise.catch) and will
not cause the workflow start to cancel.
Sets thw workflow state to "active"

**Kind**: instance method of [<code>Workflow</code>](#Workflow)  
**Throws**:

- [<code>TinyflowError</code>](#TinyflowError) if the state is other than "pending"

**Emits**: <code>started - when the workflow instance has successfully started (state became &#x27;active&#x27;)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [if] | <code>autoStep</code> | set to false it will not automatically step into the first available step |

<a name="Workflow+step"></a>

### workflow.step(indexOrName, [options])
Sets a given step by name or index as the new current one.
This method is for manually setting the next step.
If you want the engine to automatically set the next step you
should rather end the current step using {Step.prototype.complete} or {Step.prototype.cancel}!

When a new step is set, the current step will be disposed properly,
so you don't have to do it.

Will listen to the new step's "end" event and automatically
determine the next step to choose or to end the workflow.

**Kind**: instance method of [<code>Workflow</code>](#Workflow)  
**Throws**:

- [<code>TinyflowError</code>](#TinyflowError) if no step is found by index or name

**Emits**: <code>event:step - when the new step is properly set up and active</code>  

| Param | Type | Description |
| --- | --- | --- |
| indexOrName | <code>string</code> \| <code>number</code> \| <code>null</code> | index of the step in linear flows or name of the step in non-linear flows |
| [options] | <code>object</code> |  |
| [options.stepId] | <code>string</code> | an optional |
| [options.autoOnEnd] | <code>boolean</code> | set to true to prevent workflow from automatically handling the next step   if the current step ends |

<a name="Workflow+complete"></a>

### workflow.complete()
Completes the workflow, sets the current step to null
and the state to "complete".
Does not delete the workflow data as opposed to the cancel event

**Kind**: instance method of [<code>Workflow</code>](#Workflow)  
**Emits**: <code>end - the workflow has ended,event: see the state property for in which state it ended</code>  
<a name="Workflow+cancel"></a>

### workflow.cancel()
Completes the workflow but also wiped it's data
and sets state as "cancelled"

**Kind**: instance method of [<code>Workflow</code>](#Workflow)  
**Emits**: <code>end - the workflow has ended,event: see the state property for in which state it ended</code>  
<a name="Step"></a>

## Step
Represents an executable unit of a workflow.
Steps work best when they are atomically related to exactly one
task. It is up to the user to define and implement what such
a task might be.
Examples of tasks can be fetching data from an endpoint or
users submitting a form.
Just make sure a step does not involve multiple tasks.

**Kind**: global class  

* [Step](#Step)
    * [new Step(id, workflowId, name, [data], next, ...custom)](#new_Step_new)
    * [.start()](#Step+start)
    * [.update(data)](#Step+update)
    * [.complete()](#Step+complete)
    * [.cancel()](#Step+cancel)

<a name="new_Step_new"></a>

### new Step(id, workflowId, name, [data], next, ...custom)
Creates a new step instance


| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> |  |
| workflowId | <code>string</code> |  |
| name | <code>string</code> |  |
| [data] | <code>object</code> | optional data from start of the workflow |
| next | <code>string</code> \| <code>number</code> \| <code>undefined</code> |  |
| ...custom | <code>object</code> | all other properties that will be passed on to your custom handlers |

<a name="Step+start"></a>

### step.start()
Starts the step, changing its state from 'pending' to active.

Note: This method is usually called by the workflow automatically. You
should by default not have the need to call this method.

Runs through all extensions.

Extensions are caught in a separate Microtask (Promise.catch) and will
not cause the step-start to cancel.

**Kind**: instance method of [<code>Step</code>](#Step)  
**Throws**:

- [<code>TinyflowError</code>](#TinyflowError) if the current state is other than "pending"

**Emits**: <code>started - when the step instance has successfully started (state became &#x27;active&#x27;)</code>  
<a name="Step+update"></a>

### step.update(data)
Updates the step's data (hard-override!)
Use it's existing data to merge

**Kind**: instance method of [<code>Step</code>](#Step)  
**Emits**: <code>event:update - the step&#x27;s data has updated</code>  

| Param | Type |
| --- | --- |
| data | <code>object</code> | 

**Example**  
```js
step.update({ foo: 1 }) // { foo: 1}
step.update({ bar: 2, ...step.data }) // { foo: 1, bar: 2 }
```
<a name="Step+complete"></a>

### step.complete()
Sets the workflow state to 'complete'

**Kind**: instance method of [<code>Step</code>](#Step)  
**Emits**: <code>end - the workflow has ended,event: see state for the way it ended</code>  
<a name="Step+cancel"></a>

### step.cancel()
Sets the workflow state to 'cancelled' and wipes the data

**Kind**: instance method of [<code>Step</code>](#Step)  
**Emits**: <code>end - the workflow has ended,event: see state for the way it ended</code>  
<a name="Tinyflow"></a>

## Tinyflow : <code>object</code>
Tinyflow is a minimalistic workflow engine with
easy customization.
You can use it with any JavaScript runtime as it
makes no use of any runtime-specifics.

**Kind**: global constant  

* [Tinyflow](#Tinyflow) : <code>object</code>
    * [.extend(fn)](#Tinyflow.extend)
    * [.use(name, handler)](#Tinyflow.use)

<a name="Tinyflow.extend"></a>

### Tinyflow.extend(fn)
Extend Tinyflow functionality. In contrast to register an extension this
method allows to extend Tinyflows core functionality.

**Kind**: static method of [<code>Tinyflow</code>](#Tinyflow)  

| Param |
| --- |
| fn | 

<a name="Tinyflow.use"></a>

### Tinyflow.use(name, handler)
Register an extension by name. Extensions run on workflow-properties that
are not part of the engine core.
Core properties are currently: id, next, name, prev

Extensions can be registered for workflows and/or steps, which can be determined by
the second parameter of their callback.

Callbacks can also be async, but they're not awaited (only caught).
If callback is null then the extension will be removed.

**Kind**: static method of [<code>Tinyflow</code>](#Tinyflow)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of the property to register an extension |
| handler | <code>null</code> \| <code>function</code> | callback to execute |

