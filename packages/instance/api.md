## Objects

<dl>
<dt><a href="#Tinyflow">Tinyflow</a> : <code>object</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#withInstances">withInstances()</a> ⇒ <code>function</code></dt>
<dd><p>Tinyflow extension to manage instances (create, get, dispose).</p>
</dd>
</dl>

<a name="Tinyflow"></a>

## Tinyflow : <code>object</code>
**Kind**: global namespace  

* [Tinyflow](#Tinyflow) : <code>object</code>
    * [.get(id)](#Tinyflow.get) ⇒ <code>Workflow</code>
    * [.all()](#Tinyflow.all) ⇒ <code>Array.&lt;Workflow&gt;</code>
    * [.clear()](#Tinyflow.clear)
    * [.create(definition)](#Tinyflow.create) ⇒ <code>Workflow</code>
    * [.dispose(instanceId, [force])](#Tinyflow.dispose)

<a name="Tinyflow.get"></a>

### Tinyflow.get(id) ⇒ <code>Workflow</code>
Gets a workflow instance by its id

**Kind**: static method of [<code>Tinyflow</code>](#Tinyflow)  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 

<a name="Tinyflow.all"></a>

### Tinyflow.all() ⇒ <code>Array.&lt;Workflow&gt;</code>
Returns all non-disposed workflows of any state.

**Kind**: static method of [<code>Tinyflow</code>](#Tinyflow)  
<a name="Tinyflow.clear"></a>

### Tinyflow.clear()
Clears all instances. By default, all engines are shut down
and fire the end event.

**Kind**: static method of [<code>Tinyflow</code>](#Tinyflow)  
<a name="Tinyflow.create"></a>

### Tinyflow.create(definition) ⇒ <code>Workflow</code>
Creates a new workflow instance by given workflow definitions.

**Kind**: static method of [<code>Tinyflow</code>](#Tinyflow)  

| Param | Type | Description |
| --- | --- | --- |
| definition | <code>object</code> | the workflow definitions object |

<a name="Tinyflow.dispose"></a>

### Tinyflow.dispose(instanceId, [force])
Fully disposes a workflow, including any event listener
to it, or its current step.
Once complete it will finally remove the workflow from
the internal instances list.

**Kind**: static method of [<code>Tinyflow</code>](#Tinyflow)  

| Param | Type |
| --- | --- |
| instanceId | <code>string</code> | 
| [force] | <code>boolean</code> | 

<a name="withInstances"></a>

## withInstances() ⇒ <code>function</code>
Tinyflow extension to manage instances (create, get, dispose).

**Kind**: global function  
