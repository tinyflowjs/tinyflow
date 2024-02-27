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

