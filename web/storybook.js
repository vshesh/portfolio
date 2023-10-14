var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};

// node_modules/mithril/render/vnode.js
var require_vnode = __commonJS((exports, module) => {
  var Vnode = function(tag, key, attrs, children, text, dom) {
    return { tag, key, attrs, children, text, dom, domSize: undefined, state: undefined, events: undefined, instance: undefined };
  };
  Vnode.normalize = function(node) {
    if (Array.isArray(node))
      return Vnode("[", undefined, undefined, Vnode.normalizeChildren(node), undefined, undefined);
    if (node == null || typeof node === "boolean")
      return null;
    if (typeof node === "object")
      return node;
    return Vnode("#", undefined, undefined, String(node), undefined, undefined);
  };
  Vnode.normalizeChildren = function(input) {
    var children = [];
    if (input.length) {
      var isKeyed = input[0] != null && input[0].key != null;
      for (var i = 1;i < input.length; i++) {
        if ((input[i] != null && input[i].key != null) !== isKeyed) {
          throw new TypeError(isKeyed && (input[i] != null || typeof input[i] === "boolean") ? "In fragments, vnodes must either all have keys or none have keys. You may wish to consider using an explicit keyed empty fragment, m.fragment({key: ...}), instead of a hole." : "In fragments, vnodes must either all have keys or none have keys.");
        }
      }
      for (var i = 0;i < input.length; i++) {
        children[i] = Vnode.normalize(input[i]);
      }
    }
    return children;
  };
  module.exports = Vnode;
});

// node_modules/mithril/render/hyperscriptVnode.js
var require_hyperscriptVnode = __commonJS((exports, module) => {
  var Vnode = require_vnode();
  module.exports = function() {
    var attrs = arguments[this], start = this + 1, children;
    if (attrs == null) {
      attrs = {};
    } else if (typeof attrs !== "object" || attrs.tag != null || Array.isArray(attrs)) {
      attrs = {};
      start = this;
    }
    if (arguments.length === start + 1) {
      children = arguments[start];
      if (!Array.isArray(children))
        children = [children];
    } else {
      children = [];
      while (start < arguments.length)
        children.push(arguments[start++]);
    }
    return Vnode("", attrs.key, attrs, children);
  };
});

// node_modules/mithril/util/hasOwn.js
var require_hasOwn = __commonJS((exports, module) => {
  module.exports = {}.hasOwnProperty;
});

// node_modules/mithril/render/hyperscript.js
var require_hyperscript = __commonJS((exports, module) => {
  var isEmpty = function(object) {
    for (var key in object)
      if (hasOwn.call(object, key))
        return false;
    return true;
  };
  var compileSelector = function(selector) {
    var match, tag = "div", classes = [], attrs = {};
    while (match = selectorParser.exec(selector)) {
      var type = match[1], value = match[2];
      if (type === "" && value !== "")
        tag = value;
      else if (type === "#")
        attrs.id = value;
      else if (type === ".")
        classes.push(value);
      else if (match[3][0] === "[") {
        var attrValue = match[6];
        if (attrValue)
          attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\");
        if (match[4] === "class")
          classes.push(attrValue);
        else
          attrs[match[4]] = attrValue === "" ? attrValue : attrValue || true;
      }
    }
    if (classes.length > 0)
      attrs.className = classes.join(" ");
    return selectorCache[selector] = { tag, attrs };
  };
  var execSelector = function(state, vnode) {
    var attrs = vnode.attrs;
    var hasClass = hasOwn.call(attrs, "class");
    var className = hasClass ? attrs.class : attrs.className;
    vnode.tag = state.tag;
    vnode.attrs = {};
    if (!isEmpty(state.attrs) && !isEmpty(attrs)) {
      var newAttrs = {};
      for (var key in attrs) {
        if (hasOwn.call(attrs, key))
          newAttrs[key] = attrs[key];
      }
      attrs = newAttrs;
    }
    for (var key in state.attrs) {
      if (hasOwn.call(state.attrs, key) && key !== "className" && !hasOwn.call(attrs, key)) {
        attrs[key] = state.attrs[key];
      }
    }
    if (className != null || state.attrs.className != null)
      attrs.className = className != null ? state.attrs.className != null ? String(state.attrs.className) + " " + String(className) : className : state.attrs.className != null ? state.attrs.className : null;
    if (hasClass)
      attrs.class = null;
    for (var key in attrs) {
      if (hasOwn.call(attrs, key) && key !== "key") {
        vnode.attrs = attrs;
        break;
      }
    }
    return vnode;
  };
  var hyperscript = function(selector) {
    if (selector == null || typeof selector !== "string" && typeof selector !== "function" && typeof selector.view !== "function") {
      throw Error("The selector must be either a string or a component.");
    }
    var vnode = hyperscriptVnode.apply(1, arguments);
    if (typeof selector === "string") {
      vnode.children = Vnode.normalizeChildren(vnode.children);
      if (selector !== "[")
        return execSelector(selectorCache[selector] || compileSelector(selector), vnode);
    }
    vnode.tag = selector;
    return vnode;
  };
  var Vnode = require_vnode();
  var hyperscriptVnode = require_hyperscriptVnode();
  var hasOwn = require_hasOwn();
  var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g;
  var selectorCache = {};
  module.exports = hyperscript;
});

// node_modules/mithril/render/trust.js
var require_trust = __commonJS((exports, module) => {
  var Vnode = require_vnode();
  module.exports = function(html) {
    if (html == null)
      html = "";
    return Vnode("<", undefined, undefined, html, undefined, undefined);
  };
});

// node_modules/mithril/render/fragment.js
var require_fragment = __commonJS((exports, module) => {
  var Vnode = require_vnode();
  var hyperscriptVnode = require_hyperscriptVnode();
  module.exports = function() {
    var vnode = hyperscriptVnode.apply(0, arguments);
    vnode.tag = "[";
    vnode.children = Vnode.normalizeChildren(vnode.children);
    return vnode;
  };
});

// node_modules/mithril/hyperscript.js
var require_hyperscript2 = __commonJS((exports, module) => {
  var hyperscript = require_hyperscript();
  hyperscript.trust = require_trust();
  hyperscript.fragment = require_fragment();
  module.exports = hyperscript;
});

// node_modules/mithril/promise/polyfill.js
var require_polyfill = __commonJS((exports, module) => {
  var PromisePolyfill = function(executor) {
    if (!(this instanceof PromisePolyfill))
      throw new Error("Promise must be called with 'new'.");
    if (typeof executor !== "function")
      throw new TypeError("executor must be a function.");
    var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false);
    var instance = self._instance = { resolvers, rejectors };
    var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout;
    function handler(list, shouldAbsorb) {
      return function execute(value) {
        var then;
        try {
          if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
            if (value === self)
              throw new TypeError("Promise can't be resolved with itself.");
            executeOnce(then.bind(value));
          } else {
            callAsync(function() {
              if (!shouldAbsorb && list.length === 0)
                console.error("Possible unhandled promise rejection:", value);
              for (var i = 0;i < list.length; i++)
                list[i](value);
              resolvers.length = 0, rejectors.length = 0;
              instance.state = shouldAbsorb;
              instance.retry = function() {
                execute(value);
              };
            });
          }
        } catch (e) {
          rejectCurrent(e);
        }
      };
    }
    function executeOnce(then) {
      var runs = 0;
      function run(fn) {
        return function(value) {
          if (runs++ > 0)
            return;
          fn(value);
        };
      }
      var onerror = run(rejectCurrent);
      try {
        then(run(resolveCurrent), onerror);
      } catch (e) {
        onerror(e);
      }
    }
    executeOnce(executor);
  };
  PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
    var self = this, instance = self._instance;
    function handle(callback, list, next, state) {
      list.push(function(value) {
        if (typeof callback !== "function")
          next(value);
        else
          try {
            resolveNext(callback(value));
          } catch (e) {
            if (rejectNext)
              rejectNext(e);
          }
      });
      if (typeof instance.retry === "function" && state === instance.state)
        instance.retry();
    }
    var resolveNext, rejectNext;
    var promise = new PromisePolyfill(function(resolve, reject) {
      resolveNext = resolve, rejectNext = reject;
    });
    handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false);
    return promise;
  };
  PromisePolyfill.prototype.catch = function(onRejection) {
    return this.then(null, onRejection);
  };
  PromisePolyfill.prototype.finally = function(callback) {
    return this.then(function(value) {
      return PromisePolyfill.resolve(callback()).then(function() {
        return value;
      });
    }, function(reason) {
      return PromisePolyfill.resolve(callback()).then(function() {
        return PromisePolyfill.reject(reason);
      });
    });
  };
  PromisePolyfill.resolve = function(value) {
    if (value instanceof PromisePolyfill)
      return value;
    return new PromisePolyfill(function(resolve) {
      resolve(value);
    });
  };
  PromisePolyfill.reject = function(value) {
    return new PromisePolyfill(function(resolve, reject) {
      reject(value);
    });
  };
  PromisePolyfill.all = function(list) {
    return new PromisePolyfill(function(resolve, reject) {
      var total = list.length, count = 0, values = [];
      if (list.length === 0)
        resolve([]);
      else
        for (var i = 0;i < list.length; i++) {
          (function(i2) {
            function consume(value) {
              count++;
              values[i2] = value;
              if (count === total)
                resolve(values);
            }
            if (list[i2] != null && (typeof list[i2] === "object" || typeof list[i2] === "function") && typeof list[i2].then === "function") {
              list[i2].then(consume, reject);
            } else
              consume(list[i2]);
          })(i);
        }
    });
  };
  PromisePolyfill.race = function(list) {
    return new PromisePolyfill(function(resolve, reject) {
      for (var i = 0;i < list.length; i++) {
        list[i].then(resolve, reject);
      }
    });
  };
  module.exports = PromisePolyfill;
});

// node_modules/mithril/promise/promise.js
var require_promise = __commonJS((exports, module) => {
  var PromisePolyfill = require_polyfill();
  if (typeof window !== "undefined") {
    if (typeof window.Promise === "undefined") {
      window.Promise = PromisePolyfill;
    } else if (!window.Promise.prototype.finally) {
      window.Promise.prototype.finally = PromisePolyfill.prototype.finally;
    }
    module.exports = window.Promise;
  } else if (typeof global !== "undefined") {
    if (typeof global.Promise === "undefined") {
      global.Promise = PromisePolyfill;
    } else if (!global.Promise.prototype.finally) {
      global.Promise.prototype.finally = PromisePolyfill.prototype.finally;
    }
    module.exports = global.Promise;
  } else {
    module.exports = PromisePolyfill;
  }
});

// node_modules/mithril/render/render.js
var require_render = __commonJS((exports, module) => {
  var Vnode = require_vnode();
  module.exports = function($window) {
    var $doc = $window && $window.document;
    var currentRedraw;
    var nameSpace = {
      svg: "http://www.w3.org/2000/svg",
      math: "http://www.w3.org/1998/Math/MathML"
    };
    function getNameSpace(vnode) {
      return vnode.attrs && vnode.attrs.xmlns || nameSpace[vnode.tag];
    }
    function checkState(vnode, original) {
      if (vnode.state !== original)
        throw new Error("'vnode.state' must not be modified.");
    }
    function callHook(vnode) {
      var original = vnode.state;
      try {
        return this.apply(original, arguments);
      } finally {
        checkState(vnode, original);
      }
    }
    function activeElement() {
      try {
        return $doc.activeElement;
      } catch (e) {
        return null;
      }
    }
    function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
      for (var i = start;i < end; i++) {
        var vnode = vnodes[i];
        if (vnode != null) {
          createNode(parent, vnode, hooks, ns, nextSibling);
        }
      }
    }
    function createNode(parent, vnode, hooks, ns, nextSibling) {
      var tag = vnode.tag;
      if (typeof tag === "string") {
        vnode.state = {};
        if (vnode.attrs != null)
          initLifecycle(vnode.attrs, vnode, hooks);
        switch (tag) {
          case "#":
            createText(parent, vnode, nextSibling);
            break;
          case "<":
            createHTML(parent, vnode, ns, nextSibling);
            break;
          case "[":
            createFragment(parent, vnode, hooks, ns, nextSibling);
            break;
          default:
            createElement(parent, vnode, hooks, ns, nextSibling);
        }
      } else
        createComponent(parent, vnode, hooks, ns, nextSibling);
    }
    function createText(parent, vnode, nextSibling) {
      vnode.dom = $doc.createTextNode(vnode.children);
      insertNode(parent, vnode.dom, nextSibling);
    }
    var possibleParents = { caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup" };
    function createHTML(parent, vnode, ns, nextSibling) {
      var match = vnode.children.match(/^\s*?<(\w+)/im) || [];
      var temp = $doc.createElement(possibleParents[match[1]] || "div");
      if (ns === "http://www.w3.org/2000/svg") {
        temp.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\">" + vnode.children + "</svg>";
        temp = temp.firstChild;
      } else {
        temp.innerHTML = vnode.children;
      }
      vnode.dom = temp.firstChild;
      vnode.domSize = temp.childNodes.length;
      vnode.instance = [];
      var fragment = $doc.createDocumentFragment();
      var child;
      while (child = temp.firstChild) {
        vnode.instance.push(child);
        fragment.appendChild(child);
      }
      insertNode(parent, fragment, nextSibling);
    }
    function createFragment(parent, vnode, hooks, ns, nextSibling) {
      var fragment = $doc.createDocumentFragment();
      if (vnode.children != null) {
        var children = vnode.children;
        createNodes(fragment, children, 0, children.length, hooks, null, ns);
      }
      vnode.dom = fragment.firstChild;
      vnode.domSize = fragment.childNodes.length;
      insertNode(parent, fragment, nextSibling);
    }
    function createElement(parent, vnode, hooks, ns, nextSibling) {
      var tag = vnode.tag;
      var attrs = vnode.attrs;
      var is = attrs && attrs.is;
      ns = getNameSpace(vnode) || ns;
      var element = ns ? is ? $doc.createElementNS(ns, tag, { is }) : $doc.createElementNS(ns, tag) : is ? $doc.createElement(tag, { is }) : $doc.createElement(tag);
      vnode.dom = element;
      if (attrs != null) {
        setAttrs(vnode, attrs, ns);
      }
      insertNode(parent, element, nextSibling);
      if (!maybeSetContentEditable(vnode)) {
        if (vnode.children != null) {
          var children = vnode.children;
          createNodes(element, children, 0, children.length, hooks, null, ns);
          if (vnode.tag === "select" && attrs != null)
            setLateSelectAttrs(vnode, attrs);
        }
      }
    }
    function initComponent(vnode, hooks) {
      var sentinel;
      if (typeof vnode.tag.view === "function") {
        vnode.state = Object.create(vnode.tag);
        sentinel = vnode.state.view;
        if (sentinel.$$reentrantLock$$ != null)
          return;
        sentinel.$$reentrantLock$$ = true;
      } else {
        vnode.state = undefined;
        sentinel = vnode.tag;
        if (sentinel.$$reentrantLock$$ != null)
          return;
        sentinel.$$reentrantLock$$ = true;
        vnode.state = vnode.tag.prototype != null && typeof vnode.tag.prototype.view === "function" ? new vnode.tag(vnode) : vnode.tag(vnode);
      }
      initLifecycle(vnode.state, vnode, hooks);
      if (vnode.attrs != null)
        initLifecycle(vnode.attrs, vnode, hooks);
      vnode.instance = Vnode.normalize(callHook.call(vnode.state.view, vnode));
      if (vnode.instance === vnode)
        throw Error("A view cannot return the vnode it received as argument");
      sentinel.$$reentrantLock$$ = null;
    }
    function createComponent(parent, vnode, hooks, ns, nextSibling) {
      initComponent(vnode, hooks);
      if (vnode.instance != null) {
        createNode(parent, vnode.instance, hooks, ns, nextSibling);
        vnode.dom = vnode.instance.dom;
        vnode.domSize = vnode.dom != null ? vnode.instance.domSize : 0;
      } else {
        vnode.domSize = 0;
      }
    }
    function updateNodes(parent, old, vnodes, hooks, nextSibling, ns) {
      if (old === vnodes || old == null && vnodes == null)
        return;
      else if (old == null || old.length === 0)
        createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, ns);
      else if (vnodes == null || vnodes.length === 0)
        removeNodes(parent, old, 0, old.length);
      else {
        var isOldKeyed = old[0] != null && old[0].key != null;
        var isKeyed = vnodes[0] != null && vnodes[0].key != null;
        var start = 0, oldStart = 0;
        if (!isOldKeyed)
          while (oldStart < old.length && old[oldStart] == null)
            oldStart++;
        if (!isKeyed)
          while (start < vnodes.length && vnodes[start] == null)
            start++;
        if (isOldKeyed !== isKeyed) {
          removeNodes(parent, old, oldStart, old.length);
          createNodes(parent, vnodes, start, vnodes.length, hooks, nextSibling, ns);
        } else if (!isKeyed) {
          var commonLength = old.length < vnodes.length ? old.length : vnodes.length;
          start = start < oldStart ? start : oldStart;
          for (;start < commonLength; start++) {
            o = old[start];
            v = vnodes[start];
            if (o === v || o == null && v == null)
              continue;
            else if (o == null)
              createNode(parent, v, hooks, ns, getNextSibling(old, start + 1, nextSibling));
            else if (v == null)
              removeNode(parent, o);
            else
              updateNode(parent, o, v, hooks, getNextSibling(old, start + 1, nextSibling), ns);
          }
          if (old.length > commonLength)
            removeNodes(parent, old, start, old.length);
          if (vnodes.length > commonLength)
            createNodes(parent, vnodes, start, vnodes.length, hooks, nextSibling, ns);
        } else {
          var oldEnd = old.length - 1, end = vnodes.length - 1, map, o, v, oe, ve, topSibling;
          while (oldEnd >= oldStart && end >= start) {
            oe = old[oldEnd];
            ve = vnodes[end];
            if (oe.key !== ve.key)
              break;
            if (oe !== ve)
              updateNode(parent, oe, ve, hooks, nextSibling, ns);
            if (ve.dom != null)
              nextSibling = ve.dom;
            oldEnd--, end--;
          }
          while (oldEnd >= oldStart && end >= start) {
            o = old[oldStart];
            v = vnodes[start];
            if (o.key !== v.key)
              break;
            oldStart++, start++;
            if (o !== v)
              updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), ns);
          }
          while (oldEnd >= oldStart && end >= start) {
            if (start === end)
              break;
            if (o.key !== ve.key || oe.key !== v.key)
              break;
            topSibling = getNextSibling(old, oldStart, nextSibling);
            moveNodes(parent, oe, topSibling);
            if (oe !== v)
              updateNode(parent, oe, v, hooks, topSibling, ns);
            if (++start <= --end)
              moveNodes(parent, o, nextSibling);
            if (o !== ve)
              updateNode(parent, o, ve, hooks, nextSibling, ns);
            if (ve.dom != null)
              nextSibling = ve.dom;
            oldStart++;
            oldEnd--;
            oe = old[oldEnd];
            ve = vnodes[end];
            o = old[oldStart];
            v = vnodes[start];
          }
          while (oldEnd >= oldStart && end >= start) {
            if (oe.key !== ve.key)
              break;
            if (oe !== ve)
              updateNode(parent, oe, ve, hooks, nextSibling, ns);
            if (ve.dom != null)
              nextSibling = ve.dom;
            oldEnd--, end--;
            oe = old[oldEnd];
            ve = vnodes[end];
          }
          if (start > end)
            removeNodes(parent, old, oldStart, oldEnd + 1);
          else if (oldStart > oldEnd)
            createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns);
          else {
            var originalNextSibling = nextSibling, vnodesLength = end - start + 1, oldIndices = new Array(vnodesLength), li = 0, i = 0, pos = 2147483647, matched = 0, map, lisIndices;
            for (i = 0;i < vnodesLength; i++)
              oldIndices[i] = -1;
            for (i = end;i >= start; i--) {
              if (map == null)
                map = getKeyMap(old, oldStart, oldEnd + 1);
              ve = vnodes[i];
              var oldIndex = map[ve.key];
              if (oldIndex != null) {
                pos = oldIndex < pos ? oldIndex : -1;
                oldIndices[i - start] = oldIndex;
                oe = old[oldIndex];
                old[oldIndex] = null;
                if (oe !== ve)
                  updateNode(parent, oe, ve, hooks, nextSibling, ns);
                if (ve.dom != null)
                  nextSibling = ve.dom;
                matched++;
              }
            }
            nextSibling = originalNextSibling;
            if (matched !== oldEnd - oldStart + 1)
              removeNodes(parent, old, oldStart, oldEnd + 1);
            if (matched === 0)
              createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns);
            else {
              if (pos === -1) {
                lisIndices = makeLisIndices(oldIndices);
                li = lisIndices.length - 1;
                for (i = end;i >= start; i--) {
                  v = vnodes[i];
                  if (oldIndices[i - start] === -1)
                    createNode(parent, v, hooks, ns, nextSibling);
                  else {
                    if (lisIndices[li] === i - start)
                      li--;
                    else
                      moveNodes(parent, v, nextSibling);
                  }
                  if (v.dom != null)
                    nextSibling = vnodes[i].dom;
                }
              } else {
                for (i = end;i >= start; i--) {
                  v = vnodes[i];
                  if (oldIndices[i - start] === -1)
                    createNode(parent, v, hooks, ns, nextSibling);
                  if (v.dom != null)
                    nextSibling = vnodes[i].dom;
                }
              }
            }
          }
        }
      }
    }
    function updateNode(parent, old, vnode, hooks, nextSibling, ns) {
      var oldTag = old.tag, tag = vnode.tag;
      if (oldTag === tag) {
        vnode.state = old.state;
        vnode.events = old.events;
        if (shouldNotUpdate(vnode, old))
          return;
        if (typeof oldTag === "string") {
          if (vnode.attrs != null) {
            updateLifecycle(vnode.attrs, vnode, hooks);
          }
          switch (oldTag) {
            case "#":
              updateText(old, vnode);
              break;
            case "<":
              updateHTML(parent, old, vnode, ns, nextSibling);
              break;
            case "[":
              updateFragment(parent, old, vnode, hooks, nextSibling, ns);
              break;
            default:
              updateElement(old, vnode, hooks, ns);
          }
        } else
          updateComponent(parent, old, vnode, hooks, nextSibling, ns);
      } else {
        removeNode(parent, old);
        createNode(parent, vnode, hooks, ns, nextSibling);
      }
    }
    function updateText(old, vnode) {
      if (old.children.toString() !== vnode.children.toString()) {
        old.dom.nodeValue = vnode.children;
      }
      vnode.dom = old.dom;
    }
    function updateHTML(parent, old, vnode, ns, nextSibling) {
      if (old.children !== vnode.children) {
        removeHTML(parent, old);
        createHTML(parent, vnode, ns, nextSibling);
      } else {
        vnode.dom = old.dom;
        vnode.domSize = old.domSize;
        vnode.instance = old.instance;
      }
    }
    function updateFragment(parent, old, vnode, hooks, nextSibling, ns) {
      updateNodes(parent, old.children, vnode.children, hooks, nextSibling, ns);
      var domSize = 0, children = vnode.children;
      vnode.dom = null;
      if (children != null) {
        for (var i = 0;i < children.length; i++) {
          var child = children[i];
          if (child != null && child.dom != null) {
            if (vnode.dom == null)
              vnode.dom = child.dom;
            domSize += child.domSize || 1;
          }
        }
        if (domSize !== 1)
          vnode.domSize = domSize;
      }
    }
    function updateElement(old, vnode, hooks, ns) {
      var element = vnode.dom = old.dom;
      ns = getNameSpace(vnode) || ns;
      if (vnode.tag === "textarea") {
        if (vnode.attrs == null)
          vnode.attrs = {};
      }
      updateAttrs(vnode, old.attrs, vnode.attrs, ns);
      if (!maybeSetContentEditable(vnode)) {
        updateNodes(element, old.children, vnode.children, hooks, null, ns);
      }
    }
    function updateComponent(parent, old, vnode, hooks, nextSibling, ns) {
      vnode.instance = Vnode.normalize(callHook.call(vnode.state.view, vnode));
      if (vnode.instance === vnode)
        throw Error("A view cannot return the vnode it received as argument");
      updateLifecycle(vnode.state, vnode, hooks);
      if (vnode.attrs != null)
        updateLifecycle(vnode.attrs, vnode, hooks);
      if (vnode.instance != null) {
        if (old.instance == null)
          createNode(parent, vnode.instance, hooks, ns, nextSibling);
        else
          updateNode(parent, old.instance, vnode.instance, hooks, nextSibling, ns);
        vnode.dom = vnode.instance.dom;
        vnode.domSize = vnode.instance.domSize;
      } else if (old.instance != null) {
        removeNode(parent, old.instance);
        vnode.dom = undefined;
        vnode.domSize = 0;
      } else {
        vnode.dom = old.dom;
        vnode.domSize = old.domSize;
      }
    }
    function getKeyMap(vnodes, start, end) {
      var map = Object.create(null);
      for (;start < end; start++) {
        var vnode = vnodes[start];
        if (vnode != null) {
          var key = vnode.key;
          if (key != null)
            map[key] = start;
        }
      }
      return map;
    }
    var lisTemp = [];
    function makeLisIndices(a) {
      var result = [0];
      var u = 0, v = 0, i = 0;
      var il = lisTemp.length = a.length;
      for (var i = 0;i < il; i++)
        lisTemp[i] = a[i];
      for (var i = 0;i < il; ++i) {
        if (a[i] === -1)
          continue;
        var j = result[result.length - 1];
        if (a[j] < a[i]) {
          lisTemp[i] = j;
          result.push(i);
          continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
          var c = (u >>> 1) + (v >>> 1) + (u & v & 1);
          if (a[result[c]] < a[i]) {
            u = c + 1;
          } else {
            v = c;
          }
        }
        if (a[i] < a[result[u]]) {
          if (u > 0)
            lisTemp[i] = result[u - 1];
          result[u] = i;
        }
      }
      u = result.length;
      v = result[u - 1];
      while (u-- > 0) {
        result[u] = v;
        v = lisTemp[v];
      }
      lisTemp.length = 0;
      return result;
    }
    function getNextSibling(vnodes, i, nextSibling) {
      for (;i < vnodes.length; i++) {
        if (vnodes[i] != null && vnodes[i].dom != null)
          return vnodes[i].dom;
      }
      return nextSibling;
    }
    function moveNodes(parent, vnode, nextSibling) {
      var frag = $doc.createDocumentFragment();
      moveChildToFrag(parent, frag, vnode);
      insertNode(parent, frag, nextSibling);
    }
    function moveChildToFrag(parent, frag, vnode) {
      while (vnode.dom != null && vnode.dom.parentNode === parent) {
        if (typeof vnode.tag !== "string") {
          vnode = vnode.instance;
          if (vnode != null)
            continue;
        } else if (vnode.tag === "<") {
          for (var i = 0;i < vnode.instance.length; i++) {
            frag.appendChild(vnode.instance[i]);
          }
        } else if (vnode.tag !== "[") {
          frag.appendChild(vnode.dom);
        } else if (vnode.children.length === 1) {
          vnode = vnode.children[0];
          if (vnode != null)
            continue;
        } else {
          for (var i = 0;i < vnode.children.length; i++) {
            var child = vnode.children[i];
            if (child != null)
              moveChildToFrag(parent, frag, child);
          }
        }
        break;
      }
    }
    function insertNode(parent, dom, nextSibling) {
      if (nextSibling != null)
        parent.insertBefore(dom, nextSibling);
      else
        parent.appendChild(dom);
    }
    function maybeSetContentEditable(vnode) {
      if (vnode.attrs == null || vnode.attrs.contenteditable == null && vnode.attrs.contentEditable == null)
        return false;
      var children = vnode.children;
      if (children != null && children.length === 1 && children[0].tag === "<") {
        var content = children[0].children;
        if (vnode.dom.innerHTML !== content)
          vnode.dom.innerHTML = content;
      } else if (children != null && children.length !== 0)
        throw new Error("Child node of a contenteditable must be trusted.");
      return true;
    }
    function removeNodes(parent, vnodes, start, end) {
      for (var i = start;i < end; i++) {
        var vnode = vnodes[i];
        if (vnode != null)
          removeNode(parent, vnode);
      }
    }
    function removeNode(parent, vnode) {
      var mask = 0;
      var original = vnode.state;
      var stateResult, attrsResult;
      if (typeof vnode.tag !== "string" && typeof vnode.state.onbeforeremove === "function") {
        var result = callHook.call(vnode.state.onbeforeremove, vnode);
        if (result != null && typeof result.then === "function") {
          mask = 1;
          stateResult = result;
        }
      }
      if (vnode.attrs && typeof vnode.attrs.onbeforeremove === "function") {
        var result = callHook.call(vnode.attrs.onbeforeremove, vnode);
        if (result != null && typeof result.then === "function") {
          mask |= 2;
          attrsResult = result;
        }
      }
      checkState(vnode, original);
      if (!mask) {
        onremove(vnode);
        removeChild(parent, vnode);
      } else {
        if (stateResult != null) {
          var next = function() {
            if (mask & 1) {
              mask &= 2;
              if (!mask)
                reallyRemove();
            }
          };
          stateResult.then(next, next);
        }
        if (attrsResult != null) {
          var next = function() {
            if (mask & 2) {
              mask &= 1;
              if (!mask)
                reallyRemove();
            }
          };
          attrsResult.then(next, next);
        }
      }
      function reallyRemove() {
        checkState(vnode, original);
        onremove(vnode);
        removeChild(parent, vnode);
      }
    }
    function removeHTML(parent, vnode) {
      for (var i = 0;i < vnode.instance.length; i++) {
        parent.removeChild(vnode.instance[i]);
      }
    }
    function removeChild(parent, vnode) {
      while (vnode.dom != null && vnode.dom.parentNode === parent) {
        if (typeof vnode.tag !== "string") {
          vnode = vnode.instance;
          if (vnode != null)
            continue;
        } else if (vnode.tag === "<") {
          removeHTML(parent, vnode);
        } else {
          if (vnode.tag !== "[") {
            parent.removeChild(vnode.dom);
            if (!Array.isArray(vnode.children))
              break;
          }
          if (vnode.children.length === 1) {
            vnode = vnode.children[0];
            if (vnode != null)
              continue;
          } else {
            for (var i = 0;i < vnode.children.length; i++) {
              var child = vnode.children[i];
              if (child != null)
                removeChild(parent, child);
            }
          }
        }
        break;
      }
    }
    function onremove(vnode) {
      if (typeof vnode.tag !== "string" && typeof vnode.state.onremove === "function")
        callHook.call(vnode.state.onremove, vnode);
      if (vnode.attrs && typeof vnode.attrs.onremove === "function")
        callHook.call(vnode.attrs.onremove, vnode);
      if (typeof vnode.tag !== "string") {
        if (vnode.instance != null)
          onremove(vnode.instance);
      } else {
        var children = vnode.children;
        if (Array.isArray(children)) {
          for (var i = 0;i < children.length; i++) {
            var child = children[i];
            if (child != null)
              onremove(child);
          }
        }
      }
    }
    function setAttrs(vnode, attrs, ns) {
      if (vnode.tag === "input" && attrs.type != null)
        vnode.dom.setAttribute("type", attrs.type);
      var isFileInput = attrs != null && vnode.tag === "input" && attrs.type === "file";
      for (var key in attrs) {
        setAttr(vnode, key, null, attrs[key], ns, isFileInput);
      }
    }
    function setAttr(vnode, key, old, value, ns, isFileInput) {
      if (key === "key" || key === "is" || value == null || isLifecycleMethod(key) || old === value && !isFormAttribute(vnode, key) && typeof value !== "object" || key === "type" && vnode.tag === "input")
        return;
      if (key[0] === "o" && key[1] === "n")
        return updateEvent(vnode, key, value);
      if (key.slice(0, 6) === "xlink:")
        vnode.dom.setAttributeNS("http://www.w3.org/1999/xlink", key.slice(6), value);
      else if (key === "style")
        updateStyle(vnode.dom, old, value);
      else if (hasPropertyKey(vnode, key, ns)) {
        if (key === "value") {
          if ((vnode.tag === "input" || vnode.tag === "textarea") && vnode.dom.value === "" + value && (isFileInput || vnode.dom === activeElement()))
            return;
          if (vnode.tag === "select" && old !== null && vnode.dom.value === "" + value)
            return;
          if (vnode.tag === "option" && old !== null && vnode.dom.value === "" + value)
            return;
          if (isFileInput && "" + value !== "") {
            console.error("`value` is read-only on file inputs!");
            return;
          }
        }
        vnode.dom[key] = value;
      } else {
        if (typeof value === "boolean") {
          if (value)
            vnode.dom.setAttribute(key, "");
          else
            vnode.dom.removeAttribute(key);
        } else
          vnode.dom.setAttribute(key === "className" ? "class" : key, value);
      }
    }
    function removeAttr(vnode, key, old, ns) {
      if (key === "key" || key === "is" || old == null || isLifecycleMethod(key))
        return;
      if (key[0] === "o" && key[1] === "n")
        updateEvent(vnode, key, undefined);
      else if (key === "style")
        updateStyle(vnode.dom, old, null);
      else if (hasPropertyKey(vnode, key, ns) && key !== "className" && key !== "title" && !(key === "value" && (vnode.tag === "option" || vnode.tag === "select" && vnode.dom.selectedIndex === -1 && vnode.dom === activeElement())) && !(vnode.tag === "input" && key === "type")) {
        vnode.dom[key] = null;
      } else {
        var nsLastIndex = key.indexOf(":");
        if (nsLastIndex !== -1)
          key = key.slice(nsLastIndex + 1);
        if (old !== false)
          vnode.dom.removeAttribute(key === "className" ? "class" : key);
      }
    }
    function setLateSelectAttrs(vnode, attrs) {
      if ("value" in attrs) {
        if (attrs.value === null) {
          if (vnode.dom.selectedIndex !== -1)
            vnode.dom.value = null;
        } else {
          var normalized = "" + attrs.value;
          if (vnode.dom.value !== normalized || vnode.dom.selectedIndex === -1) {
            vnode.dom.value = normalized;
          }
        }
      }
      if ("selectedIndex" in attrs)
        setAttr(vnode, "selectedIndex", null, attrs.selectedIndex, undefined);
    }
    function updateAttrs(vnode, old, attrs, ns) {
      if (old && old === attrs) {
        console.warn("Don't reuse attrs object, use new object for every redraw, this will throw in next major");
      }
      if (attrs != null) {
        if (vnode.tag === "input" && attrs.type != null)
          vnode.dom.setAttribute("type", attrs.type);
        var isFileInput = vnode.tag === "input" && attrs.type === "file";
        for (var key in attrs) {
          setAttr(vnode, key, old && old[key], attrs[key], ns, isFileInput);
        }
      }
      var val;
      if (old != null) {
        for (var key in old) {
          if ((val = old[key]) != null && (attrs == null || attrs[key] == null)) {
            removeAttr(vnode, key, val, ns);
          }
        }
      }
    }
    function isFormAttribute(vnode, attr) {
      return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode.dom === activeElement() || vnode.tag === "option" && vnode.dom.parentNode === $doc.activeElement;
    }
    function isLifecycleMethod(attr) {
      return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate";
    }
    function hasPropertyKey(vnode, key, ns) {
      return ns === undefined && (vnode.tag.indexOf("-") > -1 || vnode.attrs != null && vnode.attrs.is || key !== "href" && key !== "list" && key !== "form" && key !== "width" && key !== "height") && (key in vnode.dom);
    }
    var uppercaseRegex = /[A-Z]/g;
    function toLowerCase(capital) {
      return "-" + capital.toLowerCase();
    }
    function normalizeKey(key) {
      return key[0] === "-" && key[1] === "-" ? key : key === "cssFloat" ? "float" : key.replace(uppercaseRegex, toLowerCase);
    }
    function updateStyle(element, old, style) {
      if (old === style) {
      } else if (style == null) {
        element.style.cssText = "";
      } else if (typeof style !== "object") {
        element.style.cssText = style;
      } else if (old == null || typeof old !== "object") {
        element.style.cssText = "";
        for (var key in style) {
          var value = style[key];
          if (value != null)
            element.style.setProperty(normalizeKey(key), String(value));
        }
      } else {
        for (var key in style) {
          var value = style[key];
          if (value != null && (value = String(value)) !== String(old[key])) {
            element.style.setProperty(normalizeKey(key), value);
          }
        }
        for (var key in old) {
          if (old[key] != null && style[key] == null) {
            element.style.removeProperty(normalizeKey(key));
          }
        }
      }
    }
    function EventDict() {
      this._ = currentRedraw;
    }
    EventDict.prototype = Object.create(null);
    EventDict.prototype.handleEvent = function(ev) {
      var handler = this["on" + ev.type];
      var result;
      if (typeof handler === "function")
        result = handler.call(ev.currentTarget, ev);
      else if (typeof handler.handleEvent === "function")
        handler.handleEvent(ev);
      if (this._ && ev.redraw !== false)
        (0, this._)();
      if (result === false) {
        ev.preventDefault();
        ev.stopPropagation();
      }
    };
    function updateEvent(vnode, key, value) {
      if (vnode.events != null) {
        vnode.events._ = currentRedraw;
        if (vnode.events[key] === value)
          return;
        if (value != null && (typeof value === "function" || typeof value === "object")) {
          if (vnode.events[key] == null)
            vnode.dom.addEventListener(key.slice(2), vnode.events, false);
          vnode.events[key] = value;
        } else {
          if (vnode.events[key] != null)
            vnode.dom.removeEventListener(key.slice(2), vnode.events, false);
          vnode.events[key] = undefined;
        }
      } else if (value != null && (typeof value === "function" || typeof value === "object")) {
        vnode.events = new EventDict;
        vnode.dom.addEventListener(key.slice(2), vnode.events, false);
        vnode.events[key] = value;
      }
    }
    function initLifecycle(source, vnode, hooks) {
      if (typeof source.oninit === "function")
        callHook.call(source.oninit, vnode);
      if (typeof source.oncreate === "function")
        hooks.push(callHook.bind(source.oncreate, vnode));
    }
    function updateLifecycle(source, vnode, hooks) {
      if (typeof source.onupdate === "function")
        hooks.push(callHook.bind(source.onupdate, vnode));
    }
    function shouldNotUpdate(vnode, old) {
      do {
        if (vnode.attrs != null && typeof vnode.attrs.onbeforeupdate === "function") {
          var force = callHook.call(vnode.attrs.onbeforeupdate, vnode, old);
          if (force !== undefined && !force)
            break;
        }
        if (typeof vnode.tag !== "string" && typeof vnode.state.onbeforeupdate === "function") {
          var force = callHook.call(vnode.state.onbeforeupdate, vnode, old);
          if (force !== undefined && !force)
            break;
        }
        return false;
      } while (false);
      vnode.dom = old.dom;
      vnode.domSize = old.domSize;
      vnode.instance = old.instance;
      vnode.attrs = old.attrs;
      vnode.children = old.children;
      vnode.text = old.text;
      return true;
    }
    var currentDOM;
    return function(dom, vnodes, redraw) {
      if (!dom)
        throw new TypeError("DOM element being rendered to does not exist.");
      if (currentDOM != null && dom.contains(currentDOM)) {
        throw new TypeError("Node is currently being rendered to and thus is locked.");
      }
      var prevRedraw = currentRedraw;
      var prevDOM = currentDOM;
      var hooks = [];
      var active = activeElement();
      var namespace = dom.namespaceURI;
      currentDOM = dom;
      currentRedraw = typeof redraw === "function" ? redraw : undefined;
      try {
        if (dom.vnodes == null)
          dom.textContent = "";
        vnodes = Vnode.normalizeChildren(Array.isArray(vnodes) ? vnodes : [vnodes]);
        updateNodes(dom, dom.vnodes, vnodes, hooks, null, namespace === "http://www.w3.org/1999/xhtml" ? undefined : namespace);
        dom.vnodes = vnodes;
        if (active != null && activeElement() !== active && typeof active.focus === "function")
          active.focus();
        for (var i = 0;i < hooks.length; i++)
          hooks[i]();
      } finally {
        currentRedraw = prevRedraw;
        currentDOM = prevDOM;
      }
    };
  };
});

// node_modules/mithril/render.js
var require_render2 = __commonJS((exports, module) => {
  module.exports = require_render()(typeof window !== "undefined" ? window : null);
});

// node_modules/mithril/api/mount-redraw.js
var require_mount_redraw = __commonJS((exports, module) => {
  var Vnode = require_vnode();
  module.exports = function(render, schedule, console2) {
    var subscriptions = [];
    var pending = false;
    var offset = -1;
    function sync() {
      for (offset = 0;offset < subscriptions.length; offset += 2) {
        try {
          render(subscriptions[offset], Vnode(subscriptions[offset + 1]), redraw);
        } catch (e) {
          console2.error(e);
        }
      }
      offset = -1;
    }
    function redraw() {
      if (!pending) {
        pending = true;
        schedule(function() {
          pending = false;
          sync();
        });
      }
    }
    redraw.sync = sync;
    function mount(root, component) {
      if (component != null && component.view == null && typeof component !== "function") {
        throw new TypeError("m.mount expects a component, not a vnode.");
      }
      var index = subscriptions.indexOf(root);
      if (index >= 0) {
        subscriptions.splice(index, 2);
        if (index <= offset)
          offset -= 2;
        render(root, []);
      }
      if (component != null) {
        subscriptions.push(root, component);
        render(root, Vnode(component), redraw);
      }
    }
    return { mount, redraw };
  };
});

// node_modules/mithril/mount-redraw.js
var require_mount_redraw2 = __commonJS((exports, module) => {
  var render = require_render2();
  module.exports = require_mount_redraw()(render, typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : null, typeof console !== "undefined" ? console : null);
});

// node_modules/mithril/querystring/build.js
var require_build = __commonJS((exports, module) => {
  module.exports = function(object) {
    if (Object.prototype.toString.call(object) !== "[object Object]")
      return "";
    var args = [];
    for (var key in object) {
      destructure(key, object[key]);
    }
    return args.join("&");
    function destructure(key2, value) {
      if (Array.isArray(value)) {
        for (var i = 0;i < value.length; i++) {
          destructure(key2 + "[" + i + "]", value[i]);
        }
      } else if (Object.prototype.toString.call(value) === "[object Object]") {
        for (var i in value) {
          destructure(key2 + "[" + i + "]", value[i]);
        }
      } else
        args.push(encodeURIComponent(key2) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""));
    }
  };
});

// node_modules/mithril/util/assign.js
var require_assign = __commonJS((exports, module) => {
  var hasOwn = require_hasOwn();
  module.exports = Object.assign || function(target, source) {
    for (var key in source) {
      if (hasOwn.call(source, key))
        target[key] = source[key];
    }
  };
});

// node_modules/mithril/pathname/build.js
var require_build2 = __commonJS((exports, module) => {
  var buildQueryString = require_build();
  var assign = require_assign();
  module.exports = function(template, params) {
    if (/:([^\/\.-]+)(\.{3})?:/.test(template)) {
      throw new SyntaxError("Template parameter names must be separated by either a '/', '-', or '.'.");
    }
    if (params == null)
      return template;
    var queryIndex = template.indexOf("?");
    var hashIndex = template.indexOf("#");
    var queryEnd = hashIndex < 0 ? template.length : hashIndex;
    var pathEnd = queryIndex < 0 ? queryEnd : queryIndex;
    var path = template.slice(0, pathEnd);
    var query = {};
    assign(query, params);
    var resolved = path.replace(/:([^\/\.-]+)(\.{3})?/g, function(m, key, variadic) {
      delete query[key];
      if (params[key] == null)
        return m;
      return variadic ? params[key] : encodeURIComponent(String(params[key]));
    });
    var newQueryIndex = resolved.indexOf("?");
    var newHashIndex = resolved.indexOf("#");
    var newQueryEnd = newHashIndex < 0 ? resolved.length : newHashIndex;
    var newPathEnd = newQueryIndex < 0 ? newQueryEnd : newQueryIndex;
    var result = resolved.slice(0, newPathEnd);
    if (queryIndex >= 0)
      result += template.slice(queryIndex, queryEnd);
    if (newQueryIndex >= 0)
      result += (queryIndex < 0 ? "?" : "&") + resolved.slice(newQueryIndex, newQueryEnd);
    var querystring = buildQueryString(query);
    if (querystring)
      result += (queryIndex < 0 && newQueryIndex < 0 ? "?" : "&") + querystring;
    if (hashIndex >= 0)
      result += template.slice(hashIndex);
    if (newHashIndex >= 0)
      result += (hashIndex < 0 ? "" : "&") + resolved.slice(newHashIndex);
    return result;
  };
});

// node_modules/mithril/request/request.js
var require_request = __commonJS((exports, module) => {
  var buildPathname = require_build2();
  var hasOwn = require_hasOwn();
  module.exports = function($window, Promise2, oncompletion) {
    var callbackCount = 0;
    function PromiseProxy(executor) {
      return new Promise2(executor);
    }
    PromiseProxy.prototype = Promise2.prototype;
    PromiseProxy.__proto__ = Promise2;
    function makeRequest(factory) {
      return function(url, args) {
        if (typeof url !== "string") {
          args = url;
          url = url.url;
        } else if (args == null)
          args = {};
        var promise = new Promise2(function(resolve, reject) {
          factory(buildPathname(url, args.params), args, function(data) {
            if (typeof args.type === "function") {
              if (Array.isArray(data)) {
                for (var i = 0;i < data.length; i++) {
                  data[i] = new args.type(data[i]);
                }
              } else
                data = new args.type(data);
            }
            resolve(data);
          }, reject);
        });
        if (args.background === true)
          return promise;
        var count = 0;
        function complete() {
          if (--count === 0 && typeof oncompletion === "function")
            oncompletion();
        }
        return wrap(promise);
        function wrap(promise2) {
          var then = promise2.then;
          promise2.constructor = PromiseProxy;
          promise2.then = function() {
            count++;
            var next = then.apply(promise2, arguments);
            next.then(complete, function(e) {
              complete();
              if (count === 0)
                throw e;
            });
            return wrap(next);
          };
          return promise2;
        }
      };
    }
    function hasHeader(args, name) {
      for (var key in args.headers) {
        if (hasOwn.call(args.headers, key) && key.toLowerCase() === name)
          return true;
      }
      return false;
    }
    return {
      request: makeRequest(function(url, args, resolve, reject) {
        var method = args.method != null ? args.method.toUpperCase() : "GET";
        var body = args.body;
        var assumeJSON = (args.serialize == null || args.serialize === JSON.serialize) && !(body instanceof $window.FormData || body instanceof $window.URLSearchParams);
        var responseType = args.responseType || (typeof args.extract === "function" ? "" : "json");
        var xhr = new $window.XMLHttpRequest, aborted = false, isTimeout = false;
        var original = xhr, replacedAbort;
        var abort = xhr.abort;
        xhr.abort = function() {
          aborted = true;
          abort.call(this);
        };
        xhr.open(method, url, args.async !== false, typeof args.user === "string" ? args.user : undefined, typeof args.password === "string" ? args.password : undefined);
        if (assumeJSON && body != null && !hasHeader(args, "content-type")) {
          xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        }
        if (typeof args.deserialize !== "function" && !hasHeader(args, "accept")) {
          xhr.setRequestHeader("Accept", "application/json, text/*");
        }
        if (args.withCredentials)
          xhr.withCredentials = args.withCredentials;
        if (args.timeout)
          xhr.timeout = args.timeout;
        xhr.responseType = responseType;
        for (var key in args.headers) {
          if (hasOwn.call(args.headers, key)) {
            xhr.setRequestHeader(key, args.headers[key]);
          }
        }
        xhr.onreadystatechange = function(ev) {
          if (aborted)
            return;
          if (ev.target.readyState === 4) {
            try {
              var success = ev.target.status >= 200 && ev.target.status < 300 || ev.target.status === 304 || /^file:\/\//i.test(url);
              var response = ev.target.response, message;
              if (responseType === "json") {
                if (!ev.target.responseType && typeof args.extract !== "function") {
                  try {
                    response = JSON.parse(ev.target.responseText);
                  } catch (e) {
                    response = null;
                  }
                }
              } else if (!responseType || responseType === "text") {
                if (response == null)
                  response = ev.target.responseText;
              }
              if (typeof args.extract === "function") {
                response = args.extract(ev.target, args);
                success = true;
              } else if (typeof args.deserialize === "function") {
                response = args.deserialize(response);
              }
              if (success)
                resolve(response);
              else {
                var completeErrorResponse = function() {
                  try {
                    message = ev.target.responseText;
                  } catch (e) {
                    message = response;
                  }
                  var error = new Error(message);
                  error.code = ev.target.status;
                  error.response = response;
                  reject(error);
                };
                if (xhr.status === 0) {
                  setTimeout(function() {
                    if (isTimeout)
                      return;
                    completeErrorResponse();
                  });
                } else
                  completeErrorResponse();
              }
            } catch (e) {
              reject(e);
            }
          }
        };
        xhr.ontimeout = function(ev) {
          isTimeout = true;
          var error = new Error("Request timed out");
          error.code = ev.target.status;
          reject(error);
        };
        if (typeof args.config === "function") {
          xhr = args.config(xhr, args, url) || xhr;
          if (xhr !== original) {
            replacedAbort = xhr.abort;
            xhr.abort = function() {
              aborted = true;
              replacedAbort.call(this);
            };
          }
        }
        if (body == null)
          xhr.send();
        else if (typeof args.serialize === "function")
          xhr.send(args.serialize(body));
        else if (body instanceof $window.FormData || body instanceof $window.URLSearchParams)
          xhr.send(body);
        else
          xhr.send(JSON.stringify(body));
      }),
      jsonp: makeRequest(function(url, args, resolve, reject) {
        var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 10000000000000000) + "_" + callbackCount++;
        var script = $window.document.createElement("script");
        $window[callbackName] = function(data) {
          delete $window[callbackName];
          script.parentNode.removeChild(script);
          resolve(data);
        };
        script.onerror = function() {
          delete $window[callbackName];
          script.parentNode.removeChild(script);
          reject(new Error("JSONP request failed"));
        };
        script.src = url + (url.indexOf("?") < 0 ? "?" : "&") + encodeURIComponent(args.callbackKey || "callback") + "=" + encodeURIComponent(callbackName);
        $window.document.documentElement.appendChild(script);
      })
    };
  };
});

// node_modules/mithril/request.js
var require_request2 = __commonJS((exports, module) => {
  var PromisePolyfill = require_promise();
  var mountRedraw = require_mount_redraw2();
  module.exports = require_request()(typeof window !== "undefined" ? window : null, PromisePolyfill, mountRedraw.redraw);
});

// node_modules/mithril/querystring/parse.js
var require_parse = __commonJS((exports, module) => {
  var decodeURIComponentSave = function(str) {
    try {
      return decodeURIComponent(str);
    } catch (err) {
      return str;
    }
  };
  module.exports = function(string) {
    if (string === "" || string == null)
      return {};
    if (string.charAt(0) === "?")
      string = string.slice(1);
    var entries = string.split("&"), counters = {}, data = {};
    for (var i = 0;i < entries.length; i++) {
      var entry = entries[i].split("=");
      var key = decodeURIComponentSave(entry[0]);
      var value = entry.length === 2 ? decodeURIComponentSave(entry[1]) : "";
      if (value === "true")
        value = true;
      else if (value === "false")
        value = false;
      var levels = key.split(/\]\[?|\[/);
      var cursor = data;
      if (key.indexOf("[") > -1)
        levels.pop();
      for (var j = 0;j < levels.length; j++) {
        var level = levels[j], nextLevel = levels[j + 1];
        var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10));
        if (level === "") {
          var key = levels.slice(0, j).join();
          if (counters[key] == null) {
            counters[key] = Array.isArray(cursor) ? cursor.length : 0;
          }
          level = counters[key]++;
        } else if (level === "__proto__")
          break;
        if (j === levels.length - 1)
          cursor[level] = value;
        else {
          var desc = Object.getOwnPropertyDescriptor(cursor, level);
          if (desc != null)
            desc = desc.value;
          if (desc == null)
            cursor[level] = desc = isNumber ? [] : {};
          cursor = desc;
        }
      }
    }
    return data;
  };
});

// node_modules/mithril/pathname/parse.js
var require_parse2 = __commonJS((exports, module) => {
  var parseQueryString = require_parse();
  module.exports = function(url) {
    var queryIndex = url.indexOf("?");
    var hashIndex = url.indexOf("#");
    var queryEnd = hashIndex < 0 ? url.length : hashIndex;
    var pathEnd = queryIndex < 0 ? queryEnd : queryIndex;
    var path = url.slice(0, pathEnd).replace(/\/{2,}/g, "/");
    if (!path)
      path = "/";
    else {
      if (path[0] !== "/")
        path = "/" + path;
      if (path.length > 1 && path[path.length - 1] === "/")
        path = path.slice(0, -1);
    }
    return {
      path,
      params: queryIndex < 0 ? {} : parseQueryString(url.slice(queryIndex + 1, queryEnd))
    };
  };
});

// node_modules/mithril/pathname/compileTemplate.js
var require_compileTemplate = __commonJS((exports, module) => {
  var parsePathname = require_parse2();
  module.exports = function(template) {
    var templateData = parsePathname(template);
    var templateKeys = Object.keys(templateData.params);
    var keys = [];
    var regexp = new RegExp("^" + templateData.path.replace(/:([^\/.-]+)(\.{3}|\.(?!\.)|-)?|[\\^$*+.()|\[\]{}]/g, function(m, key, extra) {
      if (key == null)
        return "\\" + m;
      keys.push({ k: key, r: extra === "..." });
      if (extra === "...")
        return "(.*)";
      if (extra === ".")
        return "([^/]+)\\.";
      return "([^/]+)" + (extra || "");
    }) + "$");
    return function(data) {
      for (var i = 0;i < templateKeys.length; i++) {
        if (templateData.params[templateKeys[i]] !== data.params[templateKeys[i]])
          return false;
      }
      if (!keys.length)
        return regexp.test(data.path);
      var values = regexp.exec(data.path);
      if (values == null)
        return false;
      for (var i = 0;i < keys.length; i++) {
        data.params[keys[i].k] = keys[i].r ? values[i + 1] : decodeURIComponent(values[i + 1]);
      }
      return true;
    };
  };
});

// node_modules/mithril/util/censor.js
var require_censor = __commonJS((exports, module) => {
  var hasOwn = require_hasOwn();
  var magic = new RegExp("^(?:key|oninit|oncreate|onbeforeupdate|onupdate|onbeforeremove|onremove)$");
  module.exports = function(attrs, extras) {
    var result = {};
    if (extras != null) {
      for (var key in attrs) {
        if (hasOwn.call(attrs, key) && !magic.test(key) && extras.indexOf(key) < 0) {
          result[key] = attrs[key];
        }
      }
    } else {
      for (var key in attrs) {
        if (hasOwn.call(attrs, key) && !magic.test(key)) {
          result[key] = attrs[key];
        }
      }
    }
    return result;
  };
});

// node_modules/mithril/api/router.js
var require_router = __commonJS((exports, module) => {
  var decodeURIComponentSave = function(component) {
    try {
      return decodeURIComponent(component);
    } catch (e) {
      return component;
    }
  };
  var Vnode = require_vnode();
  var m = require_hyperscript();
  var Promise2 = require_promise();
  var buildPathname = require_build2();
  var parsePathname = require_parse2();
  var compileTemplate = require_compileTemplate();
  var assign = require_assign();
  var censor = require_censor();
  var sentinel = {};
  module.exports = function($window, mountRedraw) {
    var callAsync = $window == null ? null : typeof $window.setImmediate === "function" ? $window.setImmediate : $window.setTimeout;
    var p = Promise2.resolve();
    var scheduled = false;
    var ready = false;
    var state = 0;
    var compiled, fallbackRoute;
    var currentResolver = sentinel, component, attrs, currentPath, lastUpdate;
    var RouterRoot = {
      onbeforeupdate: function() {
        state = state ? 2 : 1;
        return !(!state || sentinel === currentResolver);
      },
      onremove: function() {
        $window.removeEventListener("popstate", fireAsync, false);
        $window.removeEventListener("hashchange", resolveRoute, false);
      },
      view: function() {
        if (!state || sentinel === currentResolver)
          return;
        var vnode = [Vnode(component, attrs.key, attrs)];
        if (currentResolver)
          vnode = currentResolver.render(vnode[0]);
        return vnode;
      }
    };
    var SKIP = route.SKIP = {};
    function resolveRoute() {
      scheduled = false;
      var prefix = $window.location.hash;
      if (route.prefix[0] !== "#") {
        prefix = $window.location.search + prefix;
        if (route.prefix[0] !== "?") {
          prefix = $window.location.pathname + prefix;
          if (prefix[0] !== "/")
            prefix = "/" + prefix;
        }
      }
      var path = prefix.concat().replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponentSave).slice(route.prefix.length);
      var data = parsePathname(path);
      assign(data.params, $window.history.state);
      function reject(e) {
        console.error(e);
        setPath(fallbackRoute, null, { replace: true });
      }
      loop(0);
      function loop(i) {
        for (;i < compiled.length; i++) {
          if (compiled[i].check(data)) {
            var payload = compiled[i].component;
            var matchedRoute = compiled[i].route;
            var localComp = payload;
            var update = lastUpdate = function(comp) {
              if (update !== lastUpdate)
                return;
              if (comp === SKIP)
                return loop(i + 1);
              component = comp != null && (typeof comp.view === "function" || typeof comp === "function") ? comp : "div";
              attrs = data.params, currentPath = path, lastUpdate = null;
              currentResolver = payload.render ? payload : null;
              if (state === 2)
                mountRedraw.redraw();
              else {
                state = 2;
                mountRedraw.redraw.sync();
              }
            };
            if (payload.view || typeof payload === "function") {
              payload = {};
              update(localComp);
            } else if (payload.onmatch) {
              p.then(function() {
                return payload.onmatch(data.params, path, matchedRoute);
              }).then(update, path === fallbackRoute ? null : reject);
            } else
              update("div");
            return;
          }
        }
        if (path === fallbackRoute) {
          throw new Error("Could not resolve default route " + fallbackRoute + ".");
        }
        setPath(fallbackRoute, null, { replace: true });
      }
    }
    function fireAsync() {
      if (!scheduled) {
        scheduled = true;
        callAsync(resolveRoute);
      }
    }
    function setPath(path, data, options) {
      path = buildPathname(path, data);
      if (ready) {
        fireAsync();
        var state2 = options ? options.state : null;
        var title = options ? options.title : null;
        if (options && options.replace)
          $window.history.replaceState(state2, title, route.prefix + path);
        else
          $window.history.pushState(state2, title, route.prefix + path);
      } else {
        $window.location.href = route.prefix + path;
      }
    }
    function route(root, defaultRoute, routes) {
      if (!root)
        throw new TypeError("DOM element being rendered to does not exist.");
      compiled = Object.keys(routes).map(function(route2) {
        if (route2[0] !== "/")
          throw new SyntaxError("Routes must start with a '/'.");
        if (/:([^\/\.-]+)(\.{3})?:/.test(route2)) {
          throw new SyntaxError("Route parameter names must be separated with either '/', '.', or '-'.");
        }
        return {
          route: route2,
          component: routes[route2],
          check: compileTemplate(route2)
        };
      });
      fallbackRoute = defaultRoute;
      if (defaultRoute != null) {
        var defaultData = parsePathname(defaultRoute);
        if (!compiled.some(function(i) {
          return i.check(defaultData);
        })) {
          throw new ReferenceError("Default route doesn't match any known routes.");
        }
      }
      if (typeof $window.history.pushState === "function") {
        $window.addEventListener("popstate", fireAsync, false);
      } else if (route.prefix[0] === "#") {
        $window.addEventListener("hashchange", resolveRoute, false);
      }
      ready = true;
      mountRedraw.mount(root, RouterRoot);
      resolveRoute();
    }
    route.set = function(path, data, options) {
      if (lastUpdate != null) {
        options = options || {};
        options.replace = true;
      }
      lastUpdate = null;
      setPath(path, data, options);
    };
    route.get = function() {
      return currentPath;
    };
    route.prefix = "#!";
    route.Link = {
      view: function(vnode) {
        var child = m(vnode.attrs.selector || "a", censor(vnode.attrs, ["options", "params", "selector", "onclick"]), vnode.children);
        var options, onclick, href;
        if (child.attrs.disabled = Boolean(child.attrs.disabled)) {
          child.attrs.href = null;
          child.attrs["aria-disabled"] = "true";
        } else {
          options = vnode.attrs.options;
          onclick = vnode.attrs.onclick;
          href = buildPathname(child.attrs.href, vnode.attrs.params);
          child.attrs.href = route.prefix + href;
          child.attrs.onclick = function(e) {
            var result;
            if (typeof onclick === "function") {
              result = onclick.call(e.currentTarget, e);
            } else if (onclick == null || typeof onclick !== "object") {
            } else if (typeof onclick.handleEvent === "function") {
              onclick.handleEvent(e);
            }
            if (result !== false && !e.defaultPrevented && (e.button === 0 || e.which === 0 || e.which === 1) && (!e.currentTarget.target || e.currentTarget.target === "_self") && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
              e.preventDefault();
              e.redraw = false;
              route.set(href, null, options);
            }
          };
        }
        return child;
      }
    };
    route.param = function(key) {
      return attrs && key != null ? attrs[key] : attrs;
    };
    return route;
  };
});

// node_modules/mithril/route.js
var require_route = __commonJS((exports, module) => {
  var mountRedraw = require_mount_redraw2();
  module.exports = require_router()(typeof window !== "undefined" ? window : null, mountRedraw);
});

// node_modules/mithril/index.js
var require_mithril = __commonJS((exports, module) => {
  var hyperscript = require_hyperscript2();
  var request = require_request2();
  var mountRedraw = require_mount_redraw2();
  var m = function m() {
    return hyperscript.apply(this, arguments);
  };
  m.m = hyperscript;
  m.trust = hyperscript.trust;
  m.fragment = hyperscript.fragment;
  m.Fragment = "[";
  m.mount = mountRedraw.mount;
  m.route = require_route();
  m.render = require_render2();
  m.redraw = mountRedraw.redraw;
  m.request = request.request;
  m.jsonp = request.jsonp;
  m.parseQueryString = require_parse();
  m.buildQueryString = require_build();
  m.parsePathname = require_parse2();
  m.buildPathname = require_build2();
  m.vnode = require_vnode();
  m.PromisePolyfill = require_polyfill();
  m.censor = require_censor();
  module.exports = m;
});

// client/exprparser.js
var require_exprparser = __commonJS((exports, module) => {
  module.exports = function() {
    function peg$subclass(child, parent) {
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor;
    }
    function peg$SyntaxError(message, expected, found, location) {
      this.message = message;
      this.expected = expected;
      this.found = found;
      this.location = location;
      this.name = "SyntaxError";
      if (typeof Error.captureStackTrace === "function") {
        Error.captureStackTrace(this, peg$SyntaxError);
      }
    }
    peg$subclass(peg$SyntaxError, Error);
    peg$SyntaxError.buildMessage = function(expected, found) {
      var DESCRIBE_EXPECTATION_FNS = {
        literal: function(expectation) {
          return "\"" + literalEscape(expectation.text) + "\"";
        },
        class: function(expectation) {
          var escapedParts = "", i;
          for (i = 0;i < expectation.parts.length; i++) {
            escapedParts += expectation.parts[i] instanceof Array ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1]) : classEscape(expectation.parts[i]);
          }
          return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
        },
        any: function(expectation) {
          return "any character";
        },
        end: function(expectation) {
          return "end of input";
        },
        other: function(expectation) {
          return expectation.description;
        }
      };
      function hex(ch) {
        return ch.charCodeAt(0).toString(16).toUpperCase();
      }
      function literalEscape(s) {
        return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
          return "\\x0" + hex(ch);
        }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
          return "\\x" + hex(ch);
        });
      }
      function classEscape(s) {
        return s.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
          return "\\x0" + hex(ch);
        }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
          return "\\x" + hex(ch);
        });
      }
      function describeExpectation(expectation) {
        return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
      }
      function describeExpected(expected2) {
        var descriptions = new Array(expected2.length), i, j;
        for (i = 0;i < expected2.length; i++) {
          descriptions[i] = describeExpectation(expected2[i]);
        }
        descriptions.sort();
        if (descriptions.length > 0) {
          for (i = 1, j = 1;i < descriptions.length; i++) {
            if (descriptions[i - 1] !== descriptions[i]) {
              descriptions[j] = descriptions[i];
              j++;
            }
          }
          descriptions.length = j;
        }
        switch (descriptions.length) {
          case 1:
            return descriptions[0];
          case 2:
            return descriptions[0] + " or " + descriptions[1];
          default:
            return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
        }
      }
      function describeFound(found2) {
        return found2 ? "\"" + literalEscape(found2) + "\"" : "end of input";
      }
      return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
    };
    function peg$parse(input, options) {
      options = options !== undefined ? options : {};
      var peg$FAILED = {}, peg$startRuleFunctions = { Model: peg$parseModel }, peg$startRuleFunction = peg$parseModel, peg$c0 = function(h, t) {
        return [h, ...t.map((x) => x[1])];
      }, peg$c1 = "=", peg$c2 = peg$literalExpectation("=", false), peg$c3 = function(variable, e) {
        return ["=", variable, e];
      }, peg$c4 = "+", peg$c5 = peg$literalExpectation("+", false), peg$c6 = "-", peg$c7 = peg$literalExpectation("-", false), peg$c8 = function(head, op, tail) {
        return [op, head, tail];
      }, peg$c9 = "*", peg$c10 = peg$literalExpectation("*", false), peg$c11 = "/", peg$c12 = peg$literalExpectation("/", false), peg$c13 = /^[a-zA-Z]/, peg$c14 = peg$classExpectation([["a", "z"], ["A", "Z"]], false, false), peg$c15 = /^[A-Za-z0-9_]/, peg$c16 = peg$classExpectation([["A", "Z"], ["a", "z"], ["0", "9"], "_"], false, false), peg$c17 = function(name) {
        return name[0] + name[1].join("");
      }, peg$c18 = "(", peg$c19 = peg$literalExpectation("(", false), peg$c20 = ")", peg$c21 = peg$literalExpectation(")", false), peg$c22 = function(expr) {
        return expr;
      }, peg$c23 = ",", peg$c24 = peg$literalExpectation(",", false), peg$c25 = function(n, expr, e) {
        return [n, expr, ...e.map((x) => x[3])];
      }, peg$c26 = peg$otherExpectation("number"), peg$c27 = /^[0-9]/, peg$c28 = peg$classExpectation([["0", "9"]], false, false), peg$c29 = peg$anyExpectation(), peg$c30 = function() {
        return parseFloat(text(), 10);
      }, peg$c31 = /^[ \t\r\n]/, peg$c32 = peg$classExpectation([" ", "\t", "\r", "\n"], false, false), peg$c33 = /^[ \t\r]/, peg$c34 = peg$classExpectation([" ", "\t", "\r"], false, false), peg$c35 = "\n", peg$c36 = peg$literalExpectation("\n", false), peg$c37 = peg$otherExpectation("whitespace"), peg$currPos = 0, peg$savedPos = 0, peg$posDetailsCache = [{ line: 1, column: 1 }], peg$maxFailPos = 0, peg$maxFailExpected = [], peg$silentFails = 0, peg$result;
      if ("startRule" in options) {
        if (!(options.startRule in peg$startRuleFunctions)) {
          throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
        }
        peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
      }
      function text() {
        return input.substring(peg$savedPos, peg$currPos);
      }
      function location() {
        return peg$computeLocation(peg$savedPos, peg$currPos);
      }
      function expected(description, location2) {
        location2 = location2 !== undefined ? location2 : peg$computeLocation(peg$savedPos, peg$currPos);
        throw peg$buildStructuredError([peg$otherExpectation(description)], input.substring(peg$savedPos, peg$currPos), location2);
      }
      function error(message, location2) {
        location2 = location2 !== undefined ? location2 : peg$computeLocation(peg$savedPos, peg$currPos);
        throw peg$buildSimpleError(message, location2);
      }
      function peg$literalExpectation(text2, ignoreCase) {
        return { type: "literal", text: text2, ignoreCase };
      }
      function peg$classExpectation(parts, inverted, ignoreCase) {
        return { type: "class", parts, inverted, ignoreCase };
      }
      function peg$anyExpectation() {
        return { type: "any" };
      }
      function peg$endExpectation() {
        return { type: "end" };
      }
      function peg$otherExpectation(description) {
        return { type: "other", description };
      }
      function peg$computePosDetails(pos) {
        var details = peg$posDetailsCache[pos], p;
        if (details) {
          return details;
        } else {
          p = pos - 1;
          while (!peg$posDetailsCache[p]) {
            p--;
          }
          details = peg$posDetailsCache[p];
          details = {
            line: details.line,
            column: details.column
          };
          while (p < pos) {
            if (input.charCodeAt(p) === 10) {
              details.line++;
              details.column = 1;
            } else {
              details.column++;
            }
            p++;
          }
          peg$posDetailsCache[pos] = details;
          return details;
        }
      }
      function peg$computeLocation(startPos, endPos) {
        var startPosDetails = peg$computePosDetails(startPos), endPosDetails = peg$computePosDetails(endPos);
        return {
          start: {
            offset: startPos,
            line: startPosDetails.line,
            column: startPosDetails.column
          },
          end: {
            offset: endPos,
            line: endPosDetails.line,
            column: endPosDetails.column
          }
        };
      }
      function peg$fail(expected2) {
        if (peg$currPos < peg$maxFailPos) {
          return;
        }
        if (peg$currPos > peg$maxFailPos) {
          peg$maxFailPos = peg$currPos;
          peg$maxFailExpected = [];
        }
        peg$maxFailExpected.push(expected2);
      }
      function peg$buildSimpleError(message, location2) {
        return new peg$SyntaxError(message, null, null, location2);
      }
      function peg$buildStructuredError(expected2, found, location2) {
        return new peg$SyntaxError(peg$SyntaxError.buildMessage(expected2, found), expected2, found, location2);
      }
      function peg$parseModel() {
        var s0, s1, s2, s3, s4, s5, s6;
        s0 = peg$currPos;
        s1 = peg$parse__();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseStatement();
          if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$currPos;
            s5 = [];
            s6 = peg$parse_n();
            while (s6 !== peg$FAILED) {
              s5.push(s6);
              s6 = peg$parse_n();
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parseStatement();
              if (s6 !== peg$FAILED) {
                s5 = [s5, s6];
                s4 = s5;
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$currPos;
              s5 = [];
              s6 = peg$parse_n();
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                s6 = peg$parse_n();
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parseStatement();
                if (s6 !== peg$FAILED) {
                  s5 = [s5, s6];
                  s4 = s5;
                } else {
                  peg$currPos = s4;
                  s4 = peg$FAILED;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parse__();
              if (s4 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c0(s2, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parseStatement() {
        var s0, s1, s2, s3, s4, s5, s6;
        s0 = peg$currPos;
        s1 = peg$parse_();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseName();
          if (s2 !== peg$FAILED) {
            s3 = peg$parse_();
            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 61) {
                s4 = peg$c1;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c2);
                }
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parse_();
                if (s5 !== peg$FAILED) {
                  s6 = peg$parseExpression();
                  if (s6 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c3(s2, s6);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parseExpression() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        s1 = peg$parseTerm();
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 43) {
              s3 = peg$c4;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c5);
              }
            }
            if (s3 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 45) {
                s3 = peg$c6;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c7);
                }
              }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();
              if (s4 !== peg$FAILED) {
                s5 = peg$parseExpression();
                if (s5 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c8(s1, s3, s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$parseTerm();
        }
        return s0;
      }
      function peg$parseTerm() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        s1 = peg$parseFactor();
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 42) {
              s3 = peg$c9;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c10);
              }
            }
            if (s3 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 47) {
                s3 = peg$c11;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c12);
                }
              }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();
              if (s4 !== peg$FAILED) {
                s5 = peg$parseTerm();
                if (s5 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c8(s1, s3, s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$parseFactor();
        }
        return s0;
      }
      function peg$parseName() {
        var s0, s1, s2, s3, s4;
        s0 = peg$currPos;
        s1 = peg$currPos;
        if (peg$c13.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c14);
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          if (peg$c15.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c16);
            }
          }
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            if (peg$c15.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c16);
              }
            }
          }
          if (s3 !== peg$FAILED) {
            s2 = [s2, s3];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c17(s1);
        }
        s0 = s1;
        return s0;
      }
      function peg$parseFactor() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 40) {
          s1 = peg$c18;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c19);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            s3 = peg$parseExpression();
            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();
              if (s4 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 41) {
                  s5 = peg$c20;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c21);
                  }
                }
                if (s5 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c22(s3);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parseName();
          if (s1 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 40) {
              s2 = peg$c18;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c19);
              }
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parseExpression();
              if (s3 !== peg$FAILED) {
                s4 = [];
                s5 = peg$currPos;
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 44) {
                    s7 = peg$c23;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c24);
                    }
                  }
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parse_();
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parseExpression();
                      if (s9 !== peg$FAILED) {
                        s6 = [s6, s7, s8, s9];
                        s5 = s6;
                      } else {
                        peg$currPos = s5;
                        s5 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s5;
                      s5 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s5;
                    s5 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }
                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  s5 = peg$currPos;
                  s6 = peg$parse_();
                  if (s6 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 44) {
                      s7 = peg$c23;
                      peg$currPos++;
                    } else {
                      s7 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c24);
                      }
                    }
                    if (s7 !== peg$FAILED) {
                      s8 = peg$parse_();
                      if (s8 !== peg$FAILED) {
                        s9 = peg$parseExpression();
                        if (s9 !== peg$FAILED) {
                          s6 = [s6, s7, s8, s9];
                          s5 = s6;
                        } else {
                          peg$currPos = s5;
                          s5 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s5;
                        s5 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s5;
                      s5 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s5;
                    s5 = peg$FAILED;
                  }
                }
                if (s4 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 41) {
                    s5 = peg$c20;
                    peg$currPos++;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c21);
                    }
                  }
                  if (s5 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c25(s1, s3, s4);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$parseNumber();
            if (s0 === peg$FAILED) {
              s0 = peg$parseName();
            }
          }
        }
        return s0;
      }
      function peg$parseNumber() {
        var s0, s1, s2, s3, s4, s5, s6;
        peg$silentFails++;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 45) {
          s1 = peg$c6;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c7);
          }
        }
        if (s1 === peg$FAILED) {
          s1 = null;
        }
        if (s1 !== peg$FAILED) {
          s2 = [];
          if (peg$c27.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c28);
            }
          }
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              if (peg$c27.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c28);
                }
              }
            }
          } else {
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            if (input.length > peg$currPos) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c29);
              }
            }
            if (s4 !== peg$FAILED) {
              s5 = [];
              if (peg$c27.test(input.charAt(peg$currPos))) {
                s6 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c28);
                }
              }
              if (s6 !== peg$FAILED) {
                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  if (peg$c27.test(input.charAt(peg$currPos))) {
                    s6 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s6 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c28);
                    }
                  }
                }
              } else {
                s5 = peg$FAILED;
              }
              if (s5 !== peg$FAILED) {
                s4 = [s4, s5];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            if (s3 === peg$FAILED) {
              s3 = null;
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c30();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c26);
          }
        }
        return s0;
      }
      function peg$parse__() {
        var s0, s1;
        s0 = [];
        if (peg$c31.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c32);
          }
        }
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          if (peg$c31.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c32);
            }
          }
        }
        return s0;
      }
      function peg$parse_n() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = [];
        if (peg$c33.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c34);
          }
        }
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c33.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c34);
            }
          }
        }
        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 10) {
            s2 = peg$c35;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c36);
            }
          }
          if (s2 !== peg$FAILED) {
            s1 = [s1, s2];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        return s0;
      }
      function peg$parse_() {
        var s0, s1;
        peg$silentFails++;
        s0 = [];
        if (peg$c33.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c34);
          }
        }
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          if (peg$c33.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c34);
            }
          }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c37);
          }
        }
        return s0;
      }
      peg$result = peg$startRuleFunction();
      if (peg$result !== peg$FAILED && peg$currPos === input.length) {
        return peg$result;
      } else {
        if (peg$result !== peg$FAILED && peg$currPos < input.length) {
          peg$fail(peg$endExpectation());
        }
        throw peg$buildStructuredError(peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
      }
    }
    return {
      SyntaxError: peg$SyntaxError,
      parse: peg$parse
    };
  }();
});

// client/fixtures/index.ts
var import_mithril3 = __toESM(require_mithril(), 1);

// node_modules/ramda/es/internal/_isPlaceholder.js
function _isPlaceholder(a) {
  return a != null && typeof a === "object" && a["@@functional/placeholder"] === true;
}

// node_modules/ramda/es/internal/_curry1.js
function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
}

// node_modules/ramda/es/internal/_curry2.js
function _curry2(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return _isPlaceholder(a) ? f2 : _curry1(function(_b) {
          return fn(a, _b);
        });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function(_a) {
          return fn(_a, b);
        }) : _isPlaceholder(b) ? _curry1(function(_b) {
          return fn(a, _b);
        }) : fn(a, b);
    }
  };
}

// node_modules/ramda/es/internal/_isArray.js
var _isArray_default = Array.isArray || function _isArray(val) {
  return val != null && val.length >= 0 && Object.prototype.toString.call(val) === "[object Array]";
};

// node_modules/ramda/es/internal/_isTransformer.js
function _isTransformer(obj) {
  return obj != null && typeof obj["@@transducer/step"] === "function";
}

// node_modules/ramda/es/internal/_dispatchable.js
function _dispatchable(methodNames, transducerCreator, fn) {
  return function() {
    if (arguments.length === 0) {
      return fn();
    }
    var obj = arguments[arguments.length - 1];
    if (!_isArray_default(obj)) {
      var idx = 0;
      while (idx < methodNames.length) {
        if (typeof obj[methodNames[idx]] === "function") {
          return obj[methodNames[idx]].apply(obj, Array.prototype.slice.call(arguments, 0, -1));
        }
        idx += 1;
      }
      if (_isTransformer(obj)) {
        var transducer = transducerCreator.apply(null, Array.prototype.slice.call(arguments, 0, -1));
        return transducer(obj);
      }
    }
    return fn.apply(this, arguments);
  };
}

// node_modules/ramda/es/internal/_xfBase.js
var _xfBase_default = {
  init: function() {
    return this.xf["@@transducer/init"]();
  },
  result: function(result) {
    return this.xf["@@transducer/result"](result);
  }
};

// node_modules/ramda/es/internal/_has.js
function _has(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

// node_modules/ramda/es/internal/_isArguments.js
var toString = Object.prototype.toString;
var _isArguments = function() {
  return toString.call(arguments) === "[object Arguments]" ? function _isArguments(x) {
    return toString.call(x) === "[object Arguments]";
  } : function _isArguments(x) {
    return _has("callee", x);
  };
}();
var _isArguments_default = _isArguments;

// node_modules/ramda/es/keys.js
var hasEnumBug = !{
  toString: null
}.propertyIsEnumerable("toString");
var nonEnumerableProps = ["constructor", "valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"];
var hasArgsEnumBug = function() {
  return arguments.propertyIsEnumerable("length");
}();
var contains = function contains2(list, item) {
  var idx = 0;
  while (idx < list.length) {
    if (list[idx] === item) {
      return true;
    }
    idx += 1;
  }
  return false;
};
var keys = typeof Object.keys === "function" && !hasArgsEnumBug ? _curry1(function keys2(obj) {
  return Object(obj) !== obj ? [] : Object.keys(obj);
}) : _curry1(function keys3(obj) {
  if (Object(obj) !== obj) {
    return [];
  }
  var prop, nIdx;
  var ks = [];
  var checkArgsLength = hasArgsEnumBug && _isArguments_default(obj);
  for (prop in obj) {
    if (_has(prop, obj) && (!checkArgsLength || prop !== "length")) {
      ks[ks.length] = prop;
    }
  }
  if (hasEnumBug) {
    nIdx = nonEnumerableProps.length - 1;
    while (nIdx >= 0) {
      prop = nonEnumerableProps[nIdx];
      if (_has(prop, obj) && !contains(ks, prop)) {
        ks[ks.length] = prop;
      }
      nIdx -= 1;
    }
  }
  return ks;
});
var keys_default = keys;

// node_modules/ramda/es/values.js
var values = _curry1(function values2(obj) {
  var props = keys_default(obj);
  var len = props.length;
  var vals = [];
  var idx = 0;
  while (idx < len) {
    vals[idx] = obj[props[idx]];
    idx += 1;
  }
  return vals;
});
var values_default = values;

// node_modules/ramda/es/internal/_xtap.js
var XTap = function() {
  function XTap2(f, xf) {
    this.xf = xf;
    this.f = f;
  }
  XTap2.prototype["@@transducer/init"] = _xfBase_default.init;
  XTap2.prototype["@@transducer/result"] = _xfBase_default.result;
  XTap2.prototype["@@transducer/step"] = function(result, input) {
    this.f(input);
    return this.xf["@@transducer/step"](result, input);
  };
  return XTap2;
}();
function _xtap(f) {
  return function(xf) {
    return new XTap(f, xf);
  };
}

// node_modules/ramda/es/tap.js
var tap = _curry2(_dispatchable([], _xtap, function tap2(fn, x) {
  fn(x);
  return x;
}));
var tap_default = tap;
// client/fixtures/basic_components.ts
var exports_basic_components = {};
__export(exports_basic_components, {
  LabeledNumberStories: () => {
    {
      return LabeledNumberStories;
    }
  }
});

// client/views/components.ts
var import_mithril = __toESM(require_mithril(), 1);

// client/model.ts
var exprparser = __toESM(require_exprparser(), 1);

// client/views/components.ts
var LabeledNumber = {
  view: ({ attrs: { label = "", number = 0, precision = 0, postunit = "", preunit = "" } }) => {
    return import_mithril.default("span.labeled-number", import_mithril.default("span.label", label), import_mithril.default("span.number", preunit, number.toLocaleString("en-US", { maximumFractionDigits: precision }), postunit));
  }
};

// node_modules/fast-check/lib/esm/check/precondition/PreconditionFailure.js
class PreconditionFailure extends Error {
  constructor(interruptExecution = false) {
    super();
    this.interruptExecution = interruptExecution;
    this.footprint = PreconditionFailure.SharedFootPrint;
  }
  static isFailure(err) {
    return err != null && err.footprint === PreconditionFailure.SharedFootPrint;
  }
}
PreconditionFailure.SharedFootPrint = Symbol("fast-check/PreconditionFailure");

// node_modules/fast-check/lib/esm/stream/StreamHelpers.js
function nilHelper() {
  return Nil.nil;
}
function* mapHelper(g, f) {
  for (const v of g) {
    yield f(v);
  }
}
function* flatMapHelper(g, f) {
  for (const v of g) {
    yield* f(v);
  }
}
function* filterHelper(g, f) {
  for (const v of g) {
    if (f(v)) {
      yield v;
    }
  }
}
function* takeNHelper(g, n) {
  for (let i = 0;i < n; ++i) {
    const cur = g.next();
    if (cur.done) {
      break;
    }
    yield cur.value;
  }
}
function* takeWhileHelper(g, f) {
  let cur = g.next();
  while (!cur.done && f(cur.value)) {
    yield cur.value;
    cur = g.next();
  }
}
function* joinHelper(g, others) {
  for (let cur = g.next();!cur.done; cur = g.next()) {
    yield cur.value;
  }
  for (const s of others) {
    for (let cur = s.next();!cur.done; cur = s.next()) {
      yield cur.value;
    }
  }
}

class Nil {
  [Symbol.iterator]() {
    return this;
  }
  next(value) {
    return { value, done: true };
  }
}
Nil.nil = new Nil;

// node_modules/fast-check/lib/esm/stream/Stream.js
function stream(g) {
  return new Stream(g);
}
var safeSymbolIterator = Symbol.iterator;

class Stream {
  static nil() {
    return new Stream(nilHelper());
  }
  static of(...elements) {
    return new Stream(elements[safeSymbolIterator]());
  }
  constructor(g) {
    this.g = g;
  }
  next() {
    return this.g.next();
  }
  [safeSymbolIterator]() {
    return this.g;
  }
  map(f) {
    return new Stream(mapHelper(this.g, f));
  }
  flatMap(f) {
    return new Stream(flatMapHelper(this.g, f));
  }
  dropWhile(f) {
    let foundEligible = false;
    function* helper(v) {
      if (foundEligible || !f(v)) {
        foundEligible = true;
        yield v;
      }
    }
    return this.flatMap(helper);
  }
  drop(n) {
    if (n <= 0) {
      return this;
    }
    let idx = 0;
    function helper() {
      return idx++ < n;
    }
    return this.dropWhile(helper);
  }
  takeWhile(f) {
    return new Stream(takeWhileHelper(this.g, f));
  }
  take(n) {
    return new Stream(takeNHelper(this.g, n));
  }
  filter(f) {
    return new Stream(filterHelper(this.g, f));
  }
  every(f) {
    for (const v of this.g) {
      if (!f(v)) {
        return false;
      }
    }
    return true;
  }
  has(f) {
    for (const v of this.g) {
      if (f(v)) {
        return [true, v];
      }
    }
    return [false, null];
  }
  join(...others) {
    return new Stream(joinHelper(this.g, others));
  }
  getNthOrLast(nth) {
    let remaining = nth;
    let last = null;
    for (const v of this.g) {
      if (remaining-- === 0)
        return v;
      last = v;
    }
    return last;
  }
}

// node_modules/fast-check/lib/esm/check/symbols.js
function hasCloneMethod(instance) {
  return instance !== null && (typeof instance === "object" || typeof instance === "function") && (cloneMethod in instance) && typeof instance[cloneMethod] === "function";
}
var cloneMethod = Symbol("fast-check/cloneMethod");

// node_modules/fast-check/lib/esm/check/arbitrary/definition/Value.js
var safeObjectDefineProperty = Object.defineProperty;

class Value {
  constructor(value_, context, customGetValue = undefined) {
    this.value_ = value_;
    this.context = context;
    this.hasToBeCloned = customGetValue !== undefined || hasCloneMethod(value_);
    this.readOnce = false;
    if (this.hasToBeCloned) {
      safeObjectDefineProperty(this, "value", { get: customGetValue !== undefined ? customGetValue : this.getValue });
    } else {
      this.value = value_;
    }
  }
  getValue() {
    if (this.hasToBeCloned) {
      if (!this.readOnce) {
        this.readOnce = true;
        return this.value_;
      }
      return this.value_[cloneMethod]();
    }
    return this.value_;
  }
}

// node_modules/fast-check/lib/esm/check/arbitrary/definition/Arbitrary.js
var safeObjectAssign = Object.assign;

class Arbitrary {
  filter(refinement) {
    return new FilterArbitrary(this, refinement);
  }
  map(mapper, unmapper) {
    return new MapArbitrary(this, mapper, unmapper);
  }
  chain(chainer) {
    return new ChainArbitrary(this, chainer);
  }
  noShrink() {
    return new NoShrinkArbitrary(this);
  }
  noBias() {
    return new NoBiasArbitrary(this);
  }
}

class ChainArbitrary extends Arbitrary {
  constructor(arb, chainer) {
    super();
    this.arb = arb;
    this.chainer = chainer;
  }
  generate(mrng, biasFactor) {
    const clonedMrng = mrng.clone();
    const src = this.arb.generate(mrng, biasFactor);
    return this.valueChainer(src, mrng, clonedMrng, biasFactor);
  }
  canShrinkWithoutContext(value) {
    return false;
  }
  shrink(value, context) {
    if (this.isSafeContext(context)) {
      return (!context.stoppedForOriginal ? this.arb.shrink(context.originalValue, context.originalContext).map((v) => this.valueChainer(v, context.clonedMrng.clone(), context.clonedMrng, context.originalBias)) : Stream.nil()).join(context.chainedArbitrary.shrink(value, context.chainedContext).map((dst) => {
        const newContext = safeObjectAssign(safeObjectAssign({}, context), {
          chainedContext: dst.context,
          stoppedForOriginal: true
        });
        return new Value(dst.value_, newContext);
      }));
    }
    return Stream.nil();
  }
  valueChainer(v, generateMrng, clonedMrng, biasFactor) {
    const chainedArbitrary = this.chainer(v.value_);
    const dst = chainedArbitrary.generate(generateMrng, biasFactor);
    const context = {
      originalBias: biasFactor,
      originalValue: v.value_,
      originalContext: v.context,
      stoppedForOriginal: false,
      chainedArbitrary,
      chainedContext: dst.context,
      clonedMrng
    };
    return new Value(dst.value_, context);
  }
  isSafeContext(context) {
    return context != null && typeof context === "object" && ("originalBias" in context) && ("originalValue" in context) && ("originalContext" in context) && ("stoppedForOriginal" in context) && ("chainedArbitrary" in context) && ("chainedContext" in context) && ("clonedMrng" in context);
  }
}

class MapArbitrary extends Arbitrary {
  constructor(arb, mapper, unmapper) {
    super();
    this.arb = arb;
    this.mapper = mapper;
    this.unmapper = unmapper;
    this.bindValueMapper = (v) => this.valueMapper(v);
  }
  generate(mrng, biasFactor) {
    const g = this.arb.generate(mrng, biasFactor);
    return this.valueMapper(g);
  }
  canShrinkWithoutContext(value) {
    if (this.unmapper !== undefined) {
      try {
        const unmapped = this.unmapper(value);
        return this.arb.canShrinkWithoutContext(unmapped);
      } catch (_err) {
        return false;
      }
    }
    return false;
  }
  shrink(value, context) {
    if (this.isSafeContext(context)) {
      return this.arb.shrink(context.originalValue, context.originalContext).map(this.bindValueMapper);
    }
    if (this.unmapper !== undefined) {
      const unmapped = this.unmapper(value);
      return this.arb.shrink(unmapped, undefined).map(this.bindValueMapper);
    }
    return Stream.nil();
  }
  mapperWithCloneIfNeeded(v) {
    const sourceValue = v.value;
    const mappedValue = this.mapper(sourceValue);
    if (v.hasToBeCloned && (typeof mappedValue === "object" && mappedValue !== null || typeof mappedValue === "function") && Object.isExtensible(mappedValue) && !hasCloneMethod(mappedValue)) {
      Object.defineProperty(mappedValue, cloneMethod, { get: () => () => this.mapperWithCloneIfNeeded(v)[0] });
    }
    return [mappedValue, sourceValue];
  }
  valueMapper(v) {
    const [mappedValue, sourceValue] = this.mapperWithCloneIfNeeded(v);
    const context = { originalValue: sourceValue, originalContext: v.context };
    return new Value(mappedValue, context);
  }
  isSafeContext(context) {
    return context != null && typeof context === "object" && ("originalValue" in context) && ("originalContext" in context);
  }
}

class FilterArbitrary extends Arbitrary {
  constructor(arb, refinement) {
    super();
    this.arb = arb;
    this.refinement = refinement;
    this.bindRefinementOnValue = (v) => this.refinementOnValue(v);
  }
  generate(mrng, biasFactor) {
    while (true) {
      const g = this.arb.generate(mrng, biasFactor);
      if (this.refinementOnValue(g)) {
        return g;
      }
    }
  }
  canShrinkWithoutContext(value) {
    return this.arb.canShrinkWithoutContext(value) && this.refinement(value);
  }
  shrink(value, context) {
    return this.arb.shrink(value, context).filter(this.bindRefinementOnValue);
  }
  refinementOnValue(v) {
    return this.refinement(v.value);
  }
}

class NoShrinkArbitrary extends Arbitrary {
  constructor(arb) {
    super();
    this.arb = arb;
  }
  generate(mrng, biasFactor) {
    return this.arb.generate(mrng, biasFactor);
  }
  canShrinkWithoutContext(value) {
    return this.arb.canShrinkWithoutContext(value);
  }
  shrink(_value, _context) {
    return Stream.nil();
  }
  noShrink() {
    return this;
  }
}

class NoBiasArbitrary extends Arbitrary {
  constructor(arb) {
    super();
    this.arb = arb;
  }
  generate(mrng, _biasFactor) {
    return this.arb.generate(mrng, undefined);
  }
  canShrinkWithoutContext(value) {
    return this.arb.canShrinkWithoutContext(value);
  }
  shrink(value, context) {
    return this.arb.shrink(value, context);
  }
  noBias() {
    return this;
  }
}

// node_modules/fast-check/lib/esm/utils/globals.js
var SError = typeof Error !== "undefined" ? Error : undefined;
var SString = typeof String !== "undefined" ? String : undefined;
var untouchedForEach = Array.prototype.forEach;
var untouchedIndexOf = Array.prototype.indexOf;
var untouchedJoin = Array.prototype.join;
var untouchedMap = Array.prototype.map;
var untouchedFilter = Array.prototype.filter;
var untouchedPush = Array.prototype.push;
var untouchedPop = Array.prototype.pop;
var untouchedSplice = Array.prototype.splice;
var untouchedSlice = Array.prototype.slice;
var untouchedSort = Array.prototype.sort;
var untouchedEvery = Array.prototype.every;
var untouchedGetTime = Date.prototype.getTime;
var untouchedToISOString = Date.prototype.toISOString;
var untouchedAdd = Set.prototype.add;
var untouchedSplit = String.prototype.split;
var untouchedStartsWith = String.prototype.startsWith;
var untouchedEndsWith = String.prototype.endsWith;
var untouchedSubstring = String.prototype.substring;
var untouchedToLowerCase = String.prototype.toLowerCase;
var untouchedToUpperCase = String.prototype.toUpperCase;
var untouchedPadStart = String.prototype.padStart;
var untouchedCharCodeAt = String.prototype.charCodeAt;
var untouchedReplace = String.prototype.replace;
var untouchedNumberToString = Number.prototype.toString;

// node_modules/fast-check/lib/esm/check/property/IRawProperty.js
function runIdToFrequency(runId) {
  return 2 + ~~(safeMathLog(runId + 1) * 0.4342944819032518);
}
var safeMathLog = Math.log;

// node_modules/fast-check/lib/esm/check/runner/configuration/GlobalParameters.js
function readConfigureGlobal() {
  return globalParameters;
}
var globalParameters = {};

// node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/NoUndefinedAsContext.js
function noUndefinedAsContext(value) {
  if (value.context !== undefined) {
    return value;
  }
  if (value.hasToBeCloned) {
    return new Value(value.value_, UndefinedContextPlaceholder, () => value.value);
  }
  return new Value(value.value_, UndefinedContextPlaceholder);
}
var UndefinedContextPlaceholder = Symbol("UndefinedContextPlaceholder");

// node_modules/fast-check/lib/esm/check/property/Property.generic.js
class Property {
  constructor(arb, predicate) {
    this.arb = arb;
    this.predicate = predicate;
    const { beforeEach = Property.dummyHook, afterEach = Property.dummyHook, asyncBeforeEach, asyncAfterEach } = readConfigureGlobal() || {};
    if (asyncBeforeEach !== undefined) {
      throw SError('"asyncBeforeEach" can\'t be set when running synchronous properties');
    }
    if (asyncAfterEach !== undefined) {
      throw SError('"asyncAfterEach" can\'t be set when running synchronous properties');
    }
    this.beforeEachHook = beforeEach;
    this.afterEachHook = afterEach;
  }
  isAsync() {
    return false;
  }
  generate(mrng, runId) {
    const value = this.arb.generate(mrng, runId != null ? runIdToFrequency(runId) : undefined);
    return noUndefinedAsContext(value);
  }
  shrink(value) {
    if (value.context === undefined && !this.arb.canShrinkWithoutContext(value.value_)) {
      return Stream.nil();
    }
    const safeContext = value.context !== UndefinedContextPlaceholder ? value.context : undefined;
    return this.arb.shrink(value.value_, safeContext).map(noUndefinedAsContext);
  }
  runBeforeEach() {
    this.beforeEachHook();
  }
  runAfterEach() {
    this.afterEachHook();
  }
  run(v, dontRunHook) {
    if (!dontRunHook) {
      this.beforeEachHook();
    }
    try {
      const output = this.predicate(v);
      return output == null || output === true ? null : {
        error: new SError("Property failed by returning false"),
        errorMessage: "Error: Property failed by returning false"
      };
    } catch (err) {
      if (PreconditionFailure.isFailure(err))
        return err;
      if (err instanceof SError && err.stack) {
        return { error: err, errorMessage: err.stack };
      }
      return { error: err, errorMessage: SString(err) };
    } finally {
      if (!dontRunHook) {
        this.afterEachHook();
      }
    }
  }
  beforeEach(hookFunction) {
    const previousBeforeEachHook = this.beforeEachHook;
    this.beforeEachHook = () => hookFunction(previousBeforeEachHook);
    return this;
  }
  afterEach(hookFunction) {
    const previousAfterEachHook = this.afterEachHook;
    this.afterEachHook = () => hookFunction(previousAfterEachHook);
    return this;
  }
}
Property.dummyHook = () => {
};

// node_modules/pure-rand/lib/esm/pure-rand-default.js
var exports_pure_rand_default = {};
__export(exports_pure_rand_default, {
  xorshift128plus: () => {
    {
      return xorshift128plus;
    }
  },
  xoroshiro128plus: () => {
    {
      return xoroshiro128plus;
    }
  },
  unsafeUniformIntDistribution: () => {
    {
      return unsafeUniformIntDistribution;
    }
  },
  unsafeUniformBigIntDistribution: () => {
    {
      return unsafeUniformBigIntDistribution;
    }
  },
  unsafeUniformArrayIntDistribution: () => {
    {
      return unsafeUniformArrayIntDistribution;
    }
  },
  unsafeSkipN: () => {
    {
      return unsafeSkipN;
    }
  },
  unsafeGenerateN: () => {
    {
      return unsafeGenerateN;
    }
  },
  uniformIntDistribution: () => {
    {
      return uniformIntDistribution;
    }
  },
  uniformBigIntDistribution: () => {
    {
      return uniformBigIntDistribution;
    }
  },
  uniformArrayIntDistribution: () => {
    {
      return uniformArrayIntDistribution;
    }
  },
  skipN: () => {
    {
      return skipN;
    }
  },
  mersenne: () => {
    {
      return MersenneTwister_default;
    }
  },
  generateN: () => {
    {
      return generateN;
    }
  },
  congruential32: () => {
    {
      return congruential32;
    }
  },
  __version: () => {
    {
      return __version;
    }
  },
  __type: () => {
    {
      return __type;
    }
  },
  __commitHash: () => {
    {
      return __commitHash;
    }
  }
});

// node_modules/pure-rand/lib/esm/generator/RandomGenerator.js
function unsafeGenerateN(rng, num) {
  var out = [];
  for (var idx = 0;idx != num; ++idx) {
    out.push(rng.unsafeNext());
  }
  return out;
}
function generateN(rng, num) {
  var nextRng = rng.clone();
  var out = unsafeGenerateN(nextRng, num);
  return [out, nextRng];
}
function unsafeSkipN(rng, num) {
  for (var idx = 0;idx != num; ++idx) {
    rng.unsafeNext();
  }
}
function skipN(rng, num) {
  var nextRng = rng.clone();
  unsafeSkipN(nextRng, num);
  return nextRng;
}

// node_modules/pure-rand/lib/esm/generator/LinearCongruential.js
var MULTIPLIER = 214013;
var INCREMENT = 2531011;
var MASK = 4294967295;
var MASK_2 = (1 << 31) - 1;
var computeNextSeed = function(seed) {
  return seed * MULTIPLIER + INCREMENT & MASK;
};
var computeValueFromNextSeed = function(nextseed) {
  return (nextseed & MASK_2) >> 16;
};
var LinearCongruential32 = function() {
  function LinearCongruential322(seed) {
    this.seed = seed;
  }
  LinearCongruential322.prototype.clone = function() {
    return new LinearCongruential322(this.seed);
  };
  LinearCongruential322.prototype.next = function() {
    var nextRng = new LinearCongruential322(this.seed);
    var out = nextRng.unsafeNext();
    return [out, nextRng];
  };
  LinearCongruential322.prototype.unsafeNext = function() {
    var s1 = computeNextSeed(this.seed);
    var v1 = computeValueFromNextSeed(s1);
    var s2 = computeNextSeed(s1);
    var v2 = computeValueFromNextSeed(s2);
    this.seed = computeNextSeed(s2);
    var v3 = computeValueFromNextSeed(this.seed);
    var vnext = v3 + (v2 + (v1 << 15) << 15);
    return vnext | 0;
  };
  return LinearCongruential322;
}();
var congruential32 = function(seed) {
  return new LinearCongruential32(seed);
};

// node_modules/pure-rand/lib/esm/generator/MersenneTwister.js
var MersenneTwister = function() {
  function MersenneTwister2(states, index) {
    this.states = states;
    this.index = index;
  }
  MersenneTwister2.twist = function(prev) {
    var mt = prev.slice();
    for (var idx = 0;idx !== MersenneTwister2.N - MersenneTwister2.M; ++idx) {
      var y_1 = (mt[idx] & MersenneTwister2.MASK_UPPER) + (mt[idx + 1] & MersenneTwister2.MASK_LOWER);
      mt[idx] = mt[idx + MersenneTwister2.M] ^ y_1 >>> 1 ^ -(y_1 & 1) & MersenneTwister2.A;
    }
    for (var idx = MersenneTwister2.N - MersenneTwister2.M;idx !== MersenneTwister2.N - 1; ++idx) {
      var y_2 = (mt[idx] & MersenneTwister2.MASK_UPPER) + (mt[idx + 1] & MersenneTwister2.MASK_LOWER);
      mt[idx] = mt[idx + MersenneTwister2.M - MersenneTwister2.N] ^ y_2 >>> 1 ^ -(y_2 & 1) & MersenneTwister2.A;
    }
    var y = (mt[MersenneTwister2.N - 1] & MersenneTwister2.MASK_UPPER) + (mt[0] & MersenneTwister2.MASK_LOWER);
    mt[MersenneTwister2.N - 1] = mt[MersenneTwister2.M - 1] ^ y >>> 1 ^ -(y & 1) & MersenneTwister2.A;
    return mt;
  };
  MersenneTwister2.seeded = function(seed) {
    var out = Array(MersenneTwister2.N);
    out[0] = seed;
    for (var idx = 1;idx !== MersenneTwister2.N; ++idx) {
      var xored = out[idx - 1] ^ out[idx - 1] >>> 30;
      out[idx] = Math.imul(MersenneTwister2.F, xored) + idx | 0;
    }
    return out;
  };
  MersenneTwister2.from = function(seed) {
    return new MersenneTwister2(MersenneTwister2.twist(MersenneTwister2.seeded(seed)), 0);
  };
  MersenneTwister2.prototype.clone = function() {
    return new MersenneTwister2(this.states, this.index);
  };
  MersenneTwister2.prototype.next = function() {
    var nextRng = new MersenneTwister2(this.states, this.index);
    var out = nextRng.unsafeNext();
    return [out, nextRng];
  };
  MersenneTwister2.prototype.unsafeNext = function() {
    var y = this.states[this.index];
    y ^= this.states[this.index] >>> MersenneTwister2.U;
    y ^= y << MersenneTwister2.S & MersenneTwister2.B;
    y ^= y << MersenneTwister2.T & MersenneTwister2.C;
    y ^= y >>> MersenneTwister2.L;
    if (++this.index >= MersenneTwister2.N) {
      this.states = MersenneTwister2.twist(this.states);
      this.index = 0;
    }
    return y;
  };
  MersenneTwister2.N = 624;
  MersenneTwister2.M = 397;
  MersenneTwister2.R = 31;
  MersenneTwister2.A = 2567483615;
  MersenneTwister2.F = 1812433253;
  MersenneTwister2.U = 11;
  MersenneTwister2.S = 7;
  MersenneTwister2.B = 2636928640;
  MersenneTwister2.T = 15;
  MersenneTwister2.C = 4022730752;
  MersenneTwister2.L = 18;
  MersenneTwister2.MASK_LOWER = Math.pow(2, MersenneTwister2.R) - 1;
  MersenneTwister2.MASK_UPPER = Math.pow(2, MersenneTwister2.R);
  return MersenneTwister2;
}();
function MersenneTwister_default(seed) {
  return MersenneTwister.from(seed);
}

// node_modules/pure-rand/lib/esm/generator/XorShift.js
var XorShift128Plus = function() {
  function XorShift128Plus2(s01, s00, s11, s10) {
    this.s01 = s01;
    this.s00 = s00;
    this.s11 = s11;
    this.s10 = s10;
  }
  XorShift128Plus2.prototype.clone = function() {
    return new XorShift128Plus2(this.s01, this.s00, this.s11, this.s10);
  };
  XorShift128Plus2.prototype.next = function() {
    var nextRng = new XorShift128Plus2(this.s01, this.s00, this.s11, this.s10);
    var out = nextRng.unsafeNext();
    return [out, nextRng];
  };
  XorShift128Plus2.prototype.unsafeNext = function() {
    var a0 = this.s00 ^ this.s00 << 23;
    var a1 = this.s01 ^ (this.s01 << 23 | this.s00 >>> 9);
    var b0 = a0 ^ this.s10 ^ (a0 >>> 18 | a1 << 14) ^ (this.s10 >>> 5 | this.s11 << 27);
    var b1 = a1 ^ this.s11 ^ a1 >>> 18 ^ this.s11 >>> 5;
    var out = this.s00 + this.s10 | 0;
    this.s01 = this.s11;
    this.s00 = this.s10;
    this.s11 = b1;
    this.s10 = b0;
    return out;
  };
  XorShift128Plus2.prototype.jump = function() {
    var nextRng = new XorShift128Plus2(this.s01, this.s00, this.s11, this.s10);
    nextRng.unsafeJump();
    return nextRng;
  };
  XorShift128Plus2.prototype.unsafeJump = function() {
    var ns01 = 0;
    var ns00 = 0;
    var ns11 = 0;
    var ns10 = 0;
    var jump = [1667051007, 2321340297, 1548169110, 304075285];
    for (var i = 0;i !== 4; ++i) {
      for (var mask = 1;mask; mask <<= 1) {
        if (jump[i] & mask) {
          ns01 ^= this.s01;
          ns00 ^= this.s00;
          ns11 ^= this.s11;
          ns10 ^= this.s10;
        }
        this.unsafeNext();
      }
    }
    this.s01 = ns01;
    this.s00 = ns00;
    this.s11 = ns11;
    this.s10 = ns10;
  };
  return XorShift128Plus2;
}();
var xorshift128plus = function(seed) {
  return new XorShift128Plus(-1, ~seed, seed | 0, 0);
};

// node_modules/pure-rand/lib/esm/generator/XoroShiro.js
var XoroShiro128Plus = function() {
  function XoroShiro128Plus2(s01, s00, s11, s10) {
    this.s01 = s01;
    this.s00 = s00;
    this.s11 = s11;
    this.s10 = s10;
  }
  XoroShiro128Plus2.prototype.clone = function() {
    return new XoroShiro128Plus2(this.s01, this.s00, this.s11, this.s10);
  };
  XoroShiro128Plus2.prototype.next = function() {
    var nextRng = new XoroShiro128Plus2(this.s01, this.s00, this.s11, this.s10);
    var out = nextRng.unsafeNext();
    return [out, nextRng];
  };
  XoroShiro128Plus2.prototype.unsafeNext = function() {
    var out = this.s00 + this.s10 | 0;
    var a0 = this.s10 ^ this.s00;
    var a1 = this.s11 ^ this.s01;
    var s00 = this.s00;
    var s01 = this.s01;
    this.s00 = s00 << 24 ^ s01 >>> 8 ^ a0 ^ a0 << 16;
    this.s01 = s01 << 24 ^ s00 >>> 8 ^ a1 ^ (a1 << 16 | a0 >>> 16);
    this.s10 = a1 << 5 ^ a0 >>> 27;
    this.s11 = a0 << 5 ^ a1 >>> 27;
    return out;
  };
  XoroShiro128Plus2.prototype.jump = function() {
    var nextRng = new XoroShiro128Plus2(this.s01, this.s00, this.s11, this.s10);
    nextRng.unsafeJump();
    return nextRng;
  };
  XoroShiro128Plus2.prototype.unsafeJump = function() {
    var ns01 = 0;
    var ns00 = 0;
    var ns11 = 0;
    var ns10 = 0;
    var jump = [3639956645, 3750757012, 1261568508, 386426335];
    for (var i = 0;i !== 4; ++i) {
      for (var mask = 1;mask; mask <<= 1) {
        if (jump[i] & mask) {
          ns01 ^= this.s01;
          ns00 ^= this.s00;
          ns11 ^= this.s11;
          ns10 ^= this.s10;
        }
        this.unsafeNext();
      }
    }
    this.s01 = ns01;
    this.s00 = ns00;
    this.s11 = ns11;
    this.s10 = ns10;
  };
  return XoroShiro128Plus2;
}();
var xoroshiro128plus = function(seed) {
  return new XoroShiro128Plus(-1, ~seed, seed | 0, 0);
};

// node_modules/pure-rand/lib/esm/distribution/internals/ArrayInt.js
function addArrayIntToNew(arrayIntA, arrayIntB) {
  if (arrayIntA.sign !== arrayIntB.sign) {
    return substractArrayIntToNew(arrayIntA, { sign: -arrayIntB.sign, data: arrayIntB.data });
  }
  var data = [];
  var reminder = 0;
  var dataA = arrayIntA.data;
  var dataB = arrayIntB.data;
  for (var indexA = dataA.length - 1, indexB = dataB.length - 1;indexA >= 0 || indexB >= 0; --indexA, --indexB) {
    var vA = indexA >= 0 ? dataA[indexA] : 0;
    var vB = indexB >= 0 ? dataB[indexB] : 0;
    var current = vA + vB + reminder;
    data.push(current >>> 0);
    reminder = ~~(current / 4294967296);
  }
  if (reminder !== 0) {
    data.push(reminder);
  }
  return { sign: arrayIntA.sign, data: data.reverse() };
}
function addOneToPositiveArrayInt(arrayInt) {
  arrayInt.sign = 1;
  var data = arrayInt.data;
  for (var index = data.length - 1;index >= 0; --index) {
    if (data[index] === 4294967295) {
      data[index] = 0;
    } else {
      data[index] += 1;
      return arrayInt;
    }
  }
  data.unshift(1);
  return arrayInt;
}
var isStrictlySmaller = function(dataA, dataB) {
  var maxLength = Math.max(dataA.length, dataB.length);
  for (var index = 0;index < maxLength; ++index) {
    var indexA = index + dataA.length - maxLength;
    var indexB = index + dataB.length - maxLength;
    var vA = indexA >= 0 ? dataA[indexA] : 0;
    var vB = indexB >= 0 ? dataB[indexB] : 0;
    if (vA < vB)
      return true;
    if (vA > vB)
      return false;
  }
  return false;
};
function substractArrayIntToNew(arrayIntA, arrayIntB) {
  if (arrayIntA.sign !== arrayIntB.sign) {
    return addArrayIntToNew(arrayIntA, { sign: -arrayIntB.sign, data: arrayIntB.data });
  }
  var dataA = arrayIntA.data;
  var dataB = arrayIntB.data;
  if (isStrictlySmaller(dataA, dataB)) {
    var out = substractArrayIntToNew(arrayIntB, arrayIntA);
    out.sign = -out.sign;
    return out;
  }
  var data = [];
  var reminder = 0;
  for (var indexA = dataA.length - 1, indexB = dataB.length - 1;indexA >= 0 || indexB >= 0; --indexA, --indexB) {
    var vA = indexA >= 0 ? dataA[indexA] : 0;
    var vB = indexB >= 0 ? dataB[indexB] : 0;
    var current = vA - vB - reminder;
    data.push(current >>> 0);
    reminder = current < 0 ? 1 : 0;
  }
  return { sign: arrayIntA.sign, data: data.reverse() };
}
function trimArrayIntInplace(arrayInt) {
  var data = arrayInt.data;
  var firstNonZero = 0;
  for (;firstNonZero !== data.length && data[firstNonZero] === 0; ++firstNonZero) {
  }
  if (firstNonZero === data.length) {
    arrayInt.sign = 1;
    arrayInt.data = [0];
    return arrayInt;
  }
  data.splice(0, firstNonZero);
  return arrayInt;
}
function fromNumberToArrayInt64(out, n) {
  if (n < 0) {
    var posN = -n;
    out.sign = -1;
    out.data[0] = ~~(posN / 4294967296);
    out.data[1] = posN >>> 0;
  } else {
    out.sign = 1;
    out.data[0] = ~~(n / 4294967296);
    out.data[1] = n >>> 0;
  }
  return out;
}
function substractArrayInt64(out, arrayIntA, arrayIntB) {
  var lowA = arrayIntA.data[1];
  var highA = arrayIntA.data[0];
  var signA = arrayIntA.sign;
  var lowB = arrayIntB.data[1];
  var highB = arrayIntB.data[0];
  var signB = arrayIntB.sign;
  out.sign = 1;
  if (signA === 1 && signB === -1) {
    var low_1 = lowA + lowB;
    var high = highA + highB + (low_1 > 4294967295 ? 1 : 0);
    out.data[0] = high >>> 0;
    out.data[1] = low_1 >>> 0;
    return out;
  }
  var lowFirst = lowA;
  var highFirst = highA;
  var lowSecond = lowB;
  var highSecond = highB;
  if (signA === -1) {
    lowFirst = lowB;
    highFirst = highB;
    lowSecond = lowA;
    highSecond = highA;
  }
  var reminderLow = 0;
  var low = lowFirst - lowSecond;
  if (low < 0) {
    reminderLow = 1;
    low = low >>> 0;
  }
  out.data[0] = highFirst - highSecond - reminderLow;
  out.data[1] = low;
  return out;
}

// node_modules/pure-rand/lib/esm/distribution/internals/UnsafeUniformIntDistributionInternal.js
function unsafeUniformIntDistributionInternal(rangeSize, rng) {
  var MaxAllowed = rangeSize > 2 ? ~~(4294967296 / rangeSize) * rangeSize : 4294967296;
  var deltaV = rng.unsafeNext() + 2147483648;
  while (deltaV >= MaxAllowed) {
    deltaV = rng.unsafeNext() + 2147483648;
  }
  return deltaV % rangeSize;
}

// node_modules/pure-rand/lib/esm/distribution/internals/UnsafeUniformArrayIntDistributionInternal.js
function unsafeUniformArrayIntDistributionInternal(out, rangeSize, rng) {
  var rangeLength = rangeSize.length;
  while (true) {
    for (var index = 0;index !== rangeLength; ++index) {
      var indexRangeSize = index === 0 ? rangeSize[0] + 1 : 4294967296;
      var g = unsafeUniformIntDistributionInternal(indexRangeSize, rng);
      out[index] = g;
    }
    for (var index = 0;index !== rangeLength; ++index) {
      var current = out[index];
      var currentInRange = rangeSize[index];
      if (current < currentInRange) {
        return out;
      } else if (current > currentInRange) {
        break;
      }
    }
  }
}

// node_modules/pure-rand/lib/esm/distribution/UnsafeUniformArrayIntDistribution.js
function unsafeUniformArrayIntDistribution(from, to, rng) {
  var rangeSize = trimArrayIntInplace(addOneToPositiveArrayInt(substractArrayIntToNew(to, from)));
  var emptyArrayIntData = rangeSize.data.slice(0);
  var g = unsafeUniformArrayIntDistributionInternal(emptyArrayIntData, rangeSize.data, rng);
  return trimArrayIntInplace(addArrayIntToNew({ sign: 1, data: g }, from));
}

// node_modules/pure-rand/lib/esm/distribution/UniformArrayIntDistribution.js
var uniformArrayIntDistribution = function(from, to, rng) {
  if (rng != null) {
    var nextRng = rng.clone();
    return [unsafeUniformArrayIntDistribution(from, to, nextRng), nextRng];
  }
  return function(rng2) {
    var nextRng2 = rng2.clone();
    return [unsafeUniformArrayIntDistribution(from, to, nextRng2), nextRng2];
  };
};

// node_modules/pure-rand/lib/esm/distribution/UnsafeUniformBigIntDistribution.js
function unsafeUniformBigIntDistribution(from, to, rng) {
  var diff = to - from + SBigInt(1);
  var MinRng = SBigInt(-2147483648);
  var NumValues = SBigInt(4294967296);
  var FinalNumValues = NumValues;
  var NumIterations = 1;
  while (FinalNumValues < diff) {
    FinalNumValues *= NumValues;
    ++NumIterations;
  }
  var MaxAcceptedRandom = FinalNumValues - FinalNumValues % diff;
  while (true) {
    var value = SBigInt(0);
    for (var num = 0;num !== NumIterations; ++num) {
      var out = rng.unsafeNext();
      value = NumValues * value + (SBigInt(out) - MinRng);
    }
    if (value < MaxAcceptedRandom) {
      var inDiff = value % diff;
      return inDiff + from;
    }
  }
}
var SBigInt = typeof BigInt !== "undefined" ? BigInt : undefined;

// node_modules/pure-rand/lib/esm/distribution/UniformBigIntDistribution.js
var uniformBigIntDistribution = function(from, to, rng) {
  if (rng != null) {
    var nextRng = rng.clone();
    return [unsafeUniformBigIntDistribution(from, to, nextRng), nextRng];
  }
  return function(rng2) {
    var nextRng2 = rng2.clone();
    return [unsafeUniformBigIntDistribution(from, to, nextRng2), nextRng2];
  };
};

// node_modules/pure-rand/lib/esm/distribution/UnsafeUniformIntDistribution.js
var uniformLargeIntInternal = function(from, to, rangeSize, rng) {
  var rangeSizeArrayIntValue = rangeSize <= safeNumberMaxSafeInteger ? fromNumberToArrayInt64(sharedC, rangeSize) : substractArrayInt64(sharedC, fromNumberToArrayInt64(sharedA, to), fromNumberToArrayInt64(sharedB, from));
  if (rangeSizeArrayIntValue.data[1] === 4294967295) {
    rangeSizeArrayIntValue.data[0] += 1;
    rangeSizeArrayIntValue.data[1] = 0;
  } else {
    rangeSizeArrayIntValue.data[1] += 1;
  }
  unsafeUniformArrayIntDistributionInternal(sharedData, rangeSizeArrayIntValue.data, rng);
  return sharedData[0] * 4294967296 + sharedData[1] + from;
};
function unsafeUniformIntDistribution(from, to, rng) {
  var rangeSize = to - from;
  if (rangeSize <= 4294967295) {
    var g = unsafeUniformIntDistributionInternal(rangeSize + 1, rng);
    return g + from;
  }
  return uniformLargeIntInternal(from, to, rangeSize, rng);
}
var safeNumberMaxSafeInteger = Number.MAX_SAFE_INTEGER;
var sharedA = { sign: 1, data: [0, 0] };
var sharedB = { sign: 1, data: [0, 0] };
var sharedC = { sign: 1, data: [0, 0] };
var sharedData = [0, 0];

// node_modules/pure-rand/lib/esm/distribution/UniformIntDistribution.js
var uniformIntDistribution = function(from, to, rng) {
  if (rng != null) {
    var nextRng = rng.clone();
    return [unsafeUniformIntDistribution(from, to, nextRng), nextRng];
  }
  return function(rng2) {
    var nextRng2 = rng2.clone();
    return [unsafeUniformIntDistribution(from, to, nextRng2), nextRng2];
  };
};

// node_modules/pure-rand/lib/esm/pure-rand-default.js
var __type = "module";
var __version = "6.0.4";
var __commitHash = "bcf9517d53f733a335e678fbba321780c0543b29";

// node_modules/pure-rand/lib/esm/pure-rand.js
var pure_rand_default2 = exports_pure_rand_default;

// node_modules/fast-check/lib/esm/check/runner/configuration/VerbosityLevel.js
var VerbosityLevel;
(function(VerbosityLevel2) {
  VerbosityLevel2[VerbosityLevel2["None"] = 0] = "None";
  VerbosityLevel2[VerbosityLevel2["Verbose"] = 1] = "Verbose";
  VerbosityLevel2[VerbosityLevel2["VeryVerbose"] = 2] = "VeryVerbose";
})(VerbosityLevel || (VerbosityLevel = {}));

// node_modules/fast-check/lib/esm/check/runner/configuration/QualifiedParameters.js
var safeDateNow = Date.now;
var safeMathMin = Math.min;
var safeMathRandom = Math.random;

class QualifiedParameters {
  constructor(op) {
    const p = op || {};
    this.seed = QualifiedParameters.readSeed(p);
    this.randomType = QualifiedParameters.readRandomType(p);
    this.numRuns = QualifiedParameters.readNumRuns(p);
    this.verbose = QualifiedParameters.readVerbose(p);
    this.maxSkipsPerRun = QualifiedParameters.readOrDefault(p, "maxSkipsPerRun", 100);
    this.timeout = QualifiedParameters.safeTimeout(QualifiedParameters.readOrDefault(p, "timeout", null));
    this.skipAllAfterTimeLimit = QualifiedParameters.safeTimeout(QualifiedParameters.readOrDefault(p, "skipAllAfterTimeLimit", null));
    this.interruptAfterTimeLimit = QualifiedParameters.safeTimeout(QualifiedParameters.readOrDefault(p, "interruptAfterTimeLimit", null));
    this.markInterruptAsFailure = QualifiedParameters.readBoolean(p, "markInterruptAsFailure");
    this.skipEqualValues = QualifiedParameters.readBoolean(p, "skipEqualValues");
    this.ignoreEqualValues = QualifiedParameters.readBoolean(p, "ignoreEqualValues");
    this.logger = QualifiedParameters.readOrDefault(p, "logger", (v) => {
      console.log(v);
    });
    this.path = QualifiedParameters.readOrDefault(p, "path", "");
    this.unbiased = QualifiedParameters.readBoolean(p, "unbiased");
    this.examples = QualifiedParameters.readOrDefault(p, "examples", []);
    this.endOnFailure = QualifiedParameters.readBoolean(p, "endOnFailure");
    this.reporter = QualifiedParameters.readOrDefault(p, "reporter", null);
    this.asyncReporter = QualifiedParameters.readOrDefault(p, "asyncReporter", null);
    this.errorWithCause = QualifiedParameters.readBoolean(p, "errorWithCause");
  }
  toParameters() {
    const orUndefined = (value) => value !== null ? value : undefined;
    const parameters = {
      seed: this.seed,
      randomType: this.randomType,
      numRuns: this.numRuns,
      maxSkipsPerRun: this.maxSkipsPerRun,
      timeout: orUndefined(this.timeout),
      skipAllAfterTimeLimit: orUndefined(this.skipAllAfterTimeLimit),
      interruptAfterTimeLimit: orUndefined(this.interruptAfterTimeLimit),
      markInterruptAsFailure: this.markInterruptAsFailure,
      skipEqualValues: this.skipEqualValues,
      ignoreEqualValues: this.ignoreEqualValues,
      path: this.path,
      logger: this.logger,
      unbiased: this.unbiased,
      verbose: this.verbose,
      examples: this.examples,
      endOnFailure: this.endOnFailure,
      reporter: orUndefined(this.reporter),
      asyncReporter: orUndefined(this.asyncReporter),
      errorWithCause: this.errorWithCause
    };
    return parameters;
  }
  static read(op) {
    return new QualifiedParameters(op);
  }
}
QualifiedParameters.createQualifiedRandomGenerator = (random) => {
  return (seed) => {
    const rng = random(seed);
    if (rng.unsafeJump === undefined) {
      rng.unsafeJump = () => unsafeSkipN(rng, 42);
    }
    return rng;
  };
};
QualifiedParameters.readSeed = (p) => {
  if (p.seed == null)
    return safeDateNow() ^ safeMathRandom() * 4294967296;
  const seed32 = p.seed | 0;
  if (p.seed === seed32)
    return seed32;
  const gap = p.seed - seed32;
  return seed32 ^ gap * 4294967296;
};
QualifiedParameters.readRandomType = (p) => {
  if (p.randomType == null)
    return pure_rand_default2.xorshift128plus;
  if (typeof p.randomType === "string") {
    switch (p.randomType) {
      case "mersenne":
        return QualifiedParameters.createQualifiedRandomGenerator(pure_rand_default2.mersenne);
      case "congruential":
      case "congruential32":
        return QualifiedParameters.createQualifiedRandomGenerator(pure_rand_default2.congruential32);
      case "xorshift128plus":
        return pure_rand_default2.xorshift128plus;
      case "xoroshiro128plus":
        return pure_rand_default2.xoroshiro128plus;
      default:
        throw new Error(`Invalid random specified: '${p.randomType}'`);
    }
  }
  const mrng = p.randomType(0);
  if (("min" in mrng) && mrng.min !== -2147483648) {
    throw new Error(`Invalid random number generator: min must equal -0x80000000, got ${String(mrng.min)}`);
  }
  if (("max" in mrng) && mrng.max !== 2147483647) {
    throw new Error(`Invalid random number generator: max must equal 0x7fffffff, got ${String(mrng.max)}`);
  }
  if ("unsafeJump" in mrng) {
    return p.randomType;
  }
  return QualifiedParameters.createQualifiedRandomGenerator(p.randomType);
};
QualifiedParameters.readNumRuns = (p) => {
  const defaultValue = 100;
  if (p.numRuns != null)
    return p.numRuns;
  if (p.num_runs != null)
    return p.num_runs;
  return defaultValue;
};
QualifiedParameters.readVerbose = (p) => {
  if (p.verbose == null)
    return VerbosityLevel.None;
  if (typeof p.verbose === "boolean") {
    return p.verbose === true ? VerbosityLevel.Verbose : VerbosityLevel.None;
  }
  if (p.verbose <= VerbosityLevel.None) {
    return VerbosityLevel.None;
  }
  if (p.verbose >= VerbosityLevel.VeryVerbose) {
    return VerbosityLevel.VeryVerbose;
  }
  return p.verbose | 0;
};
QualifiedParameters.readBoolean = (p, key) => p[key] === true;
QualifiedParameters.readOrDefault = (p, key, defaultValue) => {
  const value = p[key];
  return value != null ? value : defaultValue;
};
QualifiedParameters.safeTimeout = (value) => {
  if (value === null) {
    return null;
  }
  return safeMathMin(value, 2147483647);
};

// node_modules/fast-check/lib/esm/check/property/UnbiasedProperty.js
class UnbiasedProperty {
  constructor(property) {
    this.property = property;
    if (this.property.runBeforeEach !== undefined && this.property.runAfterEach !== undefined) {
      this.runBeforeEach = () => this.property.runBeforeEach();
      this.runAfterEach = () => this.property.runAfterEach();
    }
  }
  isAsync() {
    return this.property.isAsync();
  }
  generate(mrng, _runId) {
    return this.property.generate(mrng, undefined);
  }
  shrink(value) {
    return this.property.shrink(value);
  }
  run(v, dontRunHook) {
    return this.property.run(v, dontRunHook);
  }
}

// node_modules/fast-check/lib/esm/random/generator/Random.js
class Random {
  constructor(sourceRng) {
    this.internalRng = sourceRng.clone();
  }
  clone() {
    return new Random(this.internalRng);
  }
  next(bits) {
    return unsafeUniformIntDistribution(0, (1 << bits) - 1, this.internalRng);
  }
  nextBoolean() {
    return unsafeUniformIntDistribution(0, 1, this.internalRng) == 1;
  }
  nextInt(min, max) {
    return unsafeUniformIntDistribution(min == null ? Random.MIN_INT : min, max == null ? Random.MAX_INT : max, this.internalRng);
  }
  nextBigInt(min, max) {
    return unsafeUniformBigIntDistribution(min, max, this.internalRng);
  }
  nextArrayInt(min, max) {
    return unsafeUniformArrayIntDistribution(min, max, this.internalRng);
  }
  nextDouble() {
    const a = this.next(26);
    const b = this.next(27);
    return (a * Random.DBL_FACTOR + b) * Random.DBL_DIVISOR;
  }
}
Random.MIN_INT = 2147483648 | 0;
Random.MAX_INT = 2147483647 | 0;
Random.DBL_FACTOR = Math.pow(2, 27);
Random.DBL_DIVISOR = Math.pow(2, -53);

// node_modules/fast-check/lib/esm/check/runner/Tosser.js
var tossNext = function(generator, rng, index) {
  rng.unsafeJump();
  return generator.generate(new Random(rng), index);
};
function* toss(generator, seed, random, examples) {
  for (let idx = 0;idx !== examples.length; ++idx) {
    yield new Value(examples[idx], undefined);
  }
  for (let idx = 0, rng = random(seed);; ++idx) {
    yield tossNext(generator, rng, idx);
  }
}

// node_modules/fast-check/lib/esm/check/runner/utils/PathWalker.js
function pathWalk(path, initialValues, shrink) {
  let values3 = initialValues;
  const segments = path.split(":").map((text) => +text);
  if (segments.length === 0) {
    return values3;
  }
  if (!segments.every((v) => !Number.isNaN(v))) {
    throw new Error(`Unable to replay, got invalid path=${path}`);
  }
  values3 = values3.drop(segments[0]);
  for (const s of segments.slice(1)) {
    const valueToShrink = values3.getNthOrLast(0);
    if (valueToShrink == null) {
      throw new Error(`Unable to replay, got wrong path=${path}`);
    }
    values3 = shrink(valueToShrink).drop(s);
  }
  return values3;
}

// node_modules/fast-check/lib/esm/check/runner/Sampler.js
var toProperty = function(generator, qParams) {
  const prop = !Object.prototype.hasOwnProperty.call(generator, "isAsync") ? new Property(generator, () => true) : generator;
  return qParams.unbiased === true ? new UnbiasedProperty(prop) : prop;
};
var streamSample = function(generator, params) {
  const extendedParams = typeof params === "number" ? Object.assign(Object.assign({}, readConfigureGlobal()), { numRuns: params }) : Object.assign(Object.assign({}, readConfigureGlobal()), params);
  const qParams = QualifiedParameters.read(extendedParams);
  const nextProperty = toProperty(generator, qParams);
  const shrink = nextProperty.shrink.bind(nextProperty);
  const tossedValues = stream(toss(nextProperty, qParams.seed, qParams.randomType, qParams.examples));
  if (qParams.path.length === 0) {
    return tossedValues.take(qParams.numRuns).map((s) => s.value_);
  }
  return pathWalk(qParams.path, tossedValues, shrink).take(qParams.numRuns).map((s) => s.value_);
};
var sample = function(generator, params) {
  return [...streamSample(generator, params)];
};

// node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/BiasNumericRange.js
function integerLogLike(v) {
  return safeMathFloor(safeMathLog2(v) / safeMathLog2(2));
}
var biasNumericRange = function(min, max, logLike) {
  if (min === max) {
    return [{ min, max }];
  }
  if (min < 0 && max > 0) {
    const logMin = logLike(-min);
    const logMax = logLike(max);
    return [
      { min: -logMin, max: logMax },
      { min: max - logMax, max },
      { min, max: min + logMin }
    ];
  }
  const logGap = logLike(max - min);
  const arbCloseToMin = { min, max: min + logGap };
  const arbCloseToMax = { min: max - logGap, max };
  return min < 0 ? [arbCloseToMax, arbCloseToMin] : [arbCloseToMin, arbCloseToMax];
};
var safeMathFloor = Math.floor;
var safeMathLog2 = Math.log;

// node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/ShrinkInteger.js
var halvePosInteger = function(n) {
  return safeMathFloor2(n / 2);
};
var halveNegInteger = function(n) {
  return safeMathCeil(n / 2);
};
function shrinkInteger(current, target, tryTargetAsap) {
  const realGap = current - target;
  function* shrinkDecr() {
    let previous = tryTargetAsap ? undefined : target;
    const gap = tryTargetAsap ? realGap : halvePosInteger(realGap);
    for (let toremove = gap;toremove > 0; toremove = halvePosInteger(toremove)) {
      const next = toremove === realGap ? target : current - toremove;
      yield new Value(next, previous);
      previous = next;
    }
  }
  function* shrinkIncr() {
    let previous = tryTargetAsap ? undefined : target;
    const gap = tryTargetAsap ? realGap : halveNegInteger(realGap);
    for (let toremove = gap;toremove < 0; toremove = halveNegInteger(toremove)) {
      const next = toremove === realGap ? target : current - toremove;
      yield new Value(next, previous);
      previous = next;
    }
  }
  return realGap > 0 ? stream(shrinkDecr()) : stream(shrinkIncr());
}
var safeMathCeil = Math.ceil;
var safeMathFloor2 = Math.floor;

// node_modules/fast-check/lib/esm/arbitrary/_internals/IntegerArbitrary.js
var safeMathSign = Math.sign;
var safeNumberIsInteger = Number.isInteger;
var safeObjectIs = Object.is;

class IntegerArbitrary extends Arbitrary {
  constructor(min, max) {
    super();
    this.min = min;
    this.max = max;
  }
  generate(mrng, biasFactor) {
    const range = this.computeGenerateRange(mrng, biasFactor);
    return new Value(mrng.nextInt(range.min, range.max), undefined);
  }
  canShrinkWithoutContext(value) {
    return typeof value === "number" && safeNumberIsInteger(value) && !safeObjectIs(value, -0) && this.min <= value && value <= this.max;
  }
  shrink(current, context) {
    if (!IntegerArbitrary.isValidContext(current, context)) {
      const target = this.defaultTarget();
      return shrinkInteger(current, target, true);
    }
    if (this.isLastChanceTry(current, context)) {
      return Stream.of(new Value(context, undefined));
    }
    return shrinkInteger(current, context, false);
  }
  defaultTarget() {
    if (this.min <= 0 && this.max >= 0) {
      return 0;
    }
    return this.min < 0 ? this.max : this.min;
  }
  computeGenerateRange(mrng, biasFactor) {
    if (biasFactor === undefined || mrng.nextInt(1, biasFactor) !== 1) {
      return { min: this.min, max: this.max };
    }
    const ranges = biasNumericRange(this.min, this.max, integerLogLike);
    if (ranges.length === 1) {
      return ranges[0];
    }
    const id = mrng.nextInt(-2 * (ranges.length - 1), ranges.length - 2);
    return id < 0 ? ranges[0] : ranges[id + 1];
  }
  isLastChanceTry(current, context) {
    if (current > 0)
      return current === context + 1 && current > this.min;
    if (current < 0)
      return current === context - 1 && current < this.max;
    return false;
  }
  static isValidContext(current, context) {
    if (context === undefined) {
      return false;
    }
    if (typeof context !== "number") {
      throw new Error(`Invalid context type passed to IntegerArbitrary (#1)`);
    }
    if (context !== 0 && safeMathSign(current) !== safeMathSign(context)) {
      throw new Error(`Invalid context value passed to IntegerArbitrary (#2)`);
    }
    return true;
  }
}

// node_modules/fast-check/lib/esm/arbitrary/integer.js
var buildCompleteIntegerConstraints = function(constraints) {
  const min = constraints.min !== undefined ? constraints.min : -2147483648;
  const max = constraints.max !== undefined ? constraints.max : 2147483647;
  return { min, max };
};
function integer(constraints = {}) {
  const fullConstraints = buildCompleteIntegerConstraints(constraints);
  if (fullConstraints.min > fullConstraints.max) {
    throw new Error("fc.integer maximum value should be equal or greater than the minimum one");
  }
  if (!safeNumberIsInteger2(fullConstraints.min)) {
    throw new Error("fc.integer minimum value should be an integer");
  }
  if (!safeNumberIsInteger2(fullConstraints.max)) {
    throw new Error("fc.integer maximum value should be an integer");
  }
  return new IntegerArbitrary(fullConstraints.min, fullConstraints.max);
}
var safeNumberIsInteger2 = Number.isInteger;

// node_modules/fast-check/lib/esm/arbitrary/_internals/helpers/FloatHelpers.js
var bitCastFloatToUInt32 = function(f) {
  f32[0] = f;
  return u32[0];
};
function decomposeFloat(f) {
  const bits = bitCastFloatToUInt32(f);
  const signBit = bits >>> 31;
  const exponentBits = bits >>> 23 & 255;
  const significandBits = bits & 8388607;
  const exponent = exponentBits === 0 ? -126 : exponentBits - 127;
  let significand = exponentBits === 0 ? 0 : 1;
  significand += significandBits / 2 ** 23;
  significand *= signBit === 0 ? 1 : -1;
  return { exponent, significand };
}
var indexInFloatFromDecomp = function(exponent, significand) {
  if (exponent === -126) {
    return significand * 8388608;
  }
  return (exponent + 127) * 8388608 + (significand - 1) * 8388608;
};
function floatToIndex(f) {
  if (f === safePositiveInfinity) {
    return INDEX_POSITIVE_INFINITY;
  }
  if (f === safeNegativeInfinity) {
    return INDEX_NEGATIVE_INFINITY;
  }
  const decomp = decomposeFloat(f);
  const exponent = decomp.exponent;
  const significand = decomp.significand;
  if (f > 0 || f === 0 && 1 / f === safePositiveInfinity) {
    return indexInFloatFromDecomp(exponent, significand);
  } else {
    return -indexInFloatFromDecomp(exponent, -significand) - 1;
  }
}
function indexToFloat(index) {
  if (index < 0) {
    return -indexToFloat(-index - 1);
  }
  if (index === INDEX_POSITIVE_INFINITY) {
    return safePositiveInfinity;
  }
  if (index < 16777216) {
    return index * 2 ** -149;
  }
  const postIndex = index - 16777216;
  const exponent = -125 + (postIndex >> 23);
  const significand = 1 + (postIndex & 8388607) / 8388608;
  return significand * 2 ** exponent;
}
var safeNegativeInfinity = Number.NEGATIVE_INFINITY;
var safePositiveInfinity = Number.POSITIVE_INFINITY;
var MIN_VALUE_32 = 2 ** -126 * 2 ** -23;
var MAX_VALUE_32 = 2 ** 127 * (1 + (2 ** 23 - 1) / 2 ** 23);
var EPSILON_32 = 2 ** -23;
var INDEX_POSITIVE_INFINITY = 2139095040;
var INDEX_NEGATIVE_INFINITY = -2139095041;
var f32 = new Float32Array(1);
var u32 = new Uint32Array(f32.buffer, f32.byteOffset);

// node_modules/fast-check/lib/esm/arbitrary/float.js
var safeFloatToIndex = function(f, constraintsLabel) {
  const conversionTrick = "you can convert any double to a 32-bit float by using `Math.fround(myDouble)`";
  const errorMessage = "fc.float constraints." + constraintsLabel + " must be a 32-bit float - " + conversionTrick;
  if (safeNumberIsNaN(f) || safeMathFround(f) !== f) {
    throw new Error(errorMessage);
  }
  return floatToIndex(f);
};
var unmapperFloatToIndex = function(value) {
  if (typeof value !== "number")
    throw new Error("Unsupported type");
  return floatToIndex(value);
};
function float(constraints = {}) {
  const { noDefaultInfinity = false, noNaN = false, minExcluded = false, maxExcluded = false, min = noDefaultInfinity ? -MAX_VALUE_32 : safeNegativeInfinity2, max = noDefaultInfinity ? MAX_VALUE_32 : safePositiveInfinity2 } = constraints;
  const minIndexRaw = safeFloatToIndex(min, "min");
  const minIndex = minExcluded ? minIndexRaw + 1 : minIndexRaw;
  const maxIndexRaw = safeFloatToIndex(max, "max");
  const maxIndex = maxExcluded ? maxIndexRaw - 1 : maxIndexRaw;
  if (minIndex > maxIndex) {
    throw new Error("fc.float constraints.min must be smaller or equal to constraints.max");
  }
  if (noNaN) {
    return integer({ min: minIndex, max: maxIndex }).map(indexToFloat, unmapperFloatToIndex);
  }
  const minIndexWithNaN = maxIndex > 0 ? minIndex : minIndex - 1;
  const maxIndexWithNaN = maxIndex > 0 ? maxIndex + 1 : maxIndex;
  return integer({ min: minIndexWithNaN, max: maxIndexWithNaN }).map((index) => {
    if (index > maxIndex || index < minIndex)
      return safeNaN;
    else
      return indexToFloat(index);
  }, (value) => {
    if (typeof value !== "number")
      throw new Error("Unsupported type");
    if (safeNumberIsNaN(value))
      return maxIndex !== maxIndexWithNaN ? maxIndexWithNaN : minIndexWithNaN;
    return floatToIndex(value);
  });
}
var safeNumberIsNaN = Number.isNaN;
var safeMathFround = Math.fround;
var safeNegativeInfinity2 = Number.NEGATIVE_INFINITY;
var safePositiveInfinity2 = Number.POSITIVE_INFINITY;
var safeNaN = Number.NaN;

// client/fixtures/basic_components.ts
var LabeledNumberStories = {
  name: "LabeledNumber",
  component: LabeledNumber,
  stories: [
    {
      name: "Simple Labeled Number",
      attrs: {
        number: sample(float())[0]
      }
    }
  ]
};

// client/fixtures/fixtures.ts
var import_mithril2 = __toESM(require_mithril(), 1);
var ShowFixtures = {
  view({ attrs }) {
    return import_mithril2.default("div.fixtures", import_mithril2.default("h1.title", attrs.name), import_mithril2.default("div.stories", attrs.stories.map((story) => import_mithril2.default("div.story", import_mithril2.default("h3.story-name", story.name), import_mithril2.default("div.rendering", import_mithril2.default(attrs.component, story.attrs))))));
  }
};

// client/fixtures/index.ts
import_mithril3.default.mount(document.getElementById("storybook"), {
  view() {
    console.log("fixtures", values_default(exports_basic_components));
    return import_mithril3.default("div.storybook", values_default(exports_basic_components).map((fixture) => import_mithril3.default("div.fixture", import_mithril3.default(ShowFixtures, tap_default((x) => console.log(x), fixture)))));
  }
});
