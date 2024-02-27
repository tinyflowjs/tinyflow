var withInstances = (function (exports) {
  'use strict';

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;
        var F = function () {};
        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true,
      didErr = false,
      err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  /**
   * @namespace Tinyflow
   */

  /**
   * Tinyflow extension to manage instances (create, get, dispose).
   * @function
   * @export
   * @return {function(*, {Workflow: *, Tinyflow: *, TinyflowError: *}): function(): void}
   */
  var withInstances = function withInstances( /* config */
  ) {
    return function (internal, _ref) {
      var Workflow = _ref.Workflow,
        Tinyflow = _ref.Tinyflow,
        TinyflowError = _ref.TinyflowError;
      internal.instances = new Map();
      var instances = internal.instances,
        listeners = internal.listeners;

      /**
       * Gets a workflow instance by its id
       * @method
       * @param id {string}
       * @returns {Workflow}
       */
      Tinyflow.get = function (id) {
        return instances.get(id);
      };

      /**
       * Returns all non-disposed workflows of any state.
       * @method
       * @return {Workflow[]}
       */
      Tinyflow.all = function () {
        return _toConsumableArray(instances.values());
      };

      /**
       * Clears all instances. By default, all engines are shut down
       * and fire the end event.
       * @method
       */
      Tinyflow.clear = function () {
        var ids = _toConsumableArray(instances.keys());
        var _iterator = _createForOfIteratorHelper(ids),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var instanceId = _step.value;
            var workflow = Tinyflow.get(instanceId);
            workflow.cancel();
            Tinyflow.dispose(instanceId);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      };

      /**
       * Creates a new workflow instance by given workflow definitions.
       *
       * @param definition {object} the workflow definitions object
       * @returns {Workflow}
       */
      Tinyflow.create = function (definition) {
        var workflow = new Workflow(definition);
        instances.set(workflow.id, workflow);
        return workflow;
      };

      /**
       * Fully disposes a workflow, including any event listener
       * to it, or its current step.
       * Once complete it will finally remove the workflow from
       * the internal instances list.
       * @param instanceId {string}
       * @param force {boolean=}
       */
      Tinyflow.dispose = function (instanceId) {
        var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref2$force = _ref2.force,
          force = _ref2$force === void 0 ? false : _ref2$force;
        var workflow = instances.get(instanceId);
        if (!workflow) {
          throw new TinyflowError("Workflow does not exist by id ".concat(instanceId));
        }
        if (!force && workflow.state === 'active') {
          throw new TinyflowError("Cannot dispose active workflow \"".concat(workflow.name, "\""), {
            instanceId: instanceId
          });
        }
        if (workflow.current) {
          workflow.current.off();
          workflow.current = null;
        }
        workflow.off();
        listeners["delete"](workflow);
        instances["delete"](instanceId);
      };

      // dispose method for complete cleanup of this extension
      return function () {
        delete internal.instances;
        delete Tinyflow.get;
        delete Tinyflow.all;
        delete Tinyflow.clear;
        delete Tinyflow.create;
        delete Tinyflow.dispose;
      };
    };
  };

  exports.withInstances = withInstances;

  return exports;

})({});
//# sourceMappingURL=withInstances.iife.js.map
