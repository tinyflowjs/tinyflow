export const byInstances = (internal, { Workflow, Tinyflow, TinyflowError }) => {
  internal.instances = new Map()
  const { extensions, instances, listeners } = internal


  /**
   * Gets a workflow instance by its id
   * @method
   * @param id {string}
   * @returns {Workflow}
   */
  Tinyflow.get = id => instances.get(id)

  /**
   * Returns all non-disposed workflows of any state.
   * @method
   * @return {Workflow[]}
   */
  Tinyflow.all = () => [...instances.values()]

  /**
   * Clears all extensions and instances. By default, all engines are shut down
   * and fire the end event.
   * @method
   * @param options {object=} options
   * @param options.extensions {boolean=} signal to clear all extensions
   */
  Tinyflow.clear = (options = {}) => {
    const ids = [...instances.keys()]
    for (const instanceId of ids) {
      const workflow = Tinyflow.get(instanceId)
      workflow.cancel()
      Tinyflow.dispose(instanceId)
    }
    if (options.extensions) {
      extensions.clear()
    }
  }

  /**
   * Creates a new workflow instance by given workflow definitions.
   *
   * @param definition {object} the workflow definitions object
   * @returns {Workflow}
   */
  Tinyflow.create = (definition) => {
    const workflow = new Workflow(definition)
    instances.set(workflow.id, workflow)
    return workflow
  }

  /**
   * Fully disposes a workflow, including any event listener
   * to it, or its current step.
   * Once complete it will finally remove the workflow from
   * the internal instances list.
   * @param instanceId {string}
   * @param force {boolean=}
   */
  Tinyflow.dispose = (instanceId, { force = false } = {}) => {
    const workflow = instances.get(instanceId)
    if (!workflow) {
      throw new TinyflowError(`Workflow does not exist by id ${instanceId}`)
    }
    if (!force && workflow.state === 'active') {
      throw new TinyflowError(`Cannot dispose active workflow "${workflow.name}"`, { instanceId })
    }
    if (workflow.current) {
      workflow.current.off()
      workflow.current = null
    }
    workflow.off()
    listeners.delete(workflow)
    instances.delete(instanceId)
  }
}