var index = (function (exports) {
  'use strict';

  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e,
        n,
        i,
        u,
        a = [],
        f = !0,
        o = !1;
      try {
        if (i = (t = t.call(r)).next, 0 === l) {
          if (Object(t) !== t) return;
          f = !1;
        } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
      } catch (r) {
        o = !0, n = r;
      } finally {
        try {
          if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
        _defineProperty(e, r, t[r]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
      });
    }
    return e;
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct.bind();
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }
    return _construct.apply(null, arguments);
  }
  function _isNativeFunction(fn) {
    try {
      return Function.toString.call(fn).indexOf("[native code]") !== -1;
    } catch (e) {
      return typeof fn === "function";
    }
  }
  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;
    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;
      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }
      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);
        _cache.set(Class, Wrapper);
      }
      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }
      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };
    return _wrapNativeSuper(Class);
  }
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
    return target;
  }
  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }
    return target;
  }
  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }
  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }
    return _assertThisInitialized(self);
  }
  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
        result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn(this, result);
    };
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
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
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  var _excluded = ["name", "id", "steps"],
    _excluded2 = ["id", "workflowId", "name", "data", "next"];
  /**
   * Tinyflow is a minimalistic workflow engine with
   * easy customization.
   * You can use it with any JavaScript runtime as it
   * makes no use of any runtime-specifics.
   * @type {object}
   */
  var Tinyflow = {};

  // ----------------------------------------------------------------------------
  // Internal Variables
  // ----------------------------------------------------------------------------
  var _ = {
    /**
     * All registered extensions
     */
    extensions: new Map(),
    /**
     * Contains all created, non-disposed instances
     */
    instances: new Map(),
    /**
     * The default id generation. You obviously want to use the {Tinyflow.extend} method to bring your own
     * @private
     */
    id: function id() {
      return Math.random().toString(16).substring(2, 16);
    },
    /**
     * Listeners are mapped by emitters
     * in WeakMap in order to have GC remove them,
     * if the emitter is cleared
     * @private
     * @type {WeakMap<object, any>}
     */
    listeners: new WeakMap()
  };

  // make available as local variables
  // without the need for the _. prefix
  var extensions = _.extensions,
    listeners = _.listeners,
    instances = _.instances;

  /**
   * Get the listeners for a given emitter.
   * Always returns an array.
   *
   * @private
   * @param emitter {Emitter}
   * @param name {string }
   * @returns {function[]}
   */
  listeners.by = function (emitter, name) {
    if (!listeners.has(emitter)) {
      listeners.set(emitter, new Map());
    }
    return listeners.get(emitter).get(name) || [];
  };

  // ----------------------------------------------------------------------------
  // Public API
  // ----------------------------------------------------------------------------
  /**
   * Extend Tinyflow functionality. In contrast to register an extension this
   * method allows to extend Tinyflows core functionality.
   * @param fn
   */
  Tinyflow.extend = function (fn) {
    return fn(_);
  };

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
   * Clears all extensions and instances. By default, all engines are shut down
   * and fire the end event.
   * @method
   * @param options {object=} options
   * @param options.extensions {boolean=} signal to clear all extensions
   */
  Tinyflow.clear = function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
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
    if (options.extensions) {
      extensions.clear();
    }
  };

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
  Tinyflow.use = function (name, handler) {
    var fn = handler === null ? extensions["delete"] : extensions.set;
    fn.call(extensions, name, handler);
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
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$force = _ref.force,
      force = _ref$force === void 0 ? false : _ref$force;
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

  // ----------------------------------------------------------------------------
  // Internal Implementations
  // ----------------------------------------------------------------------------
  var tick = function tick(fn) {
    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return setTimeout(fn, t);
  };
  var promisify = function promisify(fn, args) {
    return new Promise(function (res, rej) {
      try {
        res(fn.apply(void 0, _toConsumableArray(args)));
      } catch (e) {
        rej(e);
      }
    });
  };

  /**
   * @class
   * A tiny emitter that provides just the bare minimum.
   */
  var Emitter = /*#__PURE__*/function () {
    function Emitter() {
      _classCallCheck(this, Emitter);
    }
    _createClass(Emitter, [{
      key: "count",
      value:
      /**
       * returns the size
       * @return {number}
       */
      function count() {
        return listeners.by(this, name).length;
      }

      /**
       * Attach a new listener
       * @param name {string}
       * @param fn {function}
       */
    }, {
      key: "on",
      value: function on(name, fn) {
        var list = listeners.by(this, name);
        list.push(fn);
        listeners.get(this).set(name, list);
      }
    }, {
      key: "once",
      value: function once(name, fn) {
        fn.once = true;
        this.on(name, fn);
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
    }, {
      key: "off",
      value: function off(name, fn) {
        if (!name) {
          listeners.get(this).clear();
          return; // exit
        }

        var list = listeners.by(this, name);
        if (!fn) {
          list.length = 0;
        }
        var index = list.length > 0 && list.findIndex(function (f) {
          return f === fn;
        });
        if (index > -1) {
          list.splice(index, 1);
        } else {
          throw new TinyflowError("No listener found by function for event ".concat(name), {
            id: this.id,
            name: this.name
          });
        }
        listeners.get(this).set(name, list);
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
    }, {
      key: "emit",
      value: function emit(name, data) {
        var _this = this;
        var list = listeners.by(this, name).reverse();
        var _loop = function _loop() {
          var f = list[i];
          tick(function () {
            promisify(f, [data])["catch"](function (e) {
              return _this.emit('error', {
                error: e,
                source: _this
              });
            });
          });
          if (f.once) {
            list.splice(i, 1);
          }
        };
        for (var i = list.length - 1; i >= 0; i--) {
          _loop();
        }
        listeners.get(this).set(name, list);
      }
    }]);
    return Emitter;
  }();
  /**
   * A minimal Error extension to add
   * details
   * @class
   */
  var TinyflowError = /*#__PURE__*/function (_Error) {
    _inherits(TinyflowError, _Error);
    var _super = _createSuper(TinyflowError);
    function TinyflowError(message, details) {
      var _this2;
      _classCallCheck(this, TinyflowError);
      _this2 = _super.call(this, message);
      _this2.name = 'TinyflowError';
      _this2.details = details;
      return _this2;
    }
    return _createClass(TinyflowError);
  }( /*#__PURE__*/_wrapNativeSuper(Error));
  var runExtensions = function runExtensions(_ref2) {
    var workflow = _ref2.workflow,
      step = _ref2.step,
      onSuccess = _ref2.onSuccess,
      onError = _ref2.onError;
    var target = workflow || step;
    Promise.all(Object.keys(target.custom).filter(function (key) {
      return extensions.has(key);
    }).map(function (name) {
      var fn = extensions.get(name);
      var value = target.custom[name];
      return fn(value, {
        workflow: workflow,
        step: step
      });
    })).then(onSuccess)["catch"](onError);
  };

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
   * @see {Tinyflow.create}
   */
  var Workflow = /*#__PURE__*/function (_Emitter) {
    _inherits(Workflow, _Emitter);
    var _super2 = _createSuper(Workflow);
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
    function Workflow(_ref3) {
      var _this3;
      var name = _ref3.name,
        id = _ref3.id,
        _ref3$steps = _ref3.steps,
        steps = _ref3$steps === void 0 ? {} : _ref3$steps,
        custom = _objectWithoutProperties(_ref3, _excluded);
      _classCallCheck(this, Workflow);
      _this3 = _super2.call(this);
      _this3.name = name;
      _this3.id = id || _.id();
      _this3.data = null;
      _this3.state = 'pending';
      _this3.custom = {};
      _this3.history = [];

      // parse extensions
      var stepExt = {};
      Object.entries(custom).forEach(function (_ref4) {
        var _ref5 = _slicedToArray(_ref4, 2),
          key = _ref5[0],
          val = _ref5[1];
        // if extensions are not defined as array, we
        // assume them to run in global scope
        var _ref6 = Array.isArray(val) ? val : [val, 'all'],
          _ref7 = _slicedToArray(_ref6, 2),
          fn = _ref7[0],
          scope = _ref7[1];

        // attach extensions for workflows directly
        if (['all', 'workflow'].includes(scope)) {
          _this3.custom[key] = fn;
        }
        // attach extensions for steps to temp object,
        // so we can use them in the step parsing
        // note, that if a step defines the extensions as null
        // then it will prevent this extension for this step
        if (['all', 'steps'].includes(scope)) {
          stepExt[key] = fn;
        }
      });
      _this3.steps = Object.entries(steps).map(function (_ref8, index, array) {
        var _ref9 = _slicedToArray(_ref8, 2),
          name = _ref9[0],
          value = _ref9[1];
        var next = index < array.length - 1 ? index + 1 : null;
        return _objectSpread2(_objectSpread2({
          next: next,
          name: name
        }, stepExt), value);
      });
      if (_this3.steps.length === 0) {
        throw new TinyflowError('Workflow steps must have at least one entry, got 0', {
          name: name,
          id: id
        });
      }

      /**
       * The current step
       * @type {Step|null}
       */
      _this3.current = null;
      return _this3;
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
    _createClass(Workflow, [{
      key: "start",
      value: function start() {
        var _this4 = this;
        var _ref10 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          autoStep = _ref10.autoStep;
        if (this.state === 'active') {
          throw new TinyflowError("Cannot start active workflow", {
            name: this.name,
            id: this.id
          });
        }
        this.data = Object.create(null);
        var workflow = this;
        runExtensions({
          workflow: workflow,
          onSuccess: function onSuccess() {
            _this4.state = 'active';
            _this4.emit('started', _this4);
            if (autoStep !== false) {
              _this4.step(0);
            }
          },
          onError: function onError(e) {
            return _this4.emit('error', {
              error: e,
              workflow: workflow
            });
          }
        });
      }

      /**
       * Sets a given step by name or index as the new current one.
       * This method is for manually setting the next step.
       * If you want the engine to automatically set the next step you
       * should rather end the current step using step.complete or step.cancel
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
    }, {
      key: "step",
      value: function step(indexOrName) {
        var _this5 = this;
        var _ref11 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          stepId = _ref11.stepId,
          autoOnEnd = _ref11.autoOnEnd;
        if (this.state !== 'active') {
          throw new TinyflowError("Can only step in an active state, got \"".concat(this.state, "\""), {
            indexOrName: indexOrName,
            name: this.name,
            id: this.id
          });
        }
        var stepDef = typeof indexOrName === 'number' ? this.steps[indexOrName] : this.steps.find(function (_ref12) {
          var name = _ref12.name;
          return name === indexOrName;
        });
        if (!stepDef) {
          throw new TinyflowError("Expected step definition, got ".concat(stepDef), {
            indexOrName: indexOrName,
            name: this.name,
            id: this.id
          });
        }
        var id = stepId || _.id();
        var workflowId = this.id;
        var step = new Step(_objectSpread2({
          id: id,
          workflowId: workflowId
        }, stepDef));
        var workflow = this;
        var endStep = function endStep(step) {
          if (step) {
            step.off();
            // for a most simple audit we save a minimal set of data
            // that allows for reproduction or implementing a "back to previous"
            // procedure, for example using extensions or other externals
            _this5.history.push({
              name: step.name,
              data: _objectSpread2({}, step.data),
              at: new Date()
            });
          }
          return true;
        };
        if (autoOnEnd !== false) {
          step.once('end', function (step) {
            workflow.data[step.name] = _objectSpread2({}, step.data);
            var next = step.next;
            return next !== null && next <= workflow.steps.length - 1 ? tick(function () {
              return workflow.step(next);
            }) : endStep(step) && workflow.complete();
          });
        }
        step.start();
        endStep(this.current);
        this.current = step;
        this.emit('step', this);
      }

      /**
       * Completes the workflow, sets the current step to null
       * and the state to "complete".
       * Does not delete the workflow data as opposed to the cancel event
       * @emits end - the workflow has ended, see the state property for in which state it ended
       */
    }, {
      key: "complete",
      value: function complete() {
        if (this.current) {
          this.current.off();
        }
        this.current = null;
        this.state = 'complete';
        this.emit('end', this);
      }

      /**
       *
       *Completes the workflow but also wiped it's data
       * and sets state as "cancelled"
       * @emits end - the workflow has ended, see the state property for in which state it ended
       */
    }, {
      key: "cancel",
      value: function cancel() {
        if (this.current) {
          this.current.off();
        }
        this.data = null;
        this.current = null;
        this.state = 'complete';
        this.emit('end', this);
      }
    }]);
    return Workflow;
  }(Emitter);

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
  var Step = /*#__PURE__*/function (_Emitter2) {
    _inherits(Step, _Emitter2);
    var _super3 = _createSuper(Step);
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
    function Step(_ref13) {
      var _this6;
      var id = _ref13.id,
        workflowId = _ref13.workflowId,
        name = _ref13.name,
        _ref13$data = _ref13.data,
        data = _ref13$data === void 0 ? null : _ref13$data,
        next = _ref13.next,
        custom = _objectWithoutProperties(_ref13, _excluded2);
      _classCallCheck(this, Step);
      _this6 = _super3.call(this);
      _this6.id = id || _.id();
      _this6.workflowId = workflowId;
      _this6.name = name;
      _this6.next = next;
      _this6.custom = custom;
      _this6.state = 'pending';
      _this6.data = data;
      return _this6;
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
    _createClass(Step, [{
      key: "start",
      value: function start() {
        var _this7 = this;
        if (this.state === 'active') {
          throw new TinyflowError("Cannot start a step in active state", {
            name: this.name,
            id: this.id,
            wf: this.workflowId
          });
        }
        this.data = this.data || Object.create(null);
        var step = this;
        runExtensions({
          step: step,
          onSuccess: function onSuccess() {
            _this7.state = 'active';
            _this7.emit('started', _this7);
          },
          onError: function onError(e) {
            return _this7.emit('error', {
              error: e,
              step: step
            });
          }
        });
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
    }, {
      key: "update",
      value: function update(data) {
        this.data = Object.create(null);
        Object.assign(this.data, data);
        this.emit('update', this);
      }

      /**
       * Sets the workflow state to 'complete'
       * @emits end - the workflow has ended, see state for the way it ended
       */
    }, {
      key: "complete",
      value: function complete() {
        this.state = 'complete';
        this.emit('end', this);
      }

      /**
       * Sets the workflow state to 'cancelled' and wipes the data
       * @emits end - the workflow has ended, see state for the way it ended
       */
    }, {
      key: "cancel",
      value: function cancel() {
        this.state = 'cancelled';
        this.data = null;
        this.emit('end', this);
      }
    }]);
    return Step;
  }(Emitter);

  exports.Step = Step;
  exports.Tinyflow = Tinyflow;
  exports.Workflow = Workflow;

  return exports;

})({});
//# sourceMappingURL=Tinyflow.iife.js.map
