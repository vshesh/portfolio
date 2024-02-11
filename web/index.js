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
      }, peg$c4 = "+", peg$c5 = peg$literalExpectation("+", false), peg$c6 = "-", peg$c7 = peg$literalExpectation("-", false), peg$c8 = function(head2, op, tail) {
        return [op, head2, tail];
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

// client/index.ts
var import_mithril5 = __toESM(require_mithril(), 1);

// client/views/views.ts
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

// node_modules/ramda/es/add.js
var add = _curry2(function add2(a, b) {
  return Number(a) + Number(b);
});
var add_default = add;

// node_modules/ramda/es/internal/_arity.js
function _arity(n, fn) {
  switch (n) {
    case 0:
      return function() {
        return fn.apply(this, arguments);
      };
    case 1:
      return function(a0) {
        return fn.apply(this, arguments);
      };
    case 2:
      return function(a0, a1) {
        return fn.apply(this, arguments);
      };
    case 3:
      return function(a0, a1, a2) {
        return fn.apply(this, arguments);
      };
    case 4:
      return function(a0, a1, a2, a3) {
        return fn.apply(this, arguments);
      };
    case 5:
      return function(a0, a1, a2, a3, a4) {
        return fn.apply(this, arguments);
      };
    case 6:
      return function(a0, a1, a2, a3, a4, a5) {
        return fn.apply(this, arguments);
      };
    case 7:
      return function(a0, a1, a2, a3, a4, a5, a6) {
        return fn.apply(this, arguments);
      };
    case 8:
      return function(a0, a1, a2, a3, a4, a5, a6, a7) {
        return fn.apply(this, arguments);
      };
    case 9:
      return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        return fn.apply(this, arguments);
      };
    case 10:
      return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
        return fn.apply(this, arguments);
      };
    default:
      throw new Error("First argument to _arity must be a non-negative integer no greater than ten");
  }
}

// node_modules/ramda/es/internal/_curryN.js
function _curryN(length, received, fn) {
  return function() {
    var combined = [];
    var argsIdx = 0;
    var left = length;
    var combinedIdx = 0;
    while (combinedIdx < received.length || argsIdx < arguments.length) {
      var result;
      if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
        result = received[combinedIdx];
      } else {
        result = arguments[argsIdx];
        argsIdx += 1;
      }
      combined[combinedIdx] = result;
      if (!_isPlaceholder(result)) {
        left -= 1;
      }
      combinedIdx += 1;
    }
    return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN(length, combined, fn));
  };
}

// node_modules/ramda/es/curryN.js
var curryN = _curry2(function curryN2(length, fn) {
  if (length === 1) {
    return _curry1(fn);
  }
  return _arity(length, _curryN(length, [], fn));
});
var curryN_default = curryN;

// node_modules/ramda/es/internal/_curry3.js
function _curry3(fn) {
  return function f3(a, b, c) {
    switch (arguments.length) {
      case 0:
        return f3;
      case 1:
        return _isPlaceholder(a) ? f3 : _curry2(function(_b, _c) {
          return fn(a, _b, _c);
        });
      case 2:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function(_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder(b) ? _curry2(function(_b, _c) {
          return fn(a, _b, _c);
        }) : _curry1(function(_c) {
          return fn(a, b, _c);
        });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function(_a, _b) {
          return fn(_a, _b, c);
        }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function(_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function(_b, _c) {
          return fn(a, _b, _c);
        }) : _isPlaceholder(a) ? _curry1(function(_a) {
          return fn(_a, b, c);
        }) : _isPlaceholder(b) ? _curry1(function(_b) {
          return fn(a, _b, c);
        }) : _isPlaceholder(c) ? _curry1(function(_c) {
          return fn(a, b, _c);
        }) : fn(a, b, c);
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

// node_modules/ramda/es/internal/_reduced.js
function _reduced(x) {
  return x && x["@@transducer/reduced"] ? x : {
    "@@transducer/value": x,
    "@@transducer/reduced": true
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

// node_modules/ramda/es/internal/_arrayFromIterator.js
function _arrayFromIterator(iter) {
  var list = [];
  var next;
  while (!(next = iter.next()).done) {
    list.push(next.value);
  }
  return list;
}

// node_modules/ramda/es/internal/_includesWith.js
function _includesWith(pred, x, list) {
  var idx = 0;
  var len = list.length;
  while (idx < len) {
    if (pred(x, list[idx])) {
      return true;
    }
    idx += 1;
  }
  return false;
}

// node_modules/ramda/es/internal/_functionName.js
function _functionName(f) {
  var match = String(f).match(/^function (\w*)/);
  return match == null ? "" : match[1];
}

// node_modules/ramda/es/internal/_has.js
function _has(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

// node_modules/ramda/es/internal/_objectIs.js
var _objectIs = function(a, b) {
  if (a === b) {
    return a !== 0 || 1 / a === 1 / b;
  } else {
    return a !== a && b !== b;
  }
};
var _objectIs_default = typeof Object.is === "function" ? Object.is : _objectIs;

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

// node_modules/ramda/es/type.js
var type = _curry1(function type2(val) {
  return val === null ? "Null" : val === undefined ? "Undefined" : Object.prototype.toString.call(val).slice(8, -1);
});
var type_default = type;

// node_modules/ramda/es/internal/_equals.js
var _uniqContentEquals = function(aIterator, bIterator, stackA, stackB) {
  var a = _arrayFromIterator(aIterator);
  var b = _arrayFromIterator(bIterator);
  function eq(_a, _b) {
    return _equals(_a, _b, stackA.slice(), stackB.slice());
  }
  return !_includesWith(function(b2, aItem) {
    return !_includesWith(eq, aItem, b2);
  }, b, a);
};
function _equals(a, b, stackA, stackB) {
  if (_objectIs_default(a, b)) {
    return true;
  }
  var typeA = type_default(a);
  if (typeA !== type_default(b)) {
    return false;
  }
  if (typeof a["fantasy-land/equals"] === "function" || typeof b["fantasy-land/equals"] === "function") {
    return typeof a["fantasy-land/equals"] === "function" && a["fantasy-land/equals"](b) && typeof b["fantasy-land/equals"] === "function" && b["fantasy-land/equals"](a);
  }
  if (typeof a.equals === "function" || typeof b.equals === "function") {
    return typeof a.equals === "function" && a.equals(b) && typeof b.equals === "function" && b.equals(a);
  }
  switch (typeA) {
    case "Arguments":
    case "Array":
    case "Object":
      if (typeof a.constructor === "function" && _functionName(a.constructor) === "Promise") {
        return a === b;
      }
      break;
    case "Boolean":
    case "Number":
    case "String":
      if (!(typeof a === typeof b && _objectIs_default(a.valueOf(), b.valueOf()))) {
        return false;
      }
      break;
    case "Date":
      if (!_objectIs_default(a.valueOf(), b.valueOf())) {
        return false;
      }
      break;
    case "Error":
      return a.name === b.name && a.message === b.message;
    case "RegExp":
      if (!(a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode)) {
        return false;
      }
      break;
  }
  var idx = stackA.length - 1;
  while (idx >= 0) {
    if (stackA[idx] === a) {
      return stackB[idx] === b;
    }
    idx -= 1;
  }
  switch (typeA) {
    case "Map":
      if (a.size !== b.size) {
        return false;
      }
      return _uniqContentEquals(a.entries(), b.entries(), stackA.concat([a]), stackB.concat([b]));
    case "Set":
      if (a.size !== b.size) {
        return false;
      }
      return _uniqContentEquals(a.values(), b.values(), stackA.concat([a]), stackB.concat([b]));
    case "Arguments":
    case "Array":
    case "Object":
    case "Boolean":
    case "Number":
    case "String":
    case "Date":
    case "Error":
    case "RegExp":
    case "Int8Array":
    case "Uint8Array":
    case "Uint8ClampedArray":
    case "Int16Array":
    case "Uint16Array":
    case "Int32Array":
    case "Uint32Array":
    case "Float32Array":
    case "Float64Array":
    case "ArrayBuffer":
      break;
    default:
      return false;
  }
  var keysA = keys_default(a);
  if (keysA.length !== keys_default(b).length) {
    return false;
  }
  var extendedStackA = stackA.concat([a]);
  var extendedStackB = stackB.concat([b]);
  idx = keysA.length - 1;
  while (idx >= 0) {
    var key = keysA[idx];
    if (!(_has(key, b) && _equals(b[key], a[key], extendedStackA, extendedStackB))) {
      return false;
    }
    idx -= 1;
  }
  return true;
}

// node_modules/ramda/es/equals.js
var equals = _curry2(function equals2(a, b) {
  return _equals(a, b, [], []);
});
var equals_default = equals;

// node_modules/ramda/es/internal/_indexOf.js
function _indexOf(list, a, idx) {
  var inf, item;
  if (typeof list.indexOf === "function") {
    switch (typeof a) {
      case "number":
        if (a === 0) {
          inf = 1 / a;
          while (idx < list.length) {
            item = list[idx];
            if (item === 0 && 1 / item === inf) {
              return idx;
            }
            idx += 1;
          }
          return -1;
        } else if (a !== a) {
          while (idx < list.length) {
            item = list[idx];
            if (typeof item === "number" && item !== item) {
              return idx;
            }
            idx += 1;
          }
          return -1;
        }
        return list.indexOf(a, idx);
      case "string":
      case "boolean":
      case "function":
      case "undefined":
        return list.indexOf(a, idx);
      case "object":
        if (a === null) {
          return list.indexOf(a, idx);
        }
    }
  }
  while (idx < list.length) {
    if (equals_default(list[idx], a)) {
      return idx;
    }
    idx += 1;
  }
  return -1;
}

// node_modules/ramda/es/internal/_includes.js
function _includes(a, list) {
  return _indexOf(list, a, 0) >= 0;
}

// node_modules/ramda/es/internal/_map.js
function _map(fn, functor) {
  var idx = 0;
  var len = functor.length;
  var result = Array(len);
  while (idx < len) {
    result[idx] = fn(functor[idx]);
    idx += 1;
  }
  return result;
}

// node_modules/ramda/es/internal/_quote.js
function _quote(s) {
  var escaped = s.replace(/\\/g, "\\\\").replace(/[\b]/g, "\\b").replace(/\f/g, "\\f").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t").replace(/\v/g, "\\v").replace(/\0/g, "\\0");
  return '"' + escaped.replace(/"/g, '\\"') + '"';
}

// node_modules/ramda/es/internal/_toISOString.js
var pad = function pad2(n) {
  return (n < 10 ? "0" : "") + n;
};
var _toISOString = typeof Date.prototype.toISOString === "function" ? function _toISOString2(d) {
  return d.toISOString();
} : function _toISOString3(d) {
  return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds()) + "." + (d.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + "Z";
};
var _toISOString_default = _toISOString;

// node_modules/ramda/es/internal/_complement.js
function _complement(f) {
  return function() {
    return !f.apply(this, arguments);
  };
}

// node_modules/ramda/es/internal/_arrayReduce.js
function _arrayReduce(reducer, acc, list) {
  var index = 0;
  var length = list.length;
  while (index < length) {
    acc = reducer(acc, list[index]);
    index += 1;
  }
  return acc;
}

// node_modules/ramda/es/internal/_filter.js
function _filter(fn, list) {
  var idx = 0;
  var len = list.length;
  var result = [];
  while (idx < len) {
    if (fn(list[idx])) {
      result[result.length] = list[idx];
    }
    idx += 1;
  }
  return result;
}

// node_modules/ramda/es/internal/_isObject.js
function _isObject(x) {
  return Object.prototype.toString.call(x) === "[object Object]";
}

// node_modules/ramda/es/internal/_xfilter.js
var XFilter = function() {
  function XFilter2(f, xf) {
    this.xf = xf;
    this.f = f;
  }
  XFilter2.prototype["@@transducer/init"] = _xfBase_default.init;
  XFilter2.prototype["@@transducer/result"] = _xfBase_default.result;
  XFilter2.prototype["@@transducer/step"] = function(result, input) {
    return this.f(input) ? this.xf["@@transducer/step"](result, input) : result;
  };
  return XFilter2;
}();
function _xfilter(f) {
  return function(xf) {
    return new XFilter(f, xf);
  };
}

// node_modules/ramda/es/filter.js
var filter = _curry2(_dispatchable(["fantasy-land/filter", "filter"], _xfilter, function(pred, filterable) {
  return _isObject(filterable) ? _arrayReduce(function(acc, key) {
    if (pred(filterable[key])) {
      acc[key] = filterable[key];
    }
    return acc;
  }, {}, keys_default(filterable)) : _filter(pred, filterable);
}));
var filter_default = filter;

// node_modules/ramda/es/reject.js
var reject = _curry2(function reject2(pred, filterable) {
  return filter_default(_complement(pred), filterable);
});
var reject_default = reject;

// node_modules/ramda/es/internal/_toString.js
function _toString(x, seen) {
  var recur = function recur(y) {
    var xs = seen.concat([x]);
    return _includes(y, xs) ? "<Circular>" : _toString(y, xs);
  };
  var mapPairs = function(obj, keys7) {
    return _map(function(k) {
      return _quote(k) + ": " + recur(obj[k]);
    }, keys7.slice().sort());
  };
  switch (Object.prototype.toString.call(x)) {
    case "[object Arguments]":
      return "(function() { return arguments; }(" + _map(recur, x).join(", ") + "))";
    case "[object Array]":
      return "[" + _map(recur, x).concat(mapPairs(x, reject_default(function(k) {
        return /^\d+$/.test(k);
      }, keys_default(x)))).join(", ") + "]";
    case "[object Boolean]":
      return typeof x === "object" ? "new Boolean(" + recur(x.valueOf()) + ")" : x.toString();
    case "[object Date]":
      return "new Date(" + (isNaN(x.valueOf()) ? recur(NaN) : _quote(_toISOString_default(x))) + ")";
    case "[object Map]":
      return "new Map(" + recur(Array.from(x)) + ")";
    case "[object Null]":
      return "null";
    case "[object Number]":
      return typeof x === "object" ? "new Number(" + recur(x.valueOf()) + ")" : 1 / x === (-Infinity) ? "-0" : x.toString(10);
    case "[object Set]":
      return "new Set(" + recur(Array.from(x).sort()) + ")";
    case "[object String]":
      return typeof x === "object" ? "new String(" + recur(x.valueOf()) + ")" : _quote(x);
    case "[object Undefined]":
      return "undefined";
    default:
      if (typeof x.toString === "function") {
        var repr = x.toString();
        if (repr !== "[object Object]") {
          return repr;
        }
      }
      return "{" + mapPairs(x, keys_default(x)).join(", ") + "}";
  }
}

// node_modules/ramda/es/toString.js
var toString2 = _curry1(function toString3(val) {
  return _toString(val, []);
});
var toString_default = toString2;

// node_modules/ramda/es/max.js
var max = _curry2(function max2(a, b) {
  if (a === b) {
    return b;
  }
  function safeMax(x, y) {
    if (x > y !== y > x) {
      return y > x ? y : x;
    }
    return;
  }
  var maxByValue = safeMax(a, b);
  if (maxByValue !== undefined) {
    return maxByValue;
  }
  var maxByType = safeMax(typeof a, typeof b);
  if (maxByType !== undefined) {
    return maxByType === typeof a ? a : b;
  }
  var stringA = toString_default(a);
  var maxByStringValue = safeMax(stringA, toString_default(b));
  if (maxByStringValue !== undefined) {
    return maxByStringValue === stringA ? a : b;
  }
  return b;
});
var max_default = max;

// node_modules/ramda/es/internal/_xmap.js
var XMap = function() {
  function XMap2(f, xf) {
    this.xf = xf;
    this.f = f;
  }
  XMap2.prototype["@@transducer/init"] = _xfBase_default.init;
  XMap2.prototype["@@transducer/result"] = _xfBase_default.result;
  XMap2.prototype["@@transducer/step"] = function(result, input) {
    return this.xf["@@transducer/step"](result, this.f(input));
  };
  return XMap2;
}();
var _xmap = function _xmap2(f) {
  return function(xf) {
    return new XMap(f, xf);
  };
};
var _xmap_default = _xmap;

// node_modules/ramda/es/map.js
var map = _curry2(_dispatchable(["fantasy-land/map", "map"], _xmap_default, function map2(fn, functor) {
  switch (Object.prototype.toString.call(functor)) {
    case "[object Function]":
      return curryN_default(functor.length, function() {
        return fn.call(this, functor.apply(this, arguments));
      });
    case "[object Object]":
      return _arrayReduce(function(acc, key) {
        acc[key] = fn(functor[key]);
        return acc;
      }, {}, keys_default(functor));
    default:
      return _map(fn, functor);
  }
}));
var map_default = map;

// node_modules/ramda/es/internal/_isInteger.js
var _isInteger_default = Number.isInteger || function _isInteger(n) {
  return n << 0 === n;
};

// node_modules/ramda/es/internal/_isString.js
function _isString(x) {
  return Object.prototype.toString.call(x) === "[object String]";
}

// node_modules/ramda/es/nth.js
var nth = _curry2(function nth2(offset, list) {
  var idx = offset < 0 ? list.length + offset : offset;
  return _isString(list) ? list.charAt(idx) : list[idx];
});
var nth_default = nth;

// node_modules/ramda/es/prop.js
var prop = _curry2(function prop2(p, obj) {
  if (obj == null) {
    return;
  }
  return _isInteger_default(p) ? nth_default(p, obj) : obj[p];
});
var prop_default = prop;

// node_modules/ramda/es/pluck.js
var pluck = _curry2(function pluck2(p, list) {
  return map_default(prop_default(p), list);
});
var pluck_default = pluck;

// node_modules/ramda/es/internal/_isArrayLike.js
var _isArrayLike = _curry1(function isArrayLike(x) {
  if (_isArray_default(x)) {
    return true;
  }
  if (!x) {
    return false;
  }
  if (typeof x !== "object") {
    return false;
  }
  if (_isString(x)) {
    return false;
  }
  if (x.length === 0) {
    return true;
  }
  if (x.length > 0) {
    return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
  }
  return false;
});
var _isArrayLike_default = _isArrayLike;

// node_modules/ramda/es/internal/_createReduce.js
var symIterator = typeof Symbol !== "undefined" ? Symbol.iterator : "@@iterator";
function _createReduce(arrayReduce, methodReduce, iterableReduce) {
  return function _reduce(xf, acc, list) {
    if (_isArrayLike_default(list)) {
      return arrayReduce(xf, acc, list);
    }
    if (list == null) {
      return acc;
    }
    if (typeof list["fantasy-land/reduce"] === "function") {
      return methodReduce(xf, acc, list, "fantasy-land/reduce");
    }
    if (list[symIterator] != null) {
      return iterableReduce(xf, acc, list[symIterator]());
    }
    if (typeof list.next === "function") {
      return iterableReduce(xf, acc, list);
    }
    if (typeof list.reduce === "function") {
      return methodReduce(xf, acc, list, "reduce");
    }
    throw new TypeError("reduce: list must be array or iterable");
  };
}

// node_modules/ramda/es/internal/_xArrayReduce.js
function _xArrayReduce(xf, acc, list) {
  var idx = 0;
  var len = list.length;
  while (idx < len) {
    acc = xf["@@transducer/step"](acc, list[idx]);
    if (acc && acc["@@transducer/reduced"]) {
      acc = acc["@@transducer/value"];
      break;
    }
    idx += 1;
  }
  return xf["@@transducer/result"](acc);
}

// node_modules/ramda/es/bind.js
var bind = _curry2(function bind2(fn, thisObj) {
  return _arity(fn.length, function() {
    return fn.apply(thisObj, arguments);
  });
});
var bind_default = bind;

// node_modules/ramda/es/internal/_xReduce.js
var _xIterableReduce = function(xf, acc, iter) {
  var step = iter.next();
  while (!step.done) {
    acc = xf["@@transducer/step"](acc, step.value);
    if (acc && acc["@@transducer/reduced"]) {
      acc = acc["@@transducer/value"];
      break;
    }
    step = iter.next();
  }
  return xf["@@transducer/result"](acc);
};
var _xMethodReduce = function(xf, acc, obj, methodName) {
  return xf["@@transducer/result"](obj[methodName](bind_default(xf["@@transducer/step"], xf), acc));
};
var _xReduce = _createReduce(_xArrayReduce, _xMethodReduce, _xIterableReduce);
var _xReduce_default = _xReduce;

// node_modules/ramda/es/internal/_xwrap.js
var XWrap = function() {
  function XWrap2(fn) {
    this.f = fn;
  }
  XWrap2.prototype["@@transducer/init"] = function() {
    throw new Error("init not implemented on XWrap");
  };
  XWrap2.prototype["@@transducer/result"] = function(acc) {
    return acc;
  };
  XWrap2.prototype["@@transducer/step"] = function(acc, x) {
    return this.f(acc, x);
  };
  return XWrap2;
}();
function _xwrap(fn) {
  return new XWrap(fn);
}

// node_modules/ramda/es/reduce.js
var reduce = _curry3(function(xf, acc, list) {
  return _xReduce_default(typeof xf === "function" ? _xwrap(xf) : xf, acc, list);
});
var reduce_default = reduce;

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

// node_modules/ramda/es/internal/_makeFlat.js
function _makeFlat(recursive) {
  return function flatt(list) {
    var value, jlen, j;
    var result = [];
    var idx = 0;
    var ilen = list.length;
    while (idx < ilen) {
      if (_isArrayLike_default(list[idx])) {
        value = recursive ? flatt(list[idx]) : list[idx];
        j = 0;
        jlen = value.length;
        while (j < jlen) {
          result[result.length] = value[j];
          j += 1;
        }
      } else {
        result[result.length] = list[idx];
      }
      idx += 1;
    }
    return result;
  };
}

// node_modules/ramda/es/internal/_forceReduced.js
function _forceReduced(x) {
  return {
    "@@transducer/value": x,
    "@@transducer/reduced": true
  };
}

// node_modules/ramda/es/internal/_flatCat.js
var tInit = "@@transducer/init";
var tStep = "@@transducer/step";
var tResult = "@@transducer/result";
var XPreservingReduced = function() {
  function XPreservingReduced2(xf) {
    this.xf = xf;
  }
  XPreservingReduced2.prototype[tInit] = _xfBase_default.init;
  XPreservingReduced2.prototype[tResult] = _xfBase_default.result;
  XPreservingReduced2.prototype[tStep] = function(result, input) {
    var ret = this.xf[tStep](result, input);
    return ret["@@transducer/reduced"] ? _forceReduced(ret) : ret;
  };
  return XPreservingReduced2;
}();
var XFlatCat = function() {
  function XFlatCat2(xf) {
    this.xf = new XPreservingReduced(xf);
  }
  XFlatCat2.prototype[tInit] = _xfBase_default.init;
  XFlatCat2.prototype[tResult] = _xfBase_default.result;
  XFlatCat2.prototype[tStep] = function(result, input) {
    return !_isArrayLike_default(input) ? _xArrayReduce(this.xf, result, [input]) : _xReduce_default(this.xf, result, input);
  };
  return XFlatCat2;
}();
var _flatCat = function _xcat(xf) {
  return new XFlatCat(xf);
};
var _flatCat_default = _flatCat;

// node_modules/ramda/es/internal/_xchain.js
function _xchain(f) {
  return function(xf) {
    return _xmap_default(f)(_flatCat_default(xf));
  };
}

// node_modules/ramda/es/chain.js
var chain = _curry2(_dispatchable(["fantasy-land/chain", "chain"], _xchain, function chain2(fn, monad) {
  if (typeof monad === "function") {
    return function(x) {
      return fn(monad(x))(x);
    };
  }
  return _makeFlat(false)(map_default(fn, monad));
}));
var chain_default = chain;
// node_modules/ramda/es/internal/_cloneRegExp.js
function _cloneRegExp(pattern) {
  return new RegExp(pattern.source, pattern.flags ? pattern.flags : (pattern.global ? "g" : "") + (pattern.ignoreCase ? "i" : "") + (pattern.multiline ? "m" : "") + (pattern.sticky ? "y" : "") + (pattern.unicode ? "u" : "") + (pattern.dotAll ? "s" : ""));
}

// node_modules/ramda/es/internal/_clone.js
var _isPrimitive = function(param) {
  var type5 = typeof param;
  return param == null || type5 != "object" && type5 != "function";
};
function _clone(value, deep, map5) {
  map5 || (map5 = new _ObjectMap);
  if (_isPrimitive(value)) {
    return value;
  }
  var copy = function copy(copiedValue) {
    var cachedCopy = map5.get(value);
    if (cachedCopy) {
      return cachedCopy;
    }
    map5.set(value, copiedValue);
    for (var key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        copiedValue[key] = deep ? _clone(value[key], true, map5) : value[key];
      }
    }
    return copiedValue;
  };
  switch (type_default(value)) {
    case "Object":
      return copy(Object.create(Object.getPrototypeOf(value)));
    case "Array":
      return copy([]);
    case "Date":
      return new Date(value.valueOf());
    case "RegExp":
      return _cloneRegExp(value);
    case "Int8Array":
    case "Uint8Array":
    case "Uint8ClampedArray":
    case "Int16Array":
    case "Uint16Array":
    case "Int32Array":
    case "Uint32Array":
    case "Float32Array":
    case "Float64Array":
    case "BigInt64Array":
    case "BigUint64Array":
      return value.slice();
    default:
      return value;
  }
}
var _ObjectMap = function() {
  function _ObjectMap2() {
    this.map = {};
    this.length = 0;
  }
  _ObjectMap2.prototype.set = function(key, value) {
    const hashedKey = this.hash(key);
    let bucket = this.map[hashedKey];
    if (!bucket) {
      this.map[hashedKey] = bucket = [];
    }
    bucket.push([key, value]);
    this.length += 1;
  };
  _ObjectMap2.prototype.hash = function(key) {
    let hashedKey = [];
    for (var value in key) {
      hashedKey.push(Object.prototype.toString.call(key[value]));
    }
    return hashedKey.join();
  };
  _ObjectMap2.prototype.get = function(key) {
    if (this.length <= 180) {
      for (const p in this.map) {
        const bucket2 = this.map[p];
        for (let i = 0;i < bucket2.length; i += 1) {
          const element = bucket2[i];
          if (element[0] === key) {
            return element[1];
          }
        }
      }
      return;
    }
    const hashedKey = this.hash(key);
    const bucket = this.map[hashedKey];
    if (!bucket) {
      return;
    }
    for (let i = 0;i < bucket.length; i += 1) {
      const element = bucket[i];
      if (element[0] === key) {
        return element[1];
      }
    }
  };
  return _ObjectMap2;
}();

// node_modules/ramda/es/clone.js
var clone = _curry1(function clone2(value) {
  return value != null && typeof value.clone === "function" ? value.clone() : _clone(value, true);
});
var clone_default = clone;
// node_modules/ramda/es/internal/_checkForMethod.js
function _checkForMethod(methodname, fn) {
  return function() {
    var length = arguments.length;
    if (length === 0) {
      return fn();
    }
    var obj = arguments[length - 1];
    return _isArray_default(obj) || typeof obj[methodname] !== "function" ? fn.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
  };
}

// node_modules/ramda/es/head.js
var head = nth_default(0);
var head_default = head;

// node_modules/ramda/es/internal/_identity.js
function _identity(x) {
  return x;
}

// node_modules/ramda/es/identity.js
var identity = _curry1(_identity);
var identity_default = identity;

// node_modules/ramda/es/internal/_Set.js
var hasOrAdd = function(item, shouldAdd, set) {
  var type5 = typeof item;
  var prevSize, newSize;
  switch (type5) {
    case "string":
    case "number":
      if (item === 0 && 1 / item === (-Infinity)) {
        if (set._items["-0"]) {
          return true;
        } else {
          if (shouldAdd) {
            set._items["-0"] = true;
          }
          return false;
        }
      }
      if (set._nativeSet !== null) {
        if (shouldAdd) {
          prevSize = set._nativeSet.size;
          set._nativeSet.add(item);
          newSize = set._nativeSet.size;
          return newSize === prevSize;
        } else {
          return set._nativeSet.has(item);
        }
      } else {
        if (!(type5 in set._items)) {
          if (shouldAdd) {
            set._items[type5] = {};
            set._items[type5][item] = true;
          }
          return false;
        } else if (item in set._items[type5]) {
          return true;
        } else {
          if (shouldAdd) {
            set._items[type5][item] = true;
          }
          return false;
        }
      }
    case "boolean":
      if (type5 in set._items) {
        var bIdx = item ? 1 : 0;
        if (set._items[type5][bIdx]) {
          return true;
        } else {
          if (shouldAdd) {
            set._items[type5][bIdx] = true;
          }
          return false;
        }
      } else {
        if (shouldAdd) {
          set._items[type5] = item ? [false, true] : [true, false];
        }
        return false;
      }
    case "function":
      if (set._nativeSet !== null) {
        if (shouldAdd) {
          prevSize = set._nativeSet.size;
          set._nativeSet.add(item);
          newSize = set._nativeSet.size;
          return newSize === prevSize;
        } else {
          return set._nativeSet.has(item);
        }
      } else {
        if (!(type5 in set._items)) {
          if (shouldAdd) {
            set._items[type5] = [item];
          }
          return false;
        }
        if (!_includes(item, set._items[type5])) {
          if (shouldAdd) {
            set._items[type5].push(item);
          }
          return false;
        }
        return true;
      }
    case "undefined":
      if (set._items[type5]) {
        return true;
      } else {
        if (shouldAdd) {
          set._items[type5] = true;
        }
        return false;
      }
    case "object":
      if (item === null) {
        if (!set._items["null"]) {
          if (shouldAdd) {
            set._items["null"] = true;
          }
          return false;
        }
        return true;
      }
    default:
      type5 = Object.prototype.toString.call(item);
      if (!(type5 in set._items)) {
        if (shouldAdd) {
          set._items[type5] = [item];
        }
        return false;
      }
      if (!_includes(item, set._items[type5])) {
        if (shouldAdd) {
          set._items[type5].push(item);
        }
        return false;
      }
      return true;
  }
};
var _Set = function() {
  function _Set2() {
    this._nativeSet = typeof Set === "function" ? new Set : null;
    this._items = {};
  }
  _Set2.prototype.add = function(item) {
    return !hasOrAdd(item, true, this);
  };
  _Set2.prototype.has = function(item) {
    return hasOrAdd(item, false, this);
  };
  return _Set2;
}();
var _Set_default = _Set;

// node_modules/ramda/es/last.js
var last = nth_default(-1);
var last_default = last;
// node_modules/ramda/es/internal/_xfindIndex.js
var XFindIndex = function() {
  function XFindIndex2(f, xf) {
    this.xf = xf;
    this.f = f;
    this.idx = -1;
    this.found = false;
  }
  XFindIndex2.prototype["@@transducer/init"] = _xfBase_default.init;
  XFindIndex2.prototype["@@transducer/result"] = function(result) {
    if (!this.found) {
      result = this.xf["@@transducer/step"](result, -1);
    }
    return this.xf["@@transducer/result"](result);
  };
  XFindIndex2.prototype["@@transducer/step"] = function(result, input) {
    this.idx += 1;
    if (this.f(input)) {
      this.found = true;
      result = _reduced(this.xf["@@transducer/step"](result, this.idx));
    }
    return result;
  };
  return XFindIndex2;
}();
function _xfindIndex(f) {
  return function(xf) {
    return new XFindIndex(f, xf);
  };
}

// node_modules/ramda/es/findIndex.js
var findIndex = _curry2(_dispatchable([], _xfindIndex, function findIndex2(fn, list) {
  var idx = 0;
  var len = list.length;
  while (idx < len) {
    if (fn(list[idx])) {
      return idx;
    }
    idx += 1;
  }
  return -1;
}));
var findIndex_default = findIndex;
// node_modules/ramda/es/fromPairs.js
var fromPairs = _curry1(function fromPairs2(pairs) {
  var result = {};
  var idx = 0;
  while (idx < pairs.length) {
    result[pairs[idx][0]] = pairs[idx][1];
    idx += 1;
  }
  return result;
});
var fromPairs_default = fromPairs;
// node_modules/ramda/es/includes.js
var includes = _curry2(_includes);
var includes_default = includes;
// node_modules/ramda/es/internal/_xuniqBy.js
var XUniqBy = function() {
  function XUniqBy2(f, xf) {
    this.xf = xf;
    this.f = f;
    this.set = new _Set_default;
  }
  XUniqBy2.prototype["@@transducer/init"] = _xfBase_default.init;
  XUniqBy2.prototype["@@transducer/result"] = _xfBase_default.result;
  XUniqBy2.prototype["@@transducer/step"] = function(result, input) {
    return this.set.add(this.f(input)) ? this.xf["@@transducer/step"](result, input) : result;
  };
  return XUniqBy2;
}();
function _xuniqBy(f) {
  return function(xf) {
    return new XUniqBy(f, xf);
  };
}

// node_modules/ramda/es/uniqBy.js
var uniqBy = _curry2(_dispatchable([], _xuniqBy, function(fn, list) {
  var set = new _Set_default;
  var result = [];
  var idx = 0;
  var appliedItem, item;
  while (idx < list.length) {
    item = list[idx];
    appliedItem = fn(item);
    if (set.add(appliedItem)) {
      result.push(item);
    }
    idx += 1;
  }
  return result;
}));
var uniqBy_default = uniqBy;

// node_modules/ramda/es/uniq.js
var uniq = uniqBy_default(identity_default);
var uniq_default = uniq;

// node_modules/ramda/es/intersperse.js
var intersperse = _curry2(_checkForMethod("intersperse", function intersperse2(separator, list) {
  var out = [];
  var idx = 0;
  var length = list.length;
  while (idx < length) {
    if (idx === length - 1) {
      out.push(list[idx]);
    } else {
      out.push(list[idx], separator);
    }
    idx += 1;
  }
  return out;
}));
var intersperse_default = intersperse;
// node_modules/ramda/es/internal/_isNumber.js
function _isNumber(x) {
  return Object.prototype.toString.call(x) === "[object Number]";
}
// node_modules/ramda/es/sum.js
var sum = reduce_default(add_default, 0);
var sum_default = sum;

// node_modules/ramda/es/mean.js
var mean = _curry1(function mean2(list) {
  return sum_default(list) / list.length;
});
var mean_default = mean;
// node_modules/ramda/es/median.js
var median = _curry1(function median2(list) {
  var len = list.length;
  if (len === 0) {
    return NaN;
  }
  var width = 2 - len % 2;
  var idx = (len - width) / 2;
  return mean_default(Array.prototype.slice.call(list, 0).sort(function(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  }).slice(idx, idx + width));
});
var median_default = median;
// node_modules/ramda/es/mergeWithKey.js
var mergeWithKey = _curry3(function mergeWithKey2(fn, l, r) {
  var result = {};
  var k;
  l = l || {};
  r = r || {};
  for (k in l) {
    if (_has(k, l)) {
      result[k] = _has(k, r) ? fn(k, l[k], r[k]) : l[k];
    }
  }
  for (k in r) {
    if (_has(k, r) && !_has(k, result)) {
      result[k] = r[k];
    }
  }
  return result;
});
var mergeWithKey_default = mergeWithKey;

// node_modules/ramda/es/mergeDeepWithKey.js
var mergeDeepWithKey = _curry3(function mergeDeepWithKey2(fn, lObj, rObj) {
  return mergeWithKey_default(function(k, lVal, rVal) {
    if (_isObject(lVal) && _isObject(rVal)) {
      return mergeDeepWithKey2(fn, lVal, rVal);
    } else {
      return fn(k, lVal, rVal);
    }
  }, lObj, rObj);
});
var mergeDeepWithKey_default = mergeDeepWithKey;

// node_modules/ramda/es/mergeDeepRight.js
var mergeDeepRight = _curry2(function mergeDeepRight2(lObj, rObj) {
  return mergeDeepWithKey_default(function(k, lVal, rVal) {
    return rVal;
  }, lObj, rObj);
});
var mergeDeepRight_default = mergeDeepRight;
// node_modules/ramda/es/range.js
var range = _curry2(function range2(from, to) {
  if (!(_isNumber(from) && _isNumber(to))) {
    throw new TypeError("Both arguments to range must be numbers");
  }
  var result = [];
  var n = from;
  while (n < to) {
    result.push(n);
    n += 1;
  }
  return result;
});
var range_default = range;
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
// client/db.ts
function map5(iterable, f) {
  const l = [];
  for (const item of iterable) {
    l.push(f(item));
  }
  return l;
}
class IndexedSet {
  objects;
  indexes;
  constructor(iterable = []) {
    this.objects = new Map;
    this.indexes = {};
    for (const item of iterable) {
      this.add(item);
    }
  }
  add(object) {
    if (!!this.objects.get(this.id(object))) {
      throw new Error(`While trying to add ${object}: Object with id ${this.id(object)} already exists in db: ${this.objects.get(this.id(object))}.`);
    }
    this.objects.set(this.id(object), object);
    map_default((i) => i.index.get(i.id(object)) ? i.index.get(i.id(object))?.add(this.id(object)) : i.index.set(i.id(object), new Set([this.id(object)])), this.indexes);
    return this;
  }
  addAll(objects) {
    for (const o of objects) {
      this.add(o);
    }
  }
  upsert(object) {
    if (!!this.objects.get(this.id(object))) {
      this.remove(object);
    }
    return this.add(object);
  }
  patch(id, value) {
    let v = mergeDeepRight_default(this.get(id), value);
    return this.upsert(v);
  }
  remove(object) {
    this.objects.delete(this.id(object));
    map_default((i) => i.index.get(i.id(object))?.delete(this.id(object)), this.indexes);
    return this;
  }
  get(arg) {
    const test = (x) => typeof x !== "object";
    if (!test(arg)) {
      if (Object.keys(arg).length === 1) {
        const name = Object.keys(arg)[0];
        if (name.toLowerCase() === "id")
          return this.get(arg[name]);
        const id = this.indexes[name].index.get(arg[name]) ?? new Set;
        return Array.from(id).map((x) => clone_default(this.objects.get(x)));
      } else {
        const { name, value } = arg;
        const id = this.indexes[name].index.get(value) ?? new Set;
        return Array.from(id).map((x) => clone_default(this.objects.get(x)));
      }
    } else {
      return clone_default(this.objects.get(arg));
    }
  }
  addIndex(id, name) {
    if (!(name ?? id.name)) {
      throw Error(`New index being added, but no valid name found. id function has name \`${id.name}\` and name is \`${name}\``);
    }
    if ((name ?? id.name).toLowerCase() === "id")
      throw Error(`Either name \`${name}\` or id function name \`${name}\` is some variant of 'id'. Do not do this.`);
    let m = new Map;
    for (let [k, v] of this.objects.entries()) {
      m.get(id(v)) ? m.get(id(v)).add(k) : m.set(id(v), new Set([k]));
    }
    this.indexes[name ?? id.name] = { id, index: m };
  }
  removeIndex(name) {
    delete this.indexes[name];
  }
  [Symbol.iterator]() {
    return this.objects.values();
  }
}

// client/model.ts
var exprparser = __toESM(require_exprparser(), 1);

// client/metalog.ts
function mq(a1, a2, a3 = 0, a4 = 0) {
  return (y) => a1 + a2 * log(y / (1 - y)) + a3 * (y - 0.5) * log(y / (1 - y)) + a4 * (y - 0.5);
}
var spt_coeffs = function({
  alpha,
  low,
  med,
  high,
  min,
  max: max3
}) {
  if (e(max3) && !e(min))
    throw Error("spt_coeffs: if you define max, need to also define min.");
  if (!e(min) && !e(max3)) {
    return [
      med,
      (high - low) / 2 / log(1 / alpha - 1),
      (high + low - 2 * med) / (1 - 2 * alpha) / log(1 / alpha - 1)
    ];
  } else if (!e(max3) && e(min)) {
    return [
      log(med - min),
      0.5 * log((high - min) / (low - min)) / log(1 / alpha - 1),
      log((high - min) * (low - min) / (med - min) ^ 2) / ((1 - 2 * alpha) * log(1 / alpha - 1))
    ];
  } else if (e(max3) && e(min)) {
    const t = (x) => (x - min) / (max3 - x);
    let a1 = log(t(med));
    let a2 = 0.5 * log(t(high) / t(low)) / log(1 / alpha - 1);
    let a3 = log(t(high) * t(low) / t(med) ^ 2) / (1 - 2 * alpha) / log(1 / alpha - 1);
    return [a1, a2, a3];
  }
  throw Error(`Must pass a valid SPT configuration. ${{ alpha, low, med, high, min, max: max3 }} doesn't qualify`);
};
function sptq({
  alpha,
  low,
  med,
  high,
  min,
  max: max3
}) {
  if (!e(min) && !e(max3)) {
    return mq(...spt_coeffs({ low, med, high, alpha }));
  } else if (!e(max3) && e(min)) {
    let [a1, a2, a3] = spt_coeffs({ alpha, low, med, high, min });
    return (y) => y === 0 ? min : min + exp(mq(a1, a2, a3)(y));
  } else if (e(max3) && e(min)) {
    let [a1, a2, a3] = spt_coeffs({ alpha, low, med, high, min, max: max3 });
    return (y) => y === 0 ? min : y === 1 ? max3 : (min + max3 * exp(mq(a1, a2, a3)(y))) / (1 + exp(mq(a1, a2, a3)(y)));
  } else {
    throw Error("sptq: if you define max, need to also define min.");
  }
}
var log = Math.log;
var exp = Math.exp;
var e = (x) => x !== undefined && x != null;

// client/model.ts
function isLeaf(a) {
  return !(a instanceof Array);
}
function branch(a) {
  const [b, ...rest] = a;
  return rest;
}
var value = function(a) {
  return a[0];
};
function* extract(branch2, pred, a) {
  if (isLeaf(a) && pred(a))
    yield a;
  if (!isLeaf(a)) {
    for (const suba of branch2(a)) {
      yield* extract(branch2, pred, suba);
    }
    if (pred(a))
      yield value(a);
  }
}
var asStatement = function(expr) {
  return expr;
};
function compute(formula, inputs) {
  if (isLeaf(formula)) {
    if (typeof formula === "string") {
      return inputs[formula] ?? (/[A-Z]+/.test(formula) ? Math[formula] : undefined);
    }
    return formula;
  }
  let f = {
    "+": (x, y) => x + y,
    "-": (x, y) => x - y,
    "*": (x, y) => x * y,
    "/": (x, y) => x / y
  }[value(formula)] ?? Math[value(formula)];
  if (type_default(f) === "Undefined")
    throw Error(`did not recognize function ${f} in ${formula}`);
  return f(...branch(formula).map((x) => compute(x, inputs)));
}
function isCertain(q) {
  return typeof q.estimate === "number";
}
var inv_q = function(q) {
  if (typeof q === "object" && Object.hasOwn(q, "estimate")) {
    return inv_q(q.estimate);
  }
  return typeof q === "number" ? (_) => q : sptq(q);
};
function makeId(name) {
  return name.replace(/\s/, "-") + "--" + (Math.random() + 1).toString(36).slice(-7);
}

class Formula {
  formulas;
  derived_vars;
  inputs;
  name;
  constructor(formula, name) {
    this.name = name ?? formula;
    this.formulas = asStatement(exprparser.parse(formula, {}));
    this.derived_vars = this.formulas.map((x) => x[1]);
    this.inputs = uniq_default(chain_default((f) => Array.from(extract(branch, (a) => isLeaf(a) && typeof a === "string" && !includes_default(a, this.derived_vars), f)), this.formulas));
  }
  compute(inputs) {
    let ii = Object.assign({}, inputs);
    for (const formula of this.formulas) {
      const value2 = compute(formula[2], ii);
      ii[formula[1]] = value2;
    }
    return ii;
  }
  formulaString() {
    return this.formulas.map((f) => {
      let formulaString = Formula.formulaToString(f[2]);
      if (formulaString.startsWith("(") && formulaString.endsWith(")")) {
        formulaString = formulaString.slice(1, -1);
      }
      return `${f[1]} = ${formulaString}`;
    }).join("\n");
  }
  static formulaToString(formula) {
    if (isLeaf(formula)) {
      return `${formula}`;
    }
    const children = formula.slice(1).map(Formula.formulaToString);
    if (!/\w+/.test(formula[0])) {
      const term = intersperse_default(formula[0], children).join(" ");
      if (formula[0] === "+" || formula[0] === "-") {
        return `(${term})`;
      }
      return term;
    } else {
      return `${formula[0]}(${intersperse_default(",", children)})`;
    }
  }
}

class Assessment {
  _model;
  inputs;
  _samples;
  constructor(formula, inputs) {
    this.inputs = inputs ?? {};
    this.model = new Formula(formula);
  }
  set(name, value2) {
    this.inputs[name] = value2;
    this.update_samples();
    console.log("new samples", mean_default(this.samples), median_default(this.samples), this.inputs, this.model);
  }
  patch(name, value2) {
    this.set(name, mergeDeepRight_default(this.inputs[name], value2));
  }
  get model() {
    return this._model;
  }
  set model(model) {
    console.log("setting model");
    this._model = model;
    this.inputs = Object.assign(fromPairs_default(this.model.inputs.map((i) => [i, {
      name: i,
      description: "",
      rationales: { low: "", high: "" },
      estimate: { alpha: 0.1, low: 0, med: 5, high: 10, min: undefined, max: undefined }
    }])), this.inputs);
    this.update_samples();
  }
  get samples() {
    return this._samples;
  }
  update_samples() {
    this._samples = pluck_default(last_default(this.model.derived_vars), this.sample(1e4)).sort((a, b) => a - b);
  }
  has_all_inputs() {
    for (let i of this.model.inputs) {
      if (!this.inputs[i]) {
        console.log(`Warning: Not all inputs are present. Need [${this.model.inputs}], have [${keys_default(this.inputs)}]`);
        return false;
      }
    }
    return true;
  }
  sample(n) {
    if (!this.has_all_inputs())
      return [];
    return range_default(0, n).map((_) => this.model.compute(map_default((x) => inv_q(x.estimate)(Math.random()), this.inputs)));
  }
  quantileF() {
    return (q) => q >= 0 && q <= 1 ? this.samples[Math.floor(q * this.samples.length)] : NaN;
  }
  quantile(n) {
    return findIndex_default((x) => x > n, this.samples) / this.samples.length;
  }
  sensitivity(around = "med") {
    if (!this.has_all_inputs())
      return [];
    const basepoint = (s) => typeof s === "number" ? 0 : { med: 0.5, low: s.alpha, high: 1 - s.alpha }[around];
    return this.model.inputs.map((i) => ({
      variable: i,
      value: tap_default((x) => x, [0.1, 0.5, 0.9].map((q) => this.model.compute(fromPairs_default(this.model.inputs.map((x) => {
        const estimate = this.inputs[x].estimate;
        const value2 = inv_q(estimate)(x === i ? q : basepoint(estimate));
        return [x, value2];
      })))[last_default(this.model.derived_vars)]))
    }));
  }
  serialize() {
    return {
      inputs: this.inputs,
      formula: this.model.formulaString()
    };
  }
  static deserialize(data) {
    return new Assessment(data.formula, data.inputs);
  }
}

class Phase {
  name;
  description;
  proof_points;
  cost;
  constructor(name, description, proof_points) {
    this.name = name;
    this.description = description || "";
    this.proof_points = proof_points ?? {};
    this.cost = new Assessment("value = devtime * devcost");
    this.cost.patch("devtime", { min: 0 });
    this.cost.patch("devcost", { min: 0 });
  }
  upsert(p) {
    this.proof_points[p.name] = p;
    return this;
  }
  create() {
    const id = makeId("untitled");
    this.proof_points[id] = {
      name: id,
      description: "",
      estimate: 1,
      rationales: { comments: "" }
    };
    return this;
  }
  chanceOfSuccess() {
    let p = 1;
    for (const pp of Object.values(this.proof_points)) {
      p *= pp.estimate;
    }
    return p;
  }
  serialize() {
    return {
      name: this.name,
      description: this.description,
      proof_points: this.proof_points,
      cost: this.cost.serialize()
    };
  }
  static deserialize(data) {
    let p = new Phase(data.name, data.description, data.proof_points);
    p.cost = Assessment.deserialize(data.cost);
    return p;
  }
}

class Roadmap {
  phases;
  constructor(phases) {
    this.phases = Array.from(phases ?? []);
  }
  chanceOfSuccess() {
    let p = 1;
    for (const phase of this.phases) {
      p *= phase.chanceOfSuccess();
    }
    return p;
  }
  serialize() {
    return { phases: this.phases.map((x) => x.serialize()) };
  }
  static deserialize(data) {
    return new Roadmap(data.phases.map(Phase.deserialize));
  }
}

class Scenario {
  id;
  name;
  description = "";
  idea;
  assessor;
  opportunity;
  roadmap;
  constructor(formula, name = "New Scenario", idea) {
    this.name = name;
    this.id = makeId(name);
    this.idea = idea;
    this.opportunity = new Assessment(formula);
    this.roadmap = new Roadmap;
  }
  serialize() {
    return {
      name: this.name,
      id: this.id,
      description: this.description,
      idea: this.idea,
      assessor: this.assessor,
      opportunity: this.opportunity.serialize(),
      roadmap: this.roadmap.serialize()
    };
  }
  static deserialize(data) {
    let s = new Scenario(data.opportunity.formula, data.name, data.idea);
    s.assessor = data.assessor;
    s.id = data.id;
    s.description = data.description;
    s.opportunity = Assessment.deserialize(data.opportunity);
    s.roadmap = Roadmap.deserialize(data.roadmap);
    return s;
  }
}

class Idea {
  name;
  description;
  proposer;
  id;
  constructor(name, description, proposer) {
    this.id = makeId(name);
    this.name = name;
    this.description = description ?? "";
    this.proposer = proposer;
  }
  serialize() {
    return map_default(identity_default, this);
  }
  static deserialize(i) {
    let idea = new Idea(i.name, i.description, i.proposer);
    idea.id = i.id;
    return idea;
  }
}

// client/views/components.ts
var import_mithril2 = __toESM(require_mithril(), 1);

// node_modules/d3-array/src/ascending.js
function ascending(a, b) {
  return a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

// node_modules/d3-array/src/descending.js
function descending(a, b) {
  return a == null || b == null ? NaN : b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}

// node_modules/d3-array/src/bisector.js
var zero = function() {
  return 0;
};
function bisector(f) {
  let compare1, compare2, delta;
  if (f.length !== 2) {
    compare1 = ascending;
    compare2 = (d, x) => ascending(f(d), x);
    delta = (d, x) => f(d) - x;
  } else {
    compare1 = f === ascending || f === descending ? f : zero;
    compare2 = f;
    delta = f;
  }
  function left(a, x, lo = 0, hi = a.length) {
    if (lo < hi) {
      if (compare1(x, x) !== 0)
        return hi;
      do {
        const mid = lo + hi >>> 1;
        if (compare2(a[mid], x) < 0)
          lo = mid + 1;
        else
          hi = mid;
      } while (lo < hi);
    }
    return lo;
  }
  function right(a, x, lo = 0, hi = a.length) {
    if (lo < hi) {
      if (compare1(x, x) !== 0)
        return hi;
      do {
        const mid = lo + hi >>> 1;
        if (compare2(a[mid], x) <= 0)
          lo = mid + 1;
        else
          hi = mid;
      } while (lo < hi);
    }
    return lo;
  }
  function center(a, x, lo = 0, hi = a.length) {
    const i = left(a, x, lo, hi - 1);
    return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
  }
  return { left, center, right };
}

// node_modules/d3-array/src/number.js
function* numbers(values3, valueof) {
  if (valueof === undefined) {
    for (let value2 of values3) {
      if (value2 != null && (value2 = +value2) >= value2) {
        yield value2;
      }
    }
  } else {
    let index = -1;
    for (let value2 of values3) {
      if ((value2 = valueof(value2, ++index, values3)) != null && (value2 = +value2) >= value2) {
        yield value2;
      }
    }
  }
}
function number(x) {
  return x === null ? NaN : +x;
}

// node_modules/d3-array/src/bisect.js
var ascendingBisect = bisector(ascending);
var bisectRight = ascendingBisect.right;
var bisectLeft = ascendingBisect.left;
var bisectCenter = bisector(number).center;
var bisect_default = bisectRight;
// node_modules/d3-array/src/count.js
function count(values3, valueof) {
  let count2 = 0;
  if (valueof === undefined) {
    for (let value2 of values3) {
      if (value2 != null && (value2 = +value2) >= value2) {
        ++count2;
      }
    }
  } else {
    let index = -1;
    for (let value2 of values3) {
      if ((value2 = valueof(value2, ++index, values3)) != null && (value2 = +value2) >= value2) {
        ++count2;
      }
    }
  }
  return count2;
}

// node_modules/d3-array/src/cross.js
var length = function(array) {
  return array.length | 0;
};
var empty = function(length2) {
  return !(length2 > 0);
};
var arrayify = function(values3) {
  return typeof values3 !== "object" || ("length" in values3) ? values3 : Array.from(values3);
};
var reducer = function(reduce3) {
  return (values3) => reduce3(...values3);
};
function cross(...values3) {
  const reduce3 = typeof values3[values3.length - 1] === "function" && reducer(values3.pop());
  values3 = values3.map(arrayify);
  const lengths = values3.map(length);
  const j = values3.length - 1;
  const index = new Array(j + 1).fill(0);
  const product = [];
  if (j < 0 || lengths.some(empty))
    return product;
  while (true) {
    product.push(index.map((j2, i2) => values3[i2][j2]));
    let i = j;
    while (++index[i] === lengths[i]) {
      if (i === 0)
        return reduce3 ? product.map(reduce3) : product;
      index[i--] = 0;
    }
  }
}
// node_modules/d3-array/src/cumsum.js
function cumsum(values3, valueof) {
  var sum3 = 0, index = 0;
  return Float64Array.from(values3, valueof === undefined ? (v) => sum3 += +v || 0 : (v) => sum3 += +valueof(v, index++, values3) || 0);
}
// node_modules/d3-array/src/variance.js
function variance(values3, valueof) {
  let count2 = 0;
  let delta;
  let mean4 = 0;
  let sum3 = 0;
  if (valueof === undefined) {
    for (let value2 of values3) {
      if (value2 != null && (value2 = +value2) >= value2) {
        delta = value2 - mean4;
        mean4 += delta / ++count2;
        sum3 += delta * (value2 - mean4);
      }
    }
  } else {
    let index = -1;
    for (let value2 of values3) {
      if ((value2 = valueof(value2, ++index, values3)) != null && (value2 = +value2) >= value2) {
        delta = value2 - mean4;
        mean4 += delta / ++count2;
        sum3 += delta * (value2 - mean4);
      }
    }
  }
  if (count2 > 1)
    return sum3 / (count2 - 1);
}

// node_modules/d3-array/src/deviation.js
function deviation(values3, valueof) {
  const v = variance(values3, valueof);
  return v ? Math.sqrt(v) : v;
}
// node_modules/d3-array/src/extent.js
function extent(values3, valueof) {
  let min;
  let max3;
  if (valueof === undefined) {
    for (const value2 of values3) {
      if (value2 != null) {
        if (min === undefined) {
          if (value2 >= value2)
            min = max3 = value2;
        } else {
          if (min > value2)
            min = value2;
          if (max3 < value2)
            max3 = value2;
        }
      }
    }
  } else {
    let index = -1;
    for (let value2 of values3) {
      if ((value2 = valueof(value2, ++index, values3)) != null) {
        if (min === undefined) {
          if (value2 >= value2)
            min = max3 = value2;
        } else {
          if (min > value2)
            min = value2;
          if (max3 < value2)
            max3 = value2;
        }
      }
    }
  }
  return [min, max3];
}
// node_modules/d3-array/src/fsum.js
class Adder {
  constructor() {
    this._partials = new Float64Array(32);
    this._n = 0;
  }
  add(x) {
    const p = this._partials;
    let i = 0;
    for (let j = 0;j < this._n && j < 32; j++) {
      const y = p[j], hi = x + y, lo = Math.abs(x) < Math.abs(y) ? x - (hi - y) : y - (hi - x);
      if (lo)
        p[i++] = lo;
      x = hi;
    }
    p[i] = x;
    this._n = i + 1;
    return this;
  }
  valueOf() {
    const p = this._partials;
    let n = this._n, x, y, lo, hi = 0;
    if (n > 0) {
      hi = p[--n];
      while (n > 0) {
        x = hi;
        y = p[--n];
        hi = x + y;
        lo = y - (hi - x);
        if (lo)
          break;
      }
      if (n > 0 && (lo < 0 && p[n - 1] < 0 || lo > 0 && p[n - 1] > 0)) {
        y = lo * 2;
        x = hi + y;
        if (y == x - hi)
          hi = x;
      }
    }
    return hi;
  }
}
// node_modules/internmap/src/index.js
var intern_get = function({ _intern, _key }, value2) {
  const key = _key(value2);
  return _intern.has(key) ? _intern.get(key) : value2;
};
var intern_set = function({ _intern, _key }, value2) {
  const key = _key(value2);
  if (_intern.has(key))
    return _intern.get(key);
  _intern.set(key, value2);
  return value2;
};
var intern_delete = function({ _intern, _key }, value2) {
  const key = _key(value2);
  if (_intern.has(key)) {
    value2 = _intern.get(key);
    _intern.delete(key);
  }
  return value2;
};
var keyof = function(value2) {
  return value2 !== null && typeof value2 === "object" ? value2.valueOf() : value2;
};

class InternMap extends Map {
  constructor(entries, key = keyof) {
    super();
    Object.defineProperties(this, { _intern: { value: new Map }, _key: { value: key } });
    if (entries != null)
      for (const [key2, value2] of entries)
        this.set(key2, value2);
  }
  get(key) {
    return super.get(intern_get(this, key));
  }
  has(key) {
    return super.has(intern_get(this, key));
  }
  set(key, value2) {
    return super.set(intern_set(this, key), value2);
  }
  delete(key) {
    return super.delete(intern_delete(this, key));
  }
}

class InternSet extends Set {
  constructor(values3, key = keyof) {
    super();
    Object.defineProperties(this, { _intern: { value: new Map }, _key: { value: key } });
    if (values3 != null)
      for (const value2 of values3)
        this.add(value2);
  }
  has(value2) {
    return super.has(intern_get(this, value2));
  }
  add(value2) {
    return super.add(intern_set(this, value2));
  }
  delete(value2) {
    return super.delete(intern_delete(this, value2));
  }
}

// node_modules/d3-array/src/identity.js
function identity3(x) {
  return x;
}

// node_modules/d3-array/src/group.js
function rollup(values3, reduce3, ...keys9) {
  return nest(values3, identity3, reduce3, keys9);
}
function rollups(values3, reduce3, ...keys9) {
  return nest(values3, Array.from, reduce3, keys9);
}
var nest = function(values3, map6, reduce3, keys9) {
  return function regroup(values4, i) {
    if (i >= keys9.length)
      return reduce3(values4);
    const groups = new InternMap;
    const keyof2 = keys9[i++];
    let index = -1;
    for (const value2 of values4) {
      const key = keyof2(value2, ++index, values4);
      const group = groups.get(key);
      if (group)
        group.push(value2);
      else
        groups.set(key, [value2]);
    }
    for (const [key, values5] of groups) {
      groups.set(key, regroup(values5, i));
    }
    return map6(groups);
  }(values3, 0);
};
function group(values3, ...keys9) {
  return nest(values3, identity3, identity3, keys9);
}
// node_modules/d3-array/src/permute.js
function permute(source, keys9) {
  return Array.from(keys9, (key) => source[key]);
}

// node_modules/d3-array/src/sort.js
function compareDefined(compare = ascending) {
  if (compare === ascending)
    return ascendingDefined;
  if (typeof compare !== "function")
    throw new TypeError("compare is not a function");
  return (a, b) => {
    const x = compare(a, b);
    if (x || x === 0)
      return x;
    return (compare(b, b) === 0) - (compare(a, a) === 0);
  };
}
function ascendingDefined(a, b) {
  return (a == null || !(a >= a)) - (b == null || !(b >= b)) || (a < b ? -1 : a > b ? 1 : 0);
}
function sort(values3, ...F) {
  if (typeof values3[Symbol.iterator] !== "function")
    throw new TypeError("values is not iterable");
  values3 = Array.from(values3);
  let [f] = F;
  if (f && f.length !== 2 || F.length > 1) {
    const index = Uint32Array.from(values3, (d, i) => i);
    if (F.length > 1) {
      F = F.map((f2) => values3.map(f2));
      index.sort((i, j) => {
        for (const f2 of F) {
          const c = ascendingDefined(f2[i], f2[j]);
          if (c)
            return c;
        }
      });
    } else {
      f = values3.map(f);
      index.sort((i, j) => ascendingDefined(f[i], f[j]));
    }
    return permute(values3, index);
  }
  return values3.sort(compareDefined(f));
}

// node_modules/d3-array/src/groupSort.js
function groupSort(values3, reduce3, key) {
  return (reduce3.length !== 2 ? sort(rollup(values3, reduce3, key), ([ak, av], [bk, bv]) => ascending(av, bv) || ascending(ak, bk)) : sort(group(values3, key), ([ak, av], [bk, bv]) => reduce3(av, bv) || ascending(ak, bk))).map(([key2]) => key2);
}
// node_modules/d3-array/src/ticks.js
var tickSpec = function(start, stop, count2) {
  const step = (stop - start) / Math.max(0, count2), power = Math.floor(Math.log10(step)), error = step / Math.pow(10, power), factor = error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1;
  let i1, i2, inc;
  if (power < 0) {
    inc = Math.pow(10, -power) / factor;
    i1 = Math.round(start * inc);
    i2 = Math.round(stop * inc);
    if (i1 / inc < start)
      ++i1;
    if (i2 / inc > stop)
      --i2;
    inc = -inc;
  } else {
    inc = Math.pow(10, power) * factor;
    i1 = Math.round(start / inc);
    i2 = Math.round(stop / inc);
    if (i1 * inc < start)
      ++i1;
    if (i2 * inc > stop)
      --i2;
  }
  if (i2 < i1 && 0.5 <= count2 && count2 < 2)
    return tickSpec(start, stop, count2 * 2);
  return [i1, i2, inc];
};
function tickIncrement(start, stop, count2) {
  stop = +stop, start = +start, count2 = +count2;
  return tickSpec(start, stop, count2)[2];
}
function tickStep(start, stop, count2) {
  stop = +stop, start = +start, count2 = +count2;
  const reverse = stop < start, inc = reverse ? tickIncrement(stop, start, count2) : tickIncrement(start, stop, count2);
  return (reverse ? -1 : 1) * (inc < 0 ? 1 / -inc : inc);
}
var e10 = Math.sqrt(50);
var e5 = Math.sqrt(10);
var e2 = Math.sqrt(2);
function ticks(start, stop, count2) {
  stop = +stop, start = +start, count2 = +count2;
  if (!(count2 > 0))
    return [];
  if (start === stop)
    return [start];
  const reverse = stop < start, [i1, i2, inc] = reverse ? tickSpec(stop, start, count2) : tickSpec(start, stop, count2);
  if (!(i2 >= i1))
    return [];
  const n = i2 - i1 + 1, ticks2 = new Array(n);
  if (reverse) {
    if (inc < 0)
      for (let i = 0;i < n; ++i)
        ticks2[i] = (i2 - i) / -inc;
    else
      for (let i = 0;i < n; ++i)
        ticks2[i] = (i2 - i) * inc;
  } else {
    if (inc < 0)
      for (let i = 0;i < n; ++i)
        ticks2[i] = (i1 + i) / -inc;
    else
      for (let i = 0;i < n; ++i)
        ticks2[i] = (i1 + i) * inc;
  }
  return ticks2;
}

// node_modules/d3-array/src/threshold/sturges.js
function thresholdSturges(values3) {
  return Math.max(1, Math.ceil(Math.log(count(values3)) / Math.LN2) + 1);
}

// node_modules/d3-array/src/max.js
function max3(values3, valueof) {
  let max4;
  if (valueof === undefined) {
    for (const value2 of values3) {
      if (value2 != null && (max4 < value2 || max4 === undefined && value2 >= value2)) {
        max4 = value2;
      }
    }
  } else {
    let index = -1;
    for (let value2 of values3) {
      if ((value2 = valueof(value2, ++index, values3)) != null && (max4 < value2 || max4 === undefined && value2 >= value2)) {
        max4 = value2;
      }
    }
  }
  return max4;
}

// node_modules/d3-array/src/maxIndex.js
function maxIndex(values3, valueof) {
  let max4;
  let maxIndex2 = -1;
  let index = -1;
  if (valueof === undefined) {
    for (const value2 of values3) {
      ++index;
      if (value2 != null && (max4 < value2 || max4 === undefined && value2 >= value2)) {
        max4 = value2, maxIndex2 = index;
      }
    }
  } else {
    for (let value2 of values3) {
      if ((value2 = valueof(value2, ++index, values3)) != null && (max4 < value2 || max4 === undefined && value2 >= value2)) {
        max4 = value2, maxIndex2 = index;
      }
    }
  }
  return maxIndex2;
}

// node_modules/d3-array/src/min.js
function min(values3, valueof) {
  let min2;
  if (valueof === undefined) {
    for (const value2 of values3) {
      if (value2 != null && (min2 > value2 || min2 === undefined && value2 >= value2)) {
        min2 = value2;
      }
    }
  } else {
    let index = -1;
    for (let value2 of values3) {
      if ((value2 = valueof(value2, ++index, values3)) != null && (min2 > value2 || min2 === undefined && value2 >= value2)) {
        min2 = value2;
      }
    }
  }
  return min2;
}

// node_modules/d3-array/src/minIndex.js
function minIndex(values3, valueof) {
  let min2;
  let minIndex2 = -1;
  let index = -1;
  if (valueof === undefined) {
    for (const value2 of values3) {
      ++index;
      if (value2 != null && (min2 > value2 || min2 === undefined && value2 >= value2)) {
        min2 = value2, minIndex2 = index;
      }
    }
  } else {
    for (let value2 of values3) {
      if ((value2 = valueof(value2, ++index, values3)) != null && (min2 > value2 || min2 === undefined && value2 >= value2)) {
        min2 = value2, minIndex2 = index;
      }
    }
  }
  return minIndex2;
}

// node_modules/d3-array/src/quickselect.js
var swap = function(array, i, j) {
  const t = array[i];
  array[i] = array[j];
  array[j] = t;
};
function quickselect(array, k, left = 0, right = Infinity, compare) {
  k = Math.floor(k);
  left = Math.floor(Math.max(0, left));
  right = Math.floor(Math.min(array.length - 1, right));
  if (!(left <= k && k <= right))
    return array;
  compare = compare === undefined ? ascendingDefined : compareDefined(compare);
  while (right > left) {
    if (right - left > 600) {
      const n = right - left + 1;
      const m = k - left + 1;
      const z = Math.log(n);
      const s = 0.5 * Math.exp(2 * z / 3);
      const sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
      const newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
      const newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
      quickselect(array, k, newLeft, newRight, compare);
    }
    const t = array[k];
    let i = left;
    let j = right;
    swap(array, left, k);
    if (compare(array[right], t) > 0)
      swap(array, left, right);
    while (i < j) {
      swap(array, i, j), ++i, --j;
      while (compare(array[i], t) < 0)
        ++i;
      while (compare(array[j], t) > 0)
        --j;
    }
    if (compare(array[left], t) === 0)
      swap(array, left, j);
    else
      ++j, swap(array, j, right);
    if (j <= k)
      left = j + 1;
    if (k <= j)
      right = j - 1;
  }
  return array;
}

// node_modules/d3-array/src/greatest.js
function greatest(values3, compare = ascending) {
  let max4;
  let defined = false;
  if (compare.length === 1) {
    let maxValue;
    for (const element of values3) {
      const value2 = compare(element);
      if (defined ? ascending(value2, maxValue) > 0 : ascending(value2, value2) === 0) {
        max4 = element;
        maxValue = value2;
        defined = true;
      }
    }
  } else {
    for (const value2 of values3) {
      if (defined ? compare(value2, max4) > 0 : compare(value2, value2) === 0) {
        max4 = value2;
        defined = true;
      }
    }
  }
  return max4;
}

// node_modules/d3-array/src/quantile.js
function quantileSorted(values3, p, valueof = number) {
  if (!(n = values3.length) || isNaN(p = +p))
    return;
  if (p <= 0 || n < 2)
    return +valueof(values3[0], 0, values3);
  if (p >= 1)
    return +valueof(values3[n - 1], n - 1, values3);
  var n, i = (n - 1) * p, i0 = Math.floor(i), value0 = +valueof(values3[i0], i0, values3), value1 = +valueof(values3[i0 + 1], i0 + 1, values3);
  return value0 + (value1 - value0) * (i - i0);
}
function quantile(values3, p, valueof) {
  values3 = Float64Array.from(numbers(values3, valueof));
  if (!(n = values3.length) || isNaN(p = +p))
    return;
  if (p <= 0 || n < 2)
    return min(values3);
  if (p >= 1)
    return max3(values3);
  var n, i = (n - 1) * p, i0 = Math.floor(i), value0 = max3(quickselect(values3, i0).subarray(0, i0 + 1)), value1 = min(values3.subarray(i0 + 1));
  return value0 + (value1 - value0) * (i - i0);
}

// node_modules/d3-array/src/threshold/freedmanDiaconis.js
function thresholdFreedmanDiaconis(values3, min3, max5) {
  const c = count(values3), d = quantile(values3, 0.75) - quantile(values3, 0.25);
  return c && d ? Math.ceil((max5 - min3) / (2 * d * Math.pow(c, -1 / 3))) : 1;
}
// node_modules/d3-array/src/threshold/scott.js
function thresholdScott(values3, min3, max5) {
  const c = count(values3), d = deviation(values3);
  return c && d ? Math.ceil((max5 - min3) * Math.cbrt(c) / (3.49 * d)) : 1;
}
// node_modules/d3-array/src/mean.js
function mean4(values3, valueof) {
  let count5 = 0;
  let sum3 = 0;
  if (valueof === undefined) {
    for (let value2 of values3) {
      if (value2 != null && (value2 = +value2) >= value2) {
        ++count5, sum3 += value2;
      }
    }
  } else {
    let index = -1;
    for (let value2 of values3) {
      if ((value2 = valueof(value2, ++index, values3)) != null && (value2 = +value2) >= value2) {
        ++count5, sum3 += value2;
      }
    }
  }
  if (count5)
    return sum3 / count5;
}
// node_modules/d3-array/src/median.js
function median3(values3, valueof) {
  return quantile(values3, 0.5, valueof);
}
// node_modules/d3-array/src/merge.js
function* flatten(arrays) {
  for (const array of arrays) {
    yield* array;
  }
}
function merge(arrays) {
  return Array.from(flatten(arrays));
}
// node_modules/d3-array/src/mode.js
function mode(values3, valueof) {
  const counts = new InternMap;
  if (valueof === undefined) {
    for (let value2 of values3) {
      if (value2 != null && value2 >= value2) {
        counts.set(value2, (counts.get(value2) || 0) + 1);
      }
    }
  } else {
    let index = -1;
    for (let value2 of values3) {
      if ((value2 = valueof(value2, ++index, values3)) != null && value2 >= value2) {
        counts.set(value2, (counts.get(value2) || 0) + 1);
      }
    }
  }
  let modeValue;
  let modeCount = 0;
  for (const [value2, count5] of counts) {
    if (count5 > modeCount) {
      modeCount = count5;
      modeValue = value2;
    }
  }
  return modeValue;
}
// node_modules/d3-array/src/pairs.js
function pair(a, b) {
  return [a, b];
}
function pairs(values3, pairof = pair) {
  const pairs2 = [];
  let previous;
  let first = false;
  for (const value2 of values3) {
    if (first)
      pairs2.push(pairof(previous, value2));
    previous = value2;
    first = true;
  }
  return pairs2;
}
// node_modules/d3-array/src/range.js
function range3(start, stop, step) {
  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;
  var i = -1, n = Math.max(0, Math.ceil((stop - start) / step)) | 0, range4 = new Array(n);
  while (++i < n) {
    range4[i] = start + i * step;
  }
  return range4;
}
// node_modules/d3-array/src/sum.js
function sum3(values3, valueof) {
  let sum4 = 0;
  if (valueof === undefined) {
    for (let value2 of values3) {
      if (value2 = +value2) {
        sum4 += value2;
      }
    }
  } else {
    let index = -1;
    for (let value2 of values3) {
      if (value2 = +valueof(value2, ++index, values3)) {
        sum4 += value2;
      }
    }
  }
  return sum4;
}
// node_modules/d3-array/src/reverse.js
function reverse(values3) {
  if (typeof values3[Symbol.iterator] !== "function")
    throw new TypeError("values is not iterable");
  return Array.from(values3).reverse();
}
// node_modules/d3-axis/src/identity.js
function identity_default2(x) {
  return x;
}

// node_modules/d3-axis/src/axis.js
var translateX = function(x) {
  return "translate(" + x + ",0)";
};
var translateY = function(y) {
  return "translate(0," + y + ")";
};
var number4 = function(scale) {
  return (d) => +scale(d);
};
var center = function(scale, offset) {
  offset = Math.max(0, scale.bandwidth() - offset * 2) / 2;
  if (scale.round())
    offset = Math.round(offset);
  return (d) => +scale(d) + offset;
};
var entering = function() {
  return !this.__axis;
};
var axis = function(orient, scale) {
  var tickArguments = [], tickValues = null, tickFormat = null, tickSizeInner = 6, tickSizeOuter = 6, tickPadding = 3, offset = typeof window !== "undefined" && window.devicePixelRatio > 1 ? 0 : 0.5, k = orient === top || orient === left ? -1 : 1, x = orient === left || orient === right ? "x" : "y", transform = orient === top || orient === bottom ? translateX : translateY;
  function axis2(context) {
    var values3 = tickValues == null ? scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain() : tickValues, format = tickFormat == null ? scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity_default2 : tickFormat, spacing = Math.max(tickSizeInner, 0) + tickPadding, range4 = scale.range(), range0 = +range4[0] + offset, range1 = +range4[range4.length - 1] + offset, position = (scale.bandwidth ? center : number4)(scale.copy(), offset), selection = context.selection ? context.selection() : context, path = selection.selectAll(".domain").data([null]), tick = selection.selectAll(".tick").data(values3, scale).order(), tickExit = tick.exit(), tickEnter = tick.enter().append("g").attr("class", "tick"), line = tick.select("line"), text = tick.select("text");
    path = path.merge(path.enter().insert("path", ".tick").attr("class", "domain").attr("stroke", "currentColor"));
    tick = tick.merge(tickEnter);
    line = line.merge(tickEnter.append("line").attr("stroke", "currentColor").attr(x + "2", k * tickSizeInner));
    text = text.merge(tickEnter.append("text").attr("fill", "currentColor").attr(x, k * spacing).attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));
    if (context !== selection) {
      path = path.transition(context);
      tick = tick.transition(context);
      line = line.transition(context);
      text = text.transition(context);
      tickExit = tickExit.transition(context).attr("opacity", epsilon).attr("transform", function(d) {
        return isFinite(d = position(d)) ? transform(d + offset) : this.getAttribute("transform");
      });
      tickEnter.attr("opacity", epsilon).attr("transform", function(d) {
        var p = this.parentNode.__axis;
        return transform((p && isFinite(p = p(d)) ? p : position(d)) + offset);
      });
    }
    tickExit.remove();
    path.attr("d", orient === left || orient === right ? tickSizeOuter ? "M" + k * tickSizeOuter + "," + range0 + "H" + offset + "V" + range1 + "H" + k * tickSizeOuter : "M" + offset + "," + range0 + "V" + range1 : tickSizeOuter ? "M" + range0 + "," + k * tickSizeOuter + "V" + offset + "H" + range1 + "V" + k * tickSizeOuter : "M" + range0 + "," + offset + "H" + range1);
    tick.attr("opacity", 1).attr("transform", function(d) {
      return transform(position(d) + offset);
    });
    line.attr(x + "2", k * tickSizeInner);
    text.attr(x, k * spacing).text(format);
    selection.filter(entering).attr("fill", "none").attr("font-size", 10).attr("font-family", "sans-serif").attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");
    selection.each(function() {
      this.__axis = position;
    });
  }
  axis2.scale = function(_) {
    return arguments.length ? (scale = _, axis2) : scale;
  };
  axis2.ticks = function() {
    return tickArguments = Array.from(arguments), axis2;
  };
  axis2.tickArguments = function(_) {
    return arguments.length ? (tickArguments = _ == null ? [] : Array.from(_), axis2) : tickArguments.slice();
  };
  axis2.tickValues = function(_) {
    return arguments.length ? (tickValues = _ == null ? null : Array.from(_), axis2) : tickValues && tickValues.slice();
  };
  axis2.tickFormat = function(_) {
    return arguments.length ? (tickFormat = _, axis2) : tickFormat;
  };
  axis2.tickSize = function(_) {
    return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis2) : tickSizeInner;
  };
  axis2.tickSizeInner = function(_) {
    return arguments.length ? (tickSizeInner = +_, axis2) : tickSizeInner;
  };
  axis2.tickSizeOuter = function(_) {
    return arguments.length ? (tickSizeOuter = +_, axis2) : tickSizeOuter;
  };
  axis2.tickPadding = function(_) {
    return arguments.length ? (tickPadding = +_, axis2) : tickPadding;
  };
  axis2.offset = function(_) {
    return arguments.length ? (offset = +_, axis2) : offset;
  };
  return axis2;
};
function axisBottom(scale) {
  return axis(bottom, scale);
}
var top = 1;
var right = 2;
var bottom = 3;
var left = 4;
var epsilon = 0.000001;
// node_modules/d3-dispatch/src/dispatch.js
var dispatch = function() {
  for (var i = 0, n = arguments.length, _ = {}, t;i < n; ++i) {
    if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t))
      throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
};
var Dispatch = function(_) {
  this._ = _;
};
var parseTypenames = function(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0)
      name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t))
      throw new Error("unknown type: " + t);
    return { type: t, name };
  });
};
var get = function(type5, name) {
  for (var i = 0, n = type5.length, c;i < n; ++i) {
    if ((c = type5[i]).name === name) {
      return c.value;
    }
  }
};
var set = function(type5, name, callback) {
  for (var i = 0, n = type5.length;i < n; ++i) {
    if (type5[i].name === name) {
      type5[i] = noop, type5 = type5.slice(0, i).concat(type5.slice(i + 1));
      break;
    }
  }
  if (callback != null)
    type5.push({ name, value: callback });
  return type5;
};
var noop = { value: () => {
} };
Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._, T = parseTypenames(typename + "", _), t, i = -1, n = T.length;
    if (arguments.length < 2) {
      while (++i < n)
        if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name)))
          return t;
      return;
    }
    if (callback != null && typeof callback !== "function")
      throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type)
        _[t] = set(_[t], typename.name, callback);
      else if (callback == null)
        for (t in _)
          _[t] = set(_[t], typename.name, null);
    }
    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t in _)
      copy[t] = _[t].slice();
    return new Dispatch(copy);
  },
  call: function(type5, that) {
    if ((n = arguments.length - 2) > 0)
      for (var args = new Array(n), i = 0, n, t;i < n; ++i)
        args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type5))
      throw new Error("unknown type: " + type5);
    for (t = this._[type5], i = 0, n = t.length;i < n; ++i)
      t[i].value.apply(that, args);
  },
  apply: function(type5, that, args) {
    if (!this._.hasOwnProperty(type5))
      throw new Error("unknown type: " + type5);
    for (var t = this._[type5], i = 0, n = t.length;i < n; ++i)
      t[i].value.apply(that, args);
  }
};
var dispatch_default = dispatch;
// node_modules/d3-selection/src/namespaces.js
var xhtml = "http://www.w3.org/1999/xhtml";
var namespaces_default = {
  svg: "http://www.w3.org/2000/svg",
  xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

// node_modules/d3-selection/src/namespace.js
function namespace_default(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns")
    name = name.slice(i + 1);
  return namespaces_default.hasOwnProperty(prefix) ? { space: namespaces_default[prefix], local: name } : name;
}

// node_modules/d3-selection/src/creator.js
var creatorInherit = function(name) {
  return function() {
    var document2 = this.ownerDocument, uri = this.namespaceURI;
    return uri === xhtml && document2.documentElement.namespaceURI === xhtml ? document2.createElement(name) : document2.createElementNS(uri, name);
  };
};
var creatorFixed = function(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
};
function creator_default(name) {
  var fullname = namespace_default(name);
  return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}

// node_modules/d3-selection/src/selector.js
var none = function() {
};
function selector_default(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}

// node_modules/d3-selection/src/selection/select.js
function select_default(select) {
  if (typeof select !== "function")
    select = selector_default(select);
  for (var groups2 = this._groups, m = groups2.length, subgroups = new Array(m), j = 0;j < m; ++j) {
    for (var group3 = groups2[j], n = group3.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0;i < n; ++i) {
      if ((node = group3[i]) && (subnode = select.call(node, node.__data__, i, group3))) {
        if ("__data__" in node)
          subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }
  return new Selection(subgroups, this._parents);
}

// node_modules/d3-selection/src/array.js
function array(x) {
  return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
}

// node_modules/d3-selection/src/selectorAll.js
var empty2 = function() {
  return [];
};
function selectorAll_default(selector2) {
  return selector2 == null ? empty2 : function() {
    return this.querySelectorAll(selector2);
  };
}

// node_modules/d3-selection/src/selection/selectAll.js
var arrayAll = function(select) {
  return function() {
    return array(select.apply(this, arguments));
  };
};
function selectAll_default(select) {
  if (typeof select === "function")
    select = arrayAll(select);
  else
    select = selectorAll_default(select);
  for (var groups2 = this._groups, m = groups2.length, subgroups = [], parents = [], j = 0;j < m; ++j) {
    for (var group3 = groups2[j], n = group3.length, node, i = 0;i < n; ++i) {
      if (node = group3[i]) {
        subgroups.push(select.call(node, node.__data__, i, group3));
        parents.push(node);
      }
    }
  }
  return new Selection(subgroups, parents);
}

// node_modules/d3-selection/src/matcher.js
function childMatcher(selector2) {
  return function(node) {
    return node.matches(selector2);
  };
}
function matcher_default(selector2) {
  return function() {
    return this.matches(selector2);
  };
}

// node_modules/d3-selection/src/selection/selectChild.js
var childFind = function(match) {
  return function() {
    return find.call(this.children, match);
  };
};
var childFirst = function() {
  return this.firstElementChild;
};
var find = Array.prototype.find;
function selectChild_default(match) {
  return this.select(match == null ? childFirst : childFind(typeof match === "function" ? match : childMatcher(match)));
}

// node_modules/d3-selection/src/selection/selectChildren.js
var children = function() {
  return Array.from(this.children);
};
var childrenFilter = function(match) {
  return function() {
    return filter3.call(this.children, match);
  };
};
var filter3 = Array.prototype.filter;
function selectChildren_default(match) {
  return this.selectAll(match == null ? children : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
}

// node_modules/d3-selection/src/selection/filter.js
function filter_default2(match) {
  if (typeof match !== "function")
    match = matcher_default(match);
  for (var groups2 = this._groups, m = groups2.length, subgroups = new Array(m), j = 0;j < m; ++j) {
    for (var group3 = groups2[j], n = group3.length, subgroup = subgroups[j] = [], node, i = 0;i < n; ++i) {
      if ((node = group3[i]) && match.call(node, node.__data__, i, group3)) {
        subgroup.push(node);
      }
    }
  }
  return new Selection(subgroups, this._parents);
}

// node_modules/d3-selection/src/selection/sparse.js
function sparse_default(update) {
  return new Array(update.length);
}

// node_modules/d3-selection/src/selection/enter.js
function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}
function enter_default() {
  return new Selection(this._enter || this._groups.map(sparse_default), this._parents);
}
EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) {
    return this._parent.insertBefore(child, this._next);
  },
  insertBefore: function(child, next) {
    return this._parent.insertBefore(child, next);
  },
  querySelector: function(selector2) {
    return this._parent.querySelector(selector2);
  },
  querySelectorAll: function(selector2) {
    return this._parent.querySelectorAll(selector2);
  }
};

// node_modules/d3-selection/src/constant.js
function constant_default(x) {
  return function() {
    return x;
  };
}

// node_modules/d3-selection/src/selection/data.js
var bindIndex = function(parent, group3, enter2, update, exit, data) {
  var i = 0, node, groupLength = group3.length, dataLength = data.length;
  for (;i < dataLength; ++i) {
    if (node = group3[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter2[i] = new EnterNode(parent, data[i]);
    }
  }
  for (;i < groupLength; ++i) {
    if (node = group3[i]) {
      exit[i] = node;
    }
  }
};
var bindKey = function(parent, group3, enter2, update, exit, data, key) {
  var i, node, nodeByKeyValue = new Map, groupLength = group3.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
  for (i = 0;i < groupLength; ++i) {
    if (node = group3[i]) {
      keyValues[i] = keyValue = key.call(node, node.__data__, i, group3) + "";
      if (nodeByKeyValue.has(keyValue)) {
        exit[i] = node;
      } else {
        nodeByKeyValue.set(keyValue, node);
      }
    }
  }
  for (i = 0;i < dataLength; ++i) {
    keyValue = key.call(parent, data[i], i, data) + "";
    if (node = nodeByKeyValue.get(keyValue)) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue.delete(keyValue);
    } else {
      enter2[i] = new EnterNode(parent, data[i]);
    }
  }
  for (i = 0;i < groupLength; ++i) {
    if ((node = group3[i]) && nodeByKeyValue.get(keyValues[i]) === node) {
      exit[i] = node;
    }
  }
};
var datum = function(node) {
  return node.__data__;
};
var arraylike = function(data) {
  return typeof data === "object" && ("length" in data) ? data : Array.from(data);
};
function data_default(value2, key) {
  if (!arguments.length)
    return Array.from(this, datum);
  var bind4 = key ? bindKey : bindIndex, parents = this._parents, groups2 = this._groups;
  if (typeof value2 !== "function")
    value2 = constant_default(value2);
  for (var m = groups2.length, update = new Array(m), enter2 = new Array(m), exit = new Array(m), j = 0;j < m; ++j) {
    var parent = parents[j], group3 = groups2[j], groupLength = group3.length, data = arraylike(value2.call(parent, parent && parent.__data__, j, parents)), dataLength = data.length, enterGroup = enter2[j] = new Array(dataLength), updateGroup = update[j] = new Array(dataLength), exitGroup = exit[j] = new Array(groupLength);
    bind4(parent, group3, enterGroup, updateGroup, exitGroup, data, key);
    for (var i0 = 0, i1 = 0, previous, next;i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1)
          i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength)
          ;
        previous._next = next || null;
      }
    }
  }
  update = new Selection(update, parents);
  update._enter = enter2;
  update._exit = exit;
  return update;
}

// node_modules/d3-selection/src/selection/exit.js
function exit_default() {
  return new Selection(this._exit || this._groups.map(sparse_default), this._parents);
}

// node_modules/d3-selection/src/selection/join.js
function join_default(onenter, onupdate, onexit) {
  var enter2 = this.enter(), update = this, exit = this.exit();
  if (typeof onenter === "function") {
    enter2 = onenter(enter2);
    if (enter2)
      enter2 = enter2.selection();
  } else {
    enter2 = enter2.append(onenter + "");
  }
  if (onupdate != null) {
    update = onupdate(update);
    if (update)
      update = update.selection();
  }
  if (onexit == null)
    exit.remove();
  else
    onexit(exit);
  return enter2 && update ? enter2.merge(update).order() : update;
}

// node_modules/d3-selection/src/selection/merge.js
function merge_default(context) {
  var selection = context.selection ? context.selection() : context;
  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0;j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge2 = merges[j] = new Array(n), node, i = 0;i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge2[i] = node;
      }
    }
  }
  for (;j < m0; ++j) {
    merges[j] = groups0[j];
  }
  return new Selection(merges, this._parents);
}

// node_modules/d3-selection/src/selection/order.js
function order_default() {
  for (var groups2 = this._groups, j = -1, m = groups2.length;++j < m; ) {
    for (var group3 = groups2[j], i = group3.length - 1, next = group3[i], node;--i >= 0; ) {
      if (node = group3[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4)
          next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }
  return this;
}

// node_modules/d3-selection/src/selection/sort.js
var ascending7 = function(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
};
function sort_default(compare) {
  if (!compare)
    compare = ascending7;
  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }
  for (var groups2 = this._groups, m = groups2.length, sortgroups = new Array(m), j = 0;j < m; ++j) {
    for (var group3 = groups2[j], n = group3.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0;i < n; ++i) {
      if (node = group3[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }
  return new Selection(sortgroups, this._parents).order();
}

// node_modules/d3-selection/src/selection/call.js
function call_default() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}

// node_modules/d3-selection/src/selection/nodes.js
function nodes_default() {
  return Array.from(this);
}

// node_modules/d3-selection/src/selection/node.js
function node_default() {
  for (var groups2 = this._groups, j = 0, m = groups2.length;j < m; ++j) {
    for (var group3 = groups2[j], i = 0, n = group3.length;i < n; ++i) {
      var node = group3[i];
      if (node)
        return node;
    }
  }
  return null;
}

// node_modules/d3-selection/src/selection/size.js
function size_default() {
  let size = 0;
  for (const node of this)
    ++size;
  return size;
}

// node_modules/d3-selection/src/selection/empty.js
function empty_default() {
  return !this.node();
}

// node_modules/d3-selection/src/selection/each.js
function each_default(callback) {
  for (var groups2 = this._groups, j = 0, m = groups2.length;j < m; ++j) {
    for (var group3 = groups2[j], i = 0, n = group3.length, node;i < n; ++i) {
      if (node = group3[i])
        callback.call(node, node.__data__, i, group3);
    }
  }
  return this;
}

// node_modules/d3-selection/src/selection/attr.js
var attrRemove = function(name) {
  return function() {
    this.removeAttribute(name);
  };
};
var attrRemoveNS = function(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
};
var attrConstant = function(name, value2) {
  return function() {
    this.setAttribute(name, value2);
  };
};
var attrConstantNS = function(fullname, value2) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value2);
  };
};
var attrFunction = function(name, value2) {
  return function() {
    var v = value2.apply(this, arguments);
    if (v == null)
      this.removeAttribute(name);
    else
      this.setAttribute(name, v);
  };
};
var attrFunctionNS = function(fullname, value2) {
  return function() {
    var v = value2.apply(this, arguments);
    if (v == null)
      this.removeAttributeNS(fullname.space, fullname.local);
    else
      this.setAttributeNS(fullname.space, fullname.local, v);
  };
};
function attr_default(name, value2) {
  var fullname = namespace_default(name);
  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
  }
  return this.each((value2 == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value2 === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value2));
}

// node_modules/d3-selection/src/window.js
function window_default(node) {
  return node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView;
}

// node_modules/d3-selection/src/selection/style.js
var styleRemove = function(name) {
  return function() {
    this.style.removeProperty(name);
  };
};
var styleConstant = function(name, value2, priority) {
  return function() {
    this.style.setProperty(name, value2, priority);
  };
};
var styleFunction = function(name, value2, priority) {
  return function() {
    var v = value2.apply(this, arguments);
    if (v == null)
      this.style.removeProperty(name);
    else
      this.style.setProperty(name, v, priority);
  };
};
function styleValue(node, name) {
  return node.style.getPropertyValue(name) || window_default(node).getComputedStyle(node, null).getPropertyValue(name);
}
function style_default(name, value2, priority) {
  return arguments.length > 1 ? this.each((value2 == null ? styleRemove : typeof value2 === "function" ? styleFunction : styleConstant)(name, value2, priority == null ? "" : priority)) : styleValue(this.node(), name);
}

// node_modules/d3-selection/src/selection/property.js
var propertyRemove = function(name) {
  return function() {
    delete this[name];
  };
};
var propertyConstant = function(name, value2) {
  return function() {
    this[name] = value2;
  };
};
var propertyFunction = function(name, value2) {
  return function() {
    var v = value2.apply(this, arguments);
    if (v == null)
      delete this[name];
    else
      this[name] = v;
  };
};
function property_default(name, value2) {
  return arguments.length > 1 ? this.each((value2 == null ? propertyRemove : typeof value2 === "function" ? propertyFunction : propertyConstant)(name, value2)) : this.node()[name];
}

// node_modules/d3-selection/src/selection/classed.js
var classArray = function(string) {
  return string.trim().split(/^|\s+/);
};
var classList = function(node) {
  return node.classList || new ClassList(node);
};
var ClassList = function(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
};
var classedAdd = function(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n)
    list.add(names[i]);
};
var classedRemove = function(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n)
    list.remove(names[i]);
};
var classedTrue = function(names) {
  return function() {
    classedAdd(this, names);
  };
};
var classedFalse = function(names) {
  return function() {
    classedRemove(this, names);
  };
};
var classedFunction = function(names, value2) {
  return function() {
    (value2.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
};
ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};
function classed_default(name, value2) {
  var names = classArray(name + "");
  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n)
      if (!list.contains(names[i]))
        return false;
    return true;
  }
  return this.each((typeof value2 === "function" ? classedFunction : value2 ? classedTrue : classedFalse)(names, value2));
}

// node_modules/d3-selection/src/selection/text.js
var textRemove = function() {
  this.textContent = "";
};
var textConstant = function(value2) {
  return function() {
    this.textContent = value2;
  };
};
var textFunction = function(value2) {
  return function() {
    var v = value2.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
};
function text_default(value2) {
  return arguments.length ? this.each(value2 == null ? textRemove : (typeof value2 === "function" ? textFunction : textConstant)(value2)) : this.node().textContent;
}

// node_modules/d3-selection/src/selection/html.js
var htmlRemove = function() {
  this.innerHTML = "";
};
var htmlConstant = function(value2) {
  return function() {
    this.innerHTML = value2;
  };
};
var htmlFunction = function(value2) {
  return function() {
    var v = value2.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
};
function html_default(value2) {
  return arguments.length ? this.each(value2 == null ? htmlRemove : (typeof value2 === "function" ? htmlFunction : htmlConstant)(value2)) : this.node().innerHTML;
}

// node_modules/d3-selection/src/selection/raise.js
var raise = function() {
  if (this.nextSibling)
    this.parentNode.appendChild(this);
};
function raise_default() {
  return this.each(raise);
}

// node_modules/d3-selection/src/selection/lower.js
var lower = function() {
  if (this.previousSibling)
    this.parentNode.insertBefore(this, this.parentNode.firstChild);
};
function lower_default() {
  return this.each(lower);
}

// node_modules/d3-selection/src/selection/append.js
function append_default(name) {
  var create = typeof name === "function" ? name : creator_default(name);
  return this.select(function() {
    return this.appendChild(create.apply(this, arguments));
  });
}

// node_modules/d3-selection/src/selection/insert.js
var constantNull = function() {
  return null;
};
function insert_default(name, before) {
  var create = typeof name === "function" ? name : creator_default(name), select = before == null ? constantNull : typeof before === "function" ? before : selector_default(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

// node_modules/d3-selection/src/selection/remove.js
var remove = function() {
  var parent = this.parentNode;
  if (parent)
    parent.removeChild(this);
};
function remove_default() {
  return this.each(remove);
}

// node_modules/d3-selection/src/selection/clone.js
var selection_cloneShallow = function() {
  var clone3 = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone3, this.nextSibling) : clone3;
};
var selection_cloneDeep = function() {
  var clone3 = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone3, this.nextSibling) : clone3;
};
function clone_default2(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

// node_modules/d3-selection/src/selection/datum.js
function datum_default(value2) {
  return arguments.length ? this.property("__data__", value2) : this.node().__data__;
}

// node_modules/d3-selection/src/selection/on.js
var contextListener = function(listener) {
  return function(event) {
    listener.call(this, event, this.__data__);
  };
};
var parseTypenames2 = function(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0)
      name = t.slice(i + 1), t = t.slice(0, i);
    return { type: t, name };
  });
};
var onRemove = function(typename) {
  return function() {
    var on = this.__on;
    if (!on)
      return;
    for (var j = 0, i = -1, m = on.length, o;j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
      } else {
        on[++i] = o;
      }
    }
    if (++i)
      on.length = i;
    else
      delete this.__on;
  };
};
var onAdd = function(typename, value2, options) {
  return function() {
    var on = this.__on, o, listener = contextListener(value2);
    if (on)
      for (var j = 0, m = on.length;j < m; ++j) {
        if ((o = on[j]).type === typename.type && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
          this.addEventListener(o.type, o.listener = listener, o.options = options);
          o.value = value2;
          return;
        }
      }
    this.addEventListener(typename.type, listener, options);
    o = { type: typename.type, name: typename.name, value: value2, listener, options };
    if (!on)
      this.__on = [o];
    else
      on.push(o);
  };
};
function on_default(typename, value2, options) {
  var typenames = parseTypenames2(typename + ""), i, n = typenames.length, t;
  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on)
      for (var j = 0, m = on.length, o;j < m; ++j) {
        for (i = 0, o = on[j];i < n; ++i) {
          if ((t = typenames[i]).type === o.type && t.name === o.name) {
            return o.value;
          }
        }
      }
    return;
  }
  on = value2 ? onAdd : onRemove;
  for (i = 0;i < n; ++i)
    this.each(on(typenames[i], value2, options));
  return this;
}

// node_modules/d3-selection/src/selection/dispatch.js
var dispatchEvent = function(node, type5, params) {
  var window4 = window_default(node), event = window4.CustomEvent;
  if (typeof event === "function") {
    event = new event(type5, params);
  } else {
    event = window4.document.createEvent("Event");
    if (params)
      event.initEvent(type5, params.bubbles, params.cancelable), event.detail = params.detail;
    else
      event.initEvent(type5, false, false);
  }
  node.dispatchEvent(event);
};
var dispatchConstant = function(type5, params) {
  return function() {
    return dispatchEvent(this, type5, params);
  };
};
var dispatchFunction = function(type5, params) {
  return function() {
    return dispatchEvent(this, type5, params.apply(this, arguments));
  };
};
function dispatch_default2(type5, params) {
  return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type5, params));
}

// node_modules/d3-selection/src/selection/iterator.js
function* iterator_default() {
  for (var groups2 = this._groups, j = 0, m = groups2.length;j < m; ++j) {
    for (var group3 = groups2[j], i = 0, n = group3.length, node;i < n; ++i) {
      if (node = group3[i])
        yield node;
    }
  }
}

// node_modules/d3-selection/src/selection/index.js
function Selection(groups2, parents) {
  this._groups = groups2;
  this._parents = parents;
}
var selection = function() {
  return new Selection([[document.documentElement]], root);
};
var selection_selection = function() {
  return this;
};
var root = [null];
Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: select_default,
  selectAll: selectAll_default,
  selectChild: selectChild_default,
  selectChildren: selectChildren_default,
  filter: filter_default2,
  data: data_default,
  enter: enter_default,
  exit: exit_default,
  join: join_default,
  merge: merge_default,
  selection: selection_selection,
  order: order_default,
  sort: sort_default,
  call: call_default,
  nodes: nodes_default,
  node: node_default,
  size: size_default,
  empty: empty_default,
  each: each_default,
  attr: attr_default,
  style: style_default,
  property: property_default,
  classed: classed_default,
  text: text_default,
  html: html_default,
  raise: raise_default,
  lower: lower_default,
  append: append_default,
  insert: insert_default,
  remove: remove_default,
  clone: clone_default2,
  datum: datum_default,
  on: on_default,
  dispatch: dispatch_default2,
  [Symbol.iterator]: iterator_default
};
var selection_default = selection;

// node_modules/d3-selection/src/select.js
function select_default2(selector3) {
  return typeof selector3 === "string" ? new Selection([[document.querySelector(selector3)]], [document.documentElement]) : new Selection([[selector3]], root);
}
// node_modules/d3-selection/src/sourceEvent.js
function sourceEvent_default(event) {
  let sourceEvent;
  while (sourceEvent = event.sourceEvent)
    event = sourceEvent;
  return event;
}

// node_modules/d3-selection/src/pointer.js
function pointer_default(event, node2) {
  event = sourceEvent_default(event);
  if (node2 === undefined)
    node2 = event.currentTarget;
  if (node2) {
    var svg = node2.ownerSVGElement || node2;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = event.clientX, point.y = event.clientY;
      point = point.matrixTransform(node2.getScreenCTM().inverse());
      return [point.x, point.y];
    }
    if (node2.getBoundingClientRect) {
      var rect = node2.getBoundingClientRect();
      return [event.clientX - rect.left - node2.clientLeft, event.clientY - rect.top - node2.clientTop];
    }
  }
  return [event.pageX, event.pageY];
}
// node_modules/d3-color/src/define.js
function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition)
    prototype[key] = definition[key];
  return prototype;
}
function define_default(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}

// node_modules/d3-color/src/color.js
function Color() {
}
var color_formatHex = function() {
  return this.rgb().formatHex();
};
var color_formatHex8 = function() {
  return this.rgb().formatHex8();
};
var color_formatHsl = function() {
  return hslConvert(this).formatHsl();
};
var color_formatRgb = function() {
  return this.rgb().formatRgb();
};
var rgbn = function(n) {
  return new Rgb(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
};
var rgba = function(r, g, b, a) {
  if (a <= 0)
    r = g = b = NaN;
  return new Rgb(r, g, b, a);
};
function rgbConvert(o) {
  if (!(o instanceof Color))
    o = color(o);
  if (!o)
    return new Rgb;
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}
function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}
function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}
var rgb_formatHex = function() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
};
var rgb_formatHex8 = function() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
};
var rgb_formatRgb = function() {
  const a = clampa(this.opacity);
  return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
};
var clampa = function(opacity) {
  return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
};
var clampi = function(value2) {
  return Math.max(0, Math.min(255, Math.round(value2) || 0));
};
var hex = function(value2) {
  value2 = clampi(value2);
  return (value2 < 16 ? "0" : "") + value2.toString(16);
};
var hsla = function(h, s, l, a) {
  if (a <= 0)
    h = s = l = NaN;
  else if (l <= 0 || l >= 1)
    h = s = NaN;
  else if (s <= 0)
    h = NaN;
  return new Hsl(h, s, l, a);
};
function hslConvert(o) {
  if (o instanceof Hsl)
    return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color))
    o = color(o);
  if (!o)
    return new Hsl;
  if (o instanceof Hsl)
    return o;
  o = o.rgb();
  var r = o.r / 255, g = o.g / 255, b = o.b / 255, min3 = Math.min(r, g, b), max5 = Math.max(r, g, b), h = NaN, s = max5 - min3, l = (max5 + min3) / 2;
  if (s) {
    if (r === max5)
      h = (g - b) / s + (g < b) * 6;
    else if (g === max5)
      h = (b - r) / s + 2;
    else
      h = (r - g) / s + 4;
    s /= l < 0.5 ? max5 + min3 : 2 - max5 - min3;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}
function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}
var Hsl = function(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
};
var clamph = function(value2) {
  value2 = (value2 || 0) % 360;
  return value2 < 0 ? value2 + 360 : value2;
};
var clampt = function(value2) {
  return Math.max(0, Math.min(1, value2 || 0));
};
var hsl2rgb = function(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
};
var darker = 0.7;
var brighter = 1 / darker;
var reI = "\\s*([+-]?\\d+)\\s*";
var reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*";
var reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
var reHex = /^#([0-9a-f]{3,8})$/;
var reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)\$`);
var reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)\$`);
var reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)\$`);
var reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)\$`);
var reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)\$`);
var reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)\$`);
var named = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
define_default(Color, color, {
  copy(channels) {
    return Object.assign(new this.constructor, this, channels);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: color_formatHex,
  formatHex: color_formatHex,
  formatHex8: color_formatHex8,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});
function color(format) {
  var m, l;
  format = (format + "").trim().toLowerCase();
  return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) : l === 3 ? new Rgb(m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, (m & 15) << 4 | m & 15, 1) : l === 8 ? rgba(m >> 24 & 255, m >> 16 & 255, m >> 8 & 255, (m & 255) / 255) : l === 4 ? rgba(m >> 12 & 15 | m >> 8 & 240, m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, ((m & 15) << 4 | m & 15) / 255) : null) : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) : named.hasOwnProperty(format) ? rgbn(named[format]) : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
define_default(Rgb, rgb, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && (-0.5 <= this.g && this.g < 255.5) && (-0.5 <= this.b && this.b < 255.5) && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex,
  formatHex: rgb_formatHex,
  formatHex8: rgb_formatHex8,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));
define_default(Hsl, hsl, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb() {
    var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s, m1 = 2 * l - m2;
    return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
  },
  clamp() {
    return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && (0 <= this.l && this.l <= 1) && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl() {
    const a = clampa(this.opacity);
    return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
  }
}));
// node_modules/d3-color/src/math.js
var radians = Math.PI / 180;
var degrees = 180 / Math.PI;

// node_modules/d3-color/src/lab.js
var labConvert = function(o) {
  if (o instanceof Lab)
    return new Lab(o.l, o.a, o.b, o.opacity);
  if (o instanceof Hcl)
    return hcl2lab(o);
  if (!(o instanceof Rgb))
    o = rgbConvert(o);
  var r = rgb2lrgb(o.r), g = rgb2lrgb(o.g), b = rgb2lrgb(o.b), y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn), x, z;
  if (r === g && g === b)
    x = z = y;
  else {
    x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
    z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
  }
  return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
};
function Lab(l, a, b, opacity) {
  this.l = +l;
  this.a = +a;
  this.b = +b;
  this.opacity = +opacity;
}
var xyz2lab = function(t) {
  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
};
var lab2xyz = function(t) {
  return t > t1 ? t * t * t : t2 * (t - t0);
};
var lrgb2rgb = function(x) {
  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
};
var rgb2lrgb = function(x) {
  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
};
var hclConvert = function(o) {
  if (o instanceof Hcl)
    return new Hcl(o.h, o.c, o.l, o.opacity);
  if (!(o instanceof Lab))
    o = labConvert(o);
  if (o.a === 0 && o.b === 0)
    return new Hcl(NaN, 0 < o.l && o.l < 100 ? 0 : NaN, o.l, o.opacity);
  var h = Math.atan2(o.b, o.a) * degrees;
  return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
};
function hcl(h, c, l, opacity) {
  return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
}
function Hcl(h, c, l, opacity) {
  this.h = +h;
  this.c = +c;
  this.l = +l;
  this.opacity = +opacity;
}
var hcl2lab = function(o) {
  if (isNaN(o.h))
    return new Lab(o.l, 0, 0, o.opacity);
  var h = o.h * radians;
  return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
};
var K = 18;
var Xn = 0.96422;
var Yn = 1;
var Zn = 0.82521;
var t0 = 4 / 29;
var t1 = 6 / 29;
var t2 = 3 * t1 * t1;
var t3 = t1 * t1 * t1;
function lab(l, a, b, opacity) {
  return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
}
define_default(Lab, lab, extend(Color, {
  brighter(k) {
    return new Lab(this.l + K * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  darker(k) {
    return new Lab(this.l - K * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  rgb() {
    var y = (this.l + 16) / 116, x = isNaN(this.a) ? y : y + this.a / 500, z = isNaN(this.b) ? y : y - this.b / 200;
    x = Xn * lab2xyz(x);
    y = Yn * lab2xyz(y);
    z = Zn * lab2xyz(z);
    return new Rgb(lrgb2rgb(3.1338561 * x - 1.6168667 * y - 0.4906146 * z), lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.033454 * z), lrgb2rgb(0.0719453 * x - 0.2289914 * y + 1.4052427 * z), this.opacity);
  }
}));
define_default(Hcl, hcl, extend(Color, {
  brighter(k) {
    return new Hcl(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
  },
  darker(k) {
    return new Hcl(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
  },
  rgb() {
    return hcl2lab(this).rgb();
  }
}));
// node_modules/d3-color/src/cubehelix.js
var cubehelixConvert = function(o) {
  if (o instanceof Cubehelix)
    return new Cubehelix(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Rgb))
    o = rgbConvert(o);
  var r = o.r / 255, g = o.g / 255, b = o.b / 255, l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB), bl = b - l, k = (E * (g - l) - C * bl) / D, s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), h = s ? Math.atan2(k, bl) * degrees - 120 : NaN;
  return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
};
function Cubehelix(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}
var A = -0.14861;
var B = 1.78277;
var C = -0.29227;
var D = -0.90649;
var E = 1.97294;
var ED = E * D;
var EB = E * B;
var BC_DA = B * C - D * A;
function cubehelix(h, s, l, opacity) {
  return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
}
define_default(Cubehelix, cubehelix, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  rgb() {
    var h = isNaN(this.h) ? 0 : (this.h + 120) * radians, l = +this.l, a = isNaN(this.s) ? 0 : this.s * l * (1 - l), cosh = Math.cos(h), sinh = Math.sin(h);
    return new Rgb(255 * (l + a * (A * cosh + B * sinh)), 255 * (l + a * (C * cosh + D * sinh)), 255 * (l + a * (E * cosh)), this.opacity);
  }
}));
// node_modules/d3-interpolate/src/basis.js
function basis(t12, v0, v1, v2, v3) {
  var t22 = t12 * t12, t32 = t22 * t12;
  return ((1 - 3 * t12 + 3 * t22 - t32) * v0 + (4 - 6 * t22 + 3 * t32) * v1 + (1 + 3 * t12 + 3 * t22 - 3 * t32) * v2 + t32 * v3) / 6;
}
function basis_default(values3) {
  var n = values3.length - 1;
  return function(t) {
    var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n), v1 = values3[i], v2 = values3[i + 1], v0 = i > 0 ? values3[i - 1] : 2 * v1 - v2, v3 = i < n - 1 ? values3[i + 2] : 2 * v2 - v1;
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}

// node_modules/d3-interpolate/src/basisClosed.js
function basisClosed_default(values3) {
  var n = values3.length;
  return function(t) {
    var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n), v0 = values3[(i + n - 1) % n], v1 = values3[i % n], v2 = values3[(i + 1) % n], v3 = values3[(i + 2) % n];
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}

// node_modules/d3-interpolate/src/constant.js
var constant_default2 = (x) => () => x;

// node_modules/d3-interpolate/src/color.js
var linear = function(a, d) {
  return function(t) {
    return a + t * d;
  };
};
var exponential = function(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
    return Math.pow(a + t * b, y);
  };
};
function hue(a, b) {
  var d = b - a;
  return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant_default2(isNaN(a) ? b : a);
}
function gamma(y) {
  return (y = +y) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y) : constant_default2(isNaN(a) ? b : a);
  };
}
function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant_default2(isNaN(a) ? b : a);
}

// node_modules/d3-interpolate/src/rgb.js
var rgbSpline = function(spline) {
  return function(colors) {
    var n = colors.length, r = new Array(n), g = new Array(n), b = new Array(n), i, color5;
    for (i = 0;i < n; ++i) {
      color5 = rgb(colors[i]);
      r[i] = color5.r || 0;
      g[i] = color5.g || 0;
      b[i] = color5.b || 0;
    }
    r = spline(r);
    g = spline(g);
    b = spline(b);
    color5.opacity = 1;
    return function(t) {
      color5.r = r(t);
      color5.g = g(t);
      color5.b = b(t);
      return color5 + "";
    };
  };
};
var rgb_default = function rgbGamma(y) {
  var color5 = gamma(y);
  function rgb2(start, end) {
    var r = color5((start = rgb(start)).r, (end = rgb(end)).r), g = color5(start.g, end.g), b = color5(start.b, end.b), opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }
  rgb2.gamma = rgbGamma;
  return rgb2;
}(1);
var rgbBasis = rgbSpline(basis_default);
var rgbBasisClosed = rgbSpline(basisClosed_default);

// node_modules/d3-interpolate/src/numberArray.js
function isNumberArray(x) {
  return ArrayBuffer.isView(x) && !(x instanceof DataView);
}
function numberArray_default(a, b) {
  if (!b)
    b = [];
  var n = a ? Math.min(b.length, a.length) : 0, c = b.slice(), i;
  return function(t) {
    for (i = 0;i < n; ++i)
      c[i] = a[i] * (1 - t) + b[i] * t;
    return c;
  };
}

// node_modules/d3-interpolate/src/array.js
function genericArray(a, b) {
  var nb = b ? b.length : 0, na = a ? Math.min(nb, a.length) : 0, x = new Array(na), c = new Array(nb), i;
  for (i = 0;i < na; ++i)
    x[i] = value_default(a[i], b[i]);
  for (;i < nb; ++i)
    c[i] = b[i];
  return function(t) {
    for (i = 0;i < na; ++i)
      c[i] = x[i](t);
    return c;
  };
}

// node_modules/d3-interpolate/src/date.js
function date_default(a, b) {
  var d = new Date;
  return a = +a, b = +b, function(t) {
    return d.setTime(a * (1 - t) + b * t), d;
  };
}

// node_modules/d3-interpolate/src/number.js
function number_default(a, b) {
  return a = +a, b = +b, function(t) {
    return a * (1 - t) + b * t;
  };
}

// node_modules/d3-interpolate/src/object.js
function object_default(a, b) {
  var i = {}, c = {}, k;
  if (a === null || typeof a !== "object")
    a = {};
  if (b === null || typeof b !== "object")
    b = {};
  for (k in b) {
    if (k in a) {
      i[k] = value_default(a[k], b[k]);
    } else {
      c[k] = b[k];
    }
  }
  return function(t) {
    for (k in i)
      c[k] = i[k](t);
    return c;
  };
}

// node_modules/d3-interpolate/src/string.js
var zero2 = function(b) {
  return function() {
    return b;
  };
};
var one = function(b) {
  return function(t) {
    return b(t) + "";
  };
};
var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
var reB = new RegExp(reA.source, "g");
function string_default(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
  a = a + "", b = b + "";
  while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) {
      bs = b.slice(bi, bs);
      if (s[i])
        s[i] += bs;
      else
        s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) {
      if (s[i])
        s[i] += bm;
      else
        s[++i] = bm;
    } else {
      s[++i] = null;
      q.push({ i, x: number_default(am, bm) });
    }
    bi = reB.lastIndex;
  }
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i])
      s[i] += bs;
    else
      s[++i] = bs;
  }
  return s.length < 2 ? q[0] ? one(q[0].x) : zero2(b) : (b = q.length, function(t) {
    for (var i2 = 0, o;i2 < b; ++i2)
      s[(o = q[i2]).i] = o.x(t);
    return s.join("");
  });
}

// node_modules/d3-interpolate/src/value.js
function value_default(a, b) {
  var t = typeof b, c;
  return b == null || t === "boolean" ? constant_default2(b) : (t === "number" ? number_default : t === "string" ? (c = color(b)) ? (b = c, rgb_default) : string_default : b instanceof color ? rgb_default : b instanceof Date ? date_default : isNumberArray(b) ? numberArray_default : Array.isArray(b) ? genericArray : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object_default : number_default)(a, b);
}
// node_modules/d3-interpolate/src/round.js
function round_default(a, b) {
  return a = +a, b = +b, function(t) {
    return Math.round(a * (1 - t) + b * t);
  };
}
// node_modules/d3-interpolate/src/transform/decompose.js
var degrees2 = 180 / Math.PI;
var identity6 = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function decompose_default(a, b, c, d, e3, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b))
    a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d)
    c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d))
    c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c)
    a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e3,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees2,
    skewX: Math.atan(skewX) * degrees2,
    scaleX,
    scaleY
  };
}

// node_modules/d3-interpolate/src/transform/parse.js
function parseCss(value4) {
  const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value4 + "");
  return m.isIdentity ? identity6 : decompose_default(m.a, m.b, m.c, m.d, m.e, m.f);
}
function parseSvg(value4) {
  if (value4 == null)
    return identity6;
  if (!svgNode)
    svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value4);
  if (!(value4 = svgNode.transform.baseVal.consolidate()))
    return identity6;
  value4 = value4.matrix;
  return decompose_default(value4.a, value4.b, value4.c, value4.d, value4.e, value4.f);
}
var svgNode;

// node_modules/d3-interpolate/src/transform/index.js
var interpolateTransform = function(parse3, pxComma, pxParen, degParen) {
  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }
  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({ i: i - 4, x: number_default(xa, xb) }, { i: i - 2, x: number_default(ya, yb) });
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }
  function rotate(a, b, s, q) {
    if (a !== b) {
      if (a - b > 180)
        b += 360;
      else if (b - a > 180)
        a += 360;
      q.push({ i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: number_default(a, b) });
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }
  function skewX(a, b, s, q) {
    if (a !== b) {
      q.push({ i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: number_default(a, b) });
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }
  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({ i: i - 4, x: number_default(xa, xb) }, { i: i - 2, x: number_default(ya, yb) });
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }
  return function(a, b) {
    var s = [], q = [];
    a = parse3(a), b = parse3(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
    rotate(a.rotate, b.rotate, s, q);
    skewX(a.skewX, b.skewX, s, q);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
    a = b = null;
    return function(t) {
      var i = -1, n = q.length, o;
      while (++i < n)
        s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  };
};
var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");
// node_modules/d3-interpolate/src/hsl.js
var hsl2 = function(hue2) {
  return function(start, end) {
    var h = hue2((start = hsl(start)).h, (end = hsl(end)).h), s = nogamma(start.s, end.s), l = nogamma(start.l, end.l), opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.h = h(t);
      start.s = s(t);
      start.l = l(t);
      start.opacity = opacity(t);
      return start + "";
    };
  };
};
var hsl_default = hsl2(hue);
var hslLong = hsl2(nogamma);
// node_modules/d3-interpolate/src/lab.js
function lab2(start, end) {
  var l = nogamma((start = lab(start)).l, (end = lab(end)).l), a = nogamma(start.a, end.a), b = nogamma(start.b, end.b), opacity = nogamma(start.opacity, end.opacity);
  return function(t) {
    start.l = l(t);
    start.a = a(t);
    start.b = b(t);
    start.opacity = opacity(t);
    return start + "";
  };
}
// node_modules/d3-interpolate/src/hcl.js
var hcl2 = function(hue2) {
  return function(start, end) {
    var h = hue2((start = hcl(start)).h, (end = hcl(end)).h), c = nogamma(start.c, end.c), l = nogamma(start.l, end.l), opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.h = h(t);
      start.c = c(t);
      start.l = l(t);
      start.opacity = opacity(t);
      return start + "";
    };
  };
};
var hcl_default = hcl2(hue);
var hclLong = hcl2(nogamma);
// node_modules/d3-interpolate/src/cubehelix.js
var cubehelix2 = function(hue2) {
  return function cubehelixGamma(y) {
    y = +y;
    function cubehelix3(start, end) {
      var h = hue2((start = cubehelix(start)).h, (end = cubehelix(end)).h), s = nogamma(start.s, end.s), l = nogamma(start.l, end.l), opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.h = h(t);
        start.s = s(t);
        start.l = l(Math.pow(t, y));
        start.opacity = opacity(t);
        return start + "";
      };
    }
    cubehelix3.gamma = cubehelixGamma;
    return cubehelix3;
  }(1);
};
var cubehelix_default = cubehelix2(hue);
var cubehelixLong = cubehelix2(nogamma);
// node_modules/d3-interpolate/src/piecewise.js
function piecewise(interpolate, values3) {
  if (values3 === undefined)
    values3 = interpolate, interpolate = value_default;
  var i = 0, n = values3.length - 1, v = values3[0], I = new Array(n < 0 ? 0 : n);
  while (i < n)
    I[i] = interpolate(v, v = values3[++i]);
  return function(t) {
    var i2 = Math.max(0, Math.min(n - 1, Math.floor(t *= n)));
    return I[i2](t - i2);
  };
}
// node_modules/d3-interpolate/src/quantize.js
function quantize_default(interpolator, n) {
  var samples = new Array(n);
  for (var i = 0;i < n; ++i)
    samples[i] = interpolator(i / (n - 1));
  return samples;
}
// node_modules/d3-timer/src/timer.js
function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}
var clearNow = function() {
  clockNow = 0;
};
function Timer() {
  this._call = this._time = this._next = null;
}
function timer(callback, delay, time) {
  var t = new Timer;
  t.restart(callback, delay, time);
  return t;
}
function timerFlush() {
  now();
  ++frame;
  var t = taskHead, e3;
  while (t) {
    if ((e3 = clockNow - t._time) >= 0)
      t._call.call(undefined, e3);
    t = t._next;
  }
  --frame;
}
var wake = function() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout = 0;
  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
};
var poke = function() {
  var now2 = clock.now(), delay = now2 - clockLast;
  if (delay > pokeDelay)
    clockSkew -= delay, clockLast = now2;
};
var nap = function() {
  var t02, t12 = taskHead, t22, time = Infinity;
  while (t12) {
    if (t12._call) {
      if (time > t12._time)
        time = t12._time;
      t02 = t12, t12 = t12._next;
    } else {
      t22 = t12._next, t12._next = null;
      t12 = t02 ? t02._next = t22 : taskHead = t22;
    }
  }
  taskTail = t02;
  sleep(time);
};
var sleep = function(time) {
  if (frame)
    return;
  if (timeout)
    timeout = clearTimeout(timeout);
  var delay = time - clockNow;
  if (delay > 24) {
    if (time < Infinity)
      timeout = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval)
      interval = clearInterval(interval);
  } else {
    if (!interval)
      clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
};
var frame = 0;
var timeout = 0;
var interval = 0;
var pokeDelay = 1000;
var taskHead;
var taskTail;
var clockLast = 0;
var clockNow = 0;
var clockSkew = 0;
var clock = typeof performance === "object" && performance.now ? performance : Date;
var setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
  setTimeout(f, 17);
};
Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function(callback, delay, time) {
    if (typeof callback !== "function")
      throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail)
        taskTail._next = this;
      else
        taskHead = this;
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};
// node_modules/d3-timer/src/timeout.js
function timeout_default(callback, delay, time) {
  var t = new Timer;
  delay = delay == null ? 0 : +delay;
  t.restart((elapsed) => {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
}
// node_modules/d3-transition/src/transition/schedule.js
function init(node2, id) {
  var schedule = get2(node2, id);
  if (schedule.state > CREATED)
    throw new Error("too late; already scheduled");
  return schedule;
}
function set2(node2, id) {
  var schedule = get2(node2, id);
  if (schedule.state > STARTED)
    throw new Error("too late; already running");
  return schedule;
}
function get2(node2, id) {
  var schedule = node2.__transition;
  if (!schedule || !(schedule = schedule[id]))
    throw new Error("transition not found");
  return schedule;
}
var create = function(node2, id, self) {
  var schedules = node2.__transition, tween;
  schedules[id] = self;
  self.timer = timer(schedule, 0, self.time);
  function schedule(elapsed) {
    self.state = SCHEDULED;
    self.timer.restart(start, self.delay, self.time);
    if (self.delay <= elapsed)
      start(elapsed - self.delay);
  }
  function start(elapsed) {
    var i, j, n, o;
    if (self.state !== SCHEDULED)
      return stop();
    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self.name)
        continue;
      if (o.state === STARTED)
        return timeout_default(start);
      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node2, node2.__data__, o.index, o.group);
        delete schedules[i];
      } else if (+i < id) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("cancel", node2, node2.__data__, o.index, o.group);
        delete schedules[i];
      }
    }
    timeout_default(function() {
      if (self.state === STARTED) {
        self.state = RUNNING;
        self.timer.restart(tick, self.delay, self.time);
        tick(elapsed);
      }
    });
    self.state = STARTING;
    self.on.call("start", node2, node2.__data__, self.index, self.group);
    if (self.state !== STARTING)
      return;
    self.state = STARTED;
    tween = new Array(n = self.tween.length);
    for (i = 0, j = -1;i < n; ++i) {
      if (o = self.tween[i].value.call(node2, node2.__data__, self.index, self.group)) {
        tween[++j] = o;
      }
    }
    tween.length = j + 1;
  }
  function tick(elapsed) {
    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1), i = -1, n = tween.length;
    while (++i < n) {
      tween[i].call(node2, t);
    }
    if (self.state === ENDING) {
      self.on.call("end", node2, node2.__data__, self.index, self.group);
      stop();
    }
  }
  function stop() {
    self.state = ENDED;
    self.timer.stop();
    delete schedules[id];
    for (var i in schedules)
      return;
    delete node2.__transition;
  }
};
var emptyOn = dispatch_default("start", "end", "cancel", "interrupt");
var emptyTween = [];
var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;
function schedule_default(node2, name, id, index2, group3, timing) {
  var schedules = node2.__transition;
  if (!schedules)
    node2.__transition = {};
  else if (id in schedules)
    return;
  create(node2, id, {
    name,
    index: index2,
    group: group3,
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}

// node_modules/d3-transition/src/interrupt.js
function interrupt_default(node2, name) {
  var schedules = node2.__transition, schedule2, active, empty4 = true, i;
  if (!schedules)
    return;
  name = name == null ? null : name + "";
  for (i in schedules) {
    if ((schedule2 = schedules[i]).name !== name) {
      empty4 = false;
      continue;
    }
    active = schedule2.state > STARTING && schedule2.state < ENDING;
    schedule2.state = ENDED;
    schedule2.timer.stop();
    schedule2.on.call(active ? "interrupt" : "cancel", node2, node2.__data__, schedule2.index, schedule2.group);
    delete schedules[i];
  }
  if (empty4)
    delete node2.__transition;
}

// node_modules/d3-transition/src/selection/interrupt.js
function interrupt_default2(name) {
  return this.each(function() {
    interrupt_default(this, name);
  });
}

// node_modules/d3-transition/src/transition/tween.js
var tweenRemove = function(id, name) {
  var tween0, tween1;
  return function() {
    var schedule3 = set2(this, id), tween = schedule3.tween;
    if (tween !== tween0) {
      tween1 = tween0 = tween;
      for (var i = 0, n = tween1.length;i < n; ++i) {
        if (tween1[i].name === name) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }
    schedule3.tween = tween1;
  };
};
var tweenFunction = function(id, name, value5) {
  var tween0, tween1;
  if (typeof value5 !== "function")
    throw new Error;
  return function() {
    var schedule3 = set2(this, id), tween = schedule3.tween;
    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();
      for (var t = { name, value: value5 }, i = 0, n = tween1.length;i < n; ++i) {
        if (tween1[i].name === name) {
          tween1[i] = t;
          break;
        }
      }
      if (i === n)
        tween1.push(t);
    }
    schedule3.tween = tween1;
  };
};
function tweenValue(transition, name, value5) {
  var id = transition._id;
  transition.each(function() {
    var schedule3 = set2(this, id);
    (schedule3.value || (schedule3.value = {}))[name] = value5.apply(this, arguments);
  });
  return function(node2) {
    return get2(node2, id).value[name];
  };
}
function tween_default(name, value5) {
  var id = this._id;
  name += "";
  if (arguments.length < 2) {
    var tween = get2(this.node(), id).tween;
    for (var i = 0, n = tween.length, t;i < n; ++i) {
      if ((t = tween[i]).name === name) {
        return t.value;
      }
    }
    return null;
  }
  return this.each((value5 == null ? tweenRemove : tweenFunction)(id, name, value5));
}

// node_modules/d3-transition/src/transition/interpolate.js
function interpolate_default(a, b) {
  var c;
  return (typeof b === "number" ? number_default : b instanceof color ? rgb_default : (c = color(b)) ? (b = c, rgb_default) : string_default)(a, b);
}

// node_modules/d3-transition/src/transition/attr.js
var attrRemove2 = function(name) {
  return function() {
    this.removeAttribute(name);
  };
};
var attrRemoveNS2 = function(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
};
var attrConstant2 = function(name, interpolate2, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = this.getAttribute(name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, value1);
  };
};
var attrConstantNS2 = function(fullname, interpolate2, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = this.getAttributeNS(fullname.space, fullname.local);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, value1);
  };
};
var attrFunction2 = function(name, interpolate2, value5) {
  var string00, string10, interpolate0;
  return function() {
    var string0, value1 = value5(this), string1;
    if (value1 == null)
      return void this.removeAttribute(name);
    string0 = this.getAttribute(name);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate2(string00 = string0, value1));
  };
};
var attrFunctionNS2 = function(fullname, interpolate2, value5) {
  var string00, string10, interpolate0;
  return function() {
    var string0, value1 = value5(this), string1;
    if (value1 == null)
      return void this.removeAttributeNS(fullname.space, fullname.local);
    string0 = this.getAttributeNS(fullname.space, fullname.local);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate2(string00 = string0, value1));
  };
};
function attr_default2(name, value5) {
  var fullname = namespace_default(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate_default;
  return this.attrTween(name, typeof value5 === "function" ? (fullname.local ? attrFunctionNS2 : attrFunction2)(fullname, i, tweenValue(this, "attr." + name, value5)) : value5 == null ? (fullname.local ? attrRemoveNS2 : attrRemove2)(fullname) : (fullname.local ? attrConstantNS2 : attrConstant2)(fullname, i, value5));
}

// node_modules/d3-transition/src/transition/attrTween.js
var attrInterpolate = function(name, i) {
  return function(t) {
    this.setAttribute(name, i.call(this, t));
  };
};
var attrInterpolateNS = function(fullname, i) {
  return function(t) {
    this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
  };
};
var attrTweenNS = function(fullname, value5) {
  var t02, i0;
  function tween2() {
    var i = value5.apply(this, arguments);
    if (i !== i0)
      t02 = (i0 = i) && attrInterpolateNS(fullname, i);
    return t02;
  }
  tween2._value = value5;
  return tween2;
};
var attrTween = function(name, value5) {
  var t02, i0;
  function tween2() {
    var i = value5.apply(this, arguments);
    if (i !== i0)
      t02 = (i0 = i) && attrInterpolate(name, i);
    return t02;
  }
  tween2._value = value5;
  return tween2;
};
function attrTween_default(name, value5) {
  var key = "attr." + name;
  if (arguments.length < 2)
    return (key = this.tween(key)) && key._value;
  if (value5 == null)
    return this.tween(key, null);
  if (typeof value5 !== "function")
    throw new Error;
  var fullname = namespace_default(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value5));
}

// node_modules/d3-transition/src/transition/delay.js
var delayFunction = function(id, value5) {
  return function() {
    init(this, id).delay = +value5.apply(this, arguments);
  };
};
var delayConstant = function(id, value5) {
  return value5 = +value5, function() {
    init(this, id).delay = value5;
  };
};
function delay_default(value5) {
  var id = this._id;
  return arguments.length ? this.each((typeof value5 === "function" ? delayFunction : delayConstant)(id, value5)) : get2(this.node(), id).delay;
}

// node_modules/d3-transition/src/transition/duration.js
var durationFunction = function(id, value5) {
  return function() {
    set2(this, id).duration = +value5.apply(this, arguments);
  };
};
var durationConstant = function(id, value5) {
  return value5 = +value5, function() {
    set2(this, id).duration = value5;
  };
};
function duration_default(value5) {
  var id = this._id;
  return arguments.length ? this.each((typeof value5 === "function" ? durationFunction : durationConstant)(id, value5)) : get2(this.node(), id).duration;
}

// node_modules/d3-transition/src/transition/ease.js
var easeConstant = function(id, value5) {
  if (typeof value5 !== "function")
    throw new Error;
  return function() {
    set2(this, id).ease = value5;
  };
};
function ease_default(value5) {
  var id = this._id;
  return arguments.length ? this.each(easeConstant(id, value5)) : get2(this.node(), id).ease;
}

// node_modules/d3-transition/src/transition/easeVarying.js
var easeVarying = function(id, value5) {
  return function() {
    var v = value5.apply(this, arguments);
    if (typeof v !== "function")
      throw new Error;
    set2(this, id).ease = v;
  };
};
function easeVarying_default(value5) {
  if (typeof value5 !== "function")
    throw new Error;
  return this.each(easeVarying(this._id, value5));
}

// node_modules/d3-transition/src/transition/filter.js
function filter_default3(match) {
  if (typeof match !== "function")
    match = matcher_default(match);
  for (var groups2 = this._groups, m = groups2.length, subgroups = new Array(m), j = 0;j < m; ++j) {
    for (var group3 = groups2[j], n = group3.length, subgroup = subgroups[j] = [], node2, i = 0;i < n; ++i) {
      if ((node2 = group3[i]) && match.call(node2, node2.__data__, i, group3)) {
        subgroup.push(node2);
      }
    }
  }
  return new Transition(subgroups, this._parents, this._name, this._id);
}

// node_modules/d3-transition/src/transition/merge.js
function merge_default2(transition) {
  if (transition._id !== this._id)
    throw new Error;
  for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0;j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge3 = merges[j] = new Array(n), node2, i = 0;i < n; ++i) {
      if (node2 = group0[i] || group1[i]) {
        merge3[i] = node2;
      }
    }
  }
  for (;j < m0; ++j) {
    merges[j] = groups0[j];
  }
  return new Transition(merges, this._parents, this._name, this._id);
}

// node_modules/d3-transition/src/transition/on.js
var start = function(name) {
  return (name + "").trim().split(/^|\s+/).every(function(t) {
    var i = t.indexOf(".");
    if (i >= 0)
      t = t.slice(0, i);
    return !t || t === "start";
  });
};
var onFunction = function(id, name, listener) {
  var on0, on1, sit = start(name) ? init : set2;
  return function() {
    var schedule8 = sit(this, id), on2 = schedule8.on;
    if (on2 !== on0)
      (on1 = (on0 = on2).copy()).on(name, listener);
    schedule8.on = on1;
  };
};
function on_default2(name, listener) {
  var id = this._id;
  return arguments.length < 2 ? get2(this.node(), id).on.on(name) : this.each(onFunction(id, name, listener));
}

// node_modules/d3-transition/src/transition/remove.js
var removeFunction = function(id) {
  return function() {
    var parent = this.parentNode;
    for (var i in this.__transition)
      if (+i !== id)
        return;
    if (parent)
      parent.removeChild(this);
  };
};
function remove_default2() {
  return this.on("end.remove", removeFunction(this._id));
}

// node_modules/d3-transition/src/transition/select.js
function select_default3(select2) {
  var name = this._name, id = this._id;
  if (typeof select2 !== "function")
    select2 = selector_default(select2);
  for (var groups2 = this._groups, m = groups2.length, subgroups = new Array(m), j = 0;j < m; ++j) {
    for (var group3 = groups2[j], n = group3.length, subgroup = subgroups[j] = new Array(n), node2, subnode, i = 0;i < n; ++i) {
      if ((node2 = group3[i]) && (subnode = select2.call(node2, node2.__data__, i, group3))) {
        if ("__data__" in node2)
          subnode.__data__ = node2.__data__;
        subgroup[i] = subnode;
        schedule_default(subgroup[i], name, id, i, subgroup, get2(node2, id));
      }
    }
  }
  return new Transition(subgroups, this._parents, name, id);
}

// node_modules/d3-transition/src/transition/selectAll.js
function selectAll_default2(select2) {
  var name = this._name, id = this._id;
  if (typeof select2 !== "function")
    select2 = selectorAll_default(select2);
  for (var groups2 = this._groups, m = groups2.length, subgroups = [], parents = [], j = 0;j < m; ++j) {
    for (var group3 = groups2[j], n = group3.length, node2, i = 0;i < n; ++i) {
      if (node2 = group3[i]) {
        for (var children2 = select2.call(node2, node2.__data__, i, group3), child, inherit = get2(node2, id), k = 0, l = children2.length;k < l; ++k) {
          if (child = children2[k]) {
            schedule_default(child, name, id, k, children2, inherit);
          }
        }
        subgroups.push(children2);
        parents.push(node2);
      }
    }
  }
  return new Transition(subgroups, parents, name, id);
}

// node_modules/d3-transition/src/transition/selection.js
var Selection2 = selection_default.prototype.constructor;
function selection_default2() {
  return new Selection2(this._groups, this._parents);
}

// node_modules/d3-transition/src/transition/style.js
var styleNull = function(name, interpolate3) {
  var string00, string10, interpolate0;
  return function() {
    var string0 = styleValue(this, name), string1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate3(string00 = string0, string10 = string1);
  };
};
var styleRemove2 = function(name) {
  return function() {
    this.style.removeProperty(name);
  };
};
var styleConstant2 = function(name, interpolate3, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = styleValue(this, name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate3(string00 = string0, value1);
  };
};
var styleFunction2 = function(name, interpolate3, value5) {
  var string00, string10, interpolate0;
  return function() {
    var string0 = styleValue(this, name), value1 = value5(this), string1 = value1 + "";
    if (value1 == null)
      string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate3(string00 = string0, value1));
  };
};
var styleMaybeRemove = function(id, name) {
  var on0, on1, listener0, key = "style." + name, event = "end." + key, remove3;
  return function() {
    var schedule11 = set2(this, id), on2 = schedule11.on, listener = schedule11.value[key] == null ? remove3 || (remove3 = styleRemove2(name)) : undefined;
    if (on2 !== on0 || listener0 !== listener)
      (on1 = (on0 = on2).copy()).on(event, listener0 = listener);
    schedule11.on = on1;
  };
};
function style_default2(name, value5, priority) {
  var i = (name += "") === "transform" ? interpolateTransformCss : interpolate_default;
  return value5 == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove2(name)) : typeof value5 === "function" ? this.styleTween(name, styleFunction2(name, i, tweenValue(this, "style." + name, value5))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant2(name, i, value5), priority).on("end.style." + name, null);
}

// node_modules/d3-transition/src/transition/styleTween.js
var styleInterpolate = function(name, i, priority) {
  return function(t) {
    this.style.setProperty(name, i.call(this, t), priority);
  };
};
var styleTween = function(name, value5, priority) {
  var t, i0;
  function tween3() {
    var i = value5.apply(this, arguments);
    if (i !== i0)
      t = (i0 = i) && styleInterpolate(name, i, priority);
    return t;
  }
  tween3._value = value5;
  return tween3;
};
function styleTween_default(name, value5, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2)
    return (key = this.tween(key)) && key._value;
  if (value5 == null)
    return this.tween(key, null);
  if (typeof value5 !== "function")
    throw new Error;
  return this.tween(key, styleTween(name, value5, priority == null ? "" : priority));
}

// node_modules/d3-transition/src/transition/text.js
var textConstant2 = function(value5) {
  return function() {
    this.textContent = value5;
  };
};
var textFunction2 = function(value5) {
  return function() {
    var value1 = value5(this);
    this.textContent = value1 == null ? "" : value1;
  };
};
function text_default2(value5) {
  return this.tween("text", typeof value5 === "function" ? textFunction2(tweenValue(this, "text", value5)) : textConstant2(value5 == null ? "" : value5 + ""));
}

// node_modules/d3-transition/src/transition/textTween.js
var textInterpolate = function(i) {
  return function(t) {
    this.textContent = i.call(this, t);
  };
};
var textTween = function(value5) {
  var t02, i0;
  function tween4() {
    var i = value5.apply(this, arguments);
    if (i !== i0)
      t02 = (i0 = i) && textInterpolate(i);
    return t02;
  }
  tween4._value = value5;
  return tween4;
};
function textTween_default(value5) {
  var key = "text";
  if (arguments.length < 1)
    return (key = this.tween(key)) && key._value;
  if (value5 == null)
    return this.tween(key, null);
  if (typeof value5 !== "function")
    throw new Error;
  return this.tween(key, textTween(value5));
}

// node_modules/d3-transition/src/transition/transition.js
function transition_default() {
  var name = this._name, id0 = this._id, id1 = newId();
  for (var groups2 = this._groups, m = groups2.length, j = 0;j < m; ++j) {
    for (var group3 = groups2[j], n = group3.length, node2, i = 0;i < n; ++i) {
      if (node2 = group3[i]) {
        var inherit = get2(node2, id0);
        schedule_default(node2, name, id1, i, group3, {
          time: inherit.time + inherit.delay + inherit.duration,
          delay: 0,
          duration: inherit.duration,
          ease: inherit.ease
        });
      }
    }
  }
  return new Transition(groups2, this._parents, name, id1);
}

// node_modules/d3-transition/src/transition/end.js
function end_default() {
  var on0, on1, that = this, id = that._id, size2 = that.size();
  return new Promise(function(resolve, reject4) {
    var cancel = { value: reject4 }, end = { value: function() {
      if (--size2 === 0)
        resolve();
    } };
    that.each(function() {
      var schedule13 = set2(this, id), on2 = schedule13.on;
      if (on2 !== on0) {
        on1 = (on0 = on2).copy();
        on1._.cancel.push(cancel);
        on1._.interrupt.push(cancel);
        on1._.end.push(end);
      }
      schedule13.on = on1;
    });
    if (size2 === 0)
      resolve();
  });
}

// node_modules/d3-transition/src/transition/index.js
function Transition(groups2, parents, name, id) {
  this._groups = groups2;
  this._parents = parents;
  this._name = name;
  this._id = id;
}
function newId() {
  return ++id;
}
var id = 0;
function transition2(name) {
  return selection_default().transition(name);
}
var selection_prototype = selection_default.prototype;
Transition.prototype = transition2.prototype = {
  constructor: Transition,
  select: select_default3,
  selectAll: selectAll_default2,
  selectChild: selection_prototype.selectChild,
  selectChildren: selection_prototype.selectChildren,
  filter: filter_default3,
  merge: merge_default2,
  selection: selection_default2,
  transition: transition_default,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: on_default2,
  attr: attr_default2,
  attrTween: attrTween_default,
  style: style_default2,
  styleTween: styleTween_default,
  text: text_default2,
  textTween: textTween_default,
  remove: remove_default2,
  tween: tween_default,
  delay: delay_default,
  duration: duration_default,
  ease: ease_default,
  easeVarying: easeVarying_default,
  end: end_default,
  [Symbol.iterator]: selection_prototype[Symbol.iterator]
};

// node_modules/d3-ease/src/cubic.js
function cubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
// node_modules/d3-transition/src/selection/transition.js
var inherit = function(node2, id2) {
  var timing;
  while (!(timing = node2.__transition) || !(timing = timing[id2])) {
    if (!(node2 = node2.parentNode)) {
      throw new Error(`transition ${id2} not found`);
    }
  }
  return timing;
};
var defaultTiming = {
  time: null,
  delay: 0,
  duration: 250,
  ease: cubicInOut
};
function transition_default2(name) {
  var id2, timing;
  if (name instanceof Transition) {
    id2 = name._id, name = name._name;
  } else {
    id2 = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
  }
  for (var groups2 = this._groups, m = groups2.length, j = 0;j < m; ++j) {
    for (var group3 = groups2[j], n = group3.length, node2, i = 0;i < n; ++i) {
      if (node2 = group3[i]) {
        schedule_default(node2, name, id2, i, group3, timing || inherit(node2, id2));
      }
    }
  }
  return new Transition(groups2, this._parents, name, id2);
}

// node_modules/d3-transition/src/selection/index.js
selection_default.prototype.interrupt = interrupt_default2;
selection_default.prototype.transition = transition_default2;

// node_modules/d3-brush/src/brush.js
var number1 = function(e3) {
  return [+e3[0], +e3[1]];
};
var number22 = function(e3) {
  return [number1(e3[0]), number1(e3[1])];
};
var type5 = function(t) {
  return { type: t };
};
var X = {
  name: "x",
  handles: ["w", "e"].map(type5),
  input: function(x, e3) {
    return x == null ? null : [[+x[0], e3[0][1]], [+x[1], e3[1][1]]];
  },
  output: function(xy) {
    return xy && [xy[0][0], xy[1][0]];
  }
};
var Y = {
  name: "y",
  handles: ["n", "s"].map(type5),
  input: function(y, e3) {
    return y == null ? null : [[e3[0][0], +y[0]], [e3[1][0], +y[1]]];
  },
  output: function(xy) {
    return xy && [xy[0][1], xy[1][1]];
  }
};
var XY = {
  name: "xy",
  handles: ["n", "w", "e", "s", "nw", "ne", "sw", "se"].map(type5),
  input: function(xy) {
    return xy == null ? null : number22(xy);
  },
  output: function(xy) {
    return xy;
  }
};
// node_modules/d3-path/src/path.js
var append2 = function(strings) {
  this._ += strings[0];
  for (let i = 1, n = strings.length;i < n; ++i) {
    this._ += arguments[i] + strings[i];
  }
};
var appendRound = function(digits) {
  let d = Math.floor(digits);
  if (!(d >= 0))
    throw new Error(`invalid digits: ${digits}`);
  if (d > 15)
    return append2;
  const k = 10 ** d;
  return function(strings) {
    this._ += strings[0];
    for (let i = 1, n = strings.length;i < n; ++i) {
      this._ += Math.round(arguments[i] * k) / k + strings[i];
    }
  };
};
function path() {
  return new Path;
}
function pathRound(digits = 3) {
  return new Path(+digits);
}
var pi = Math.PI;
var tau = 2 * pi;
var epsilon2 = 0.000001;
var tauEpsilon = tau - epsilon2;

class Path {
  constructor(digits) {
    this._x0 = this._y0 = this._x1 = this._y1 = null;
    this._ = "";
    this._append = digits == null ? append2 : appendRound(digits);
  }
  moveTo(x, y) {
    this._append`M${this._x0 = this._x1 = +x},${this._y0 = this._y1 = +y}`;
  }
  closePath() {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._append`Z`;
    }
  }
  lineTo(x, y) {
    this._append`L${this._x1 = +x},${this._y1 = +y}`;
  }
  quadraticCurveTo(x1, y1, x, y) {
    this._append`Q${+x1},${+y1},${this._x1 = +x},${this._y1 = +y}`;
  }
  bezierCurveTo(x1, y1, x2, y2, x, y) {
    this._append`C${+x1},${+y1},${+x2},${+y2},${this._x1 = +x},${this._y1 = +y}`;
  }
  arcTo(x1, y1, x2, y2, r) {
    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
    if (r < 0)
      throw new Error(`negative radius: ${r}`);
    let x0 = this._x1, y0 = this._y1, x21 = x2 - x1, y21 = y2 - y1, x01 = x0 - x1, y01 = y0 - y1, l01_2 = x01 * x01 + y01 * y01;
    if (this._x1 === null) {
      this._append`M${this._x1 = x1},${this._y1 = y1}`;
    } else if (!(l01_2 > epsilon2))
      ;
    else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon2) || !r) {
      this._append`L${this._x1 = x1},${this._y1 = y1}`;
    } else {
      let x20 = x2 - x0, y20 = y2 - y0, l21_2 = x21 * x21 + y21 * y21, l20_2 = x20 * x20 + y20 * y20, l21 = Math.sqrt(l21_2), l01 = Math.sqrt(l01_2), l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2), t01 = l / l01, t21 = l / l21;
      if (Math.abs(t01 - 1) > epsilon2) {
        this._append`L${x1 + t01 * x01},${y1 + t01 * y01}`;
      }
      this._append`A${r},${r},0,0,${+(y01 * x20 > x01 * y20)},${this._x1 = x1 + t21 * x21},${this._y1 = y1 + t21 * y21}`;
    }
  }
  arc(x, y, r, a0, a1, ccw) {
    x = +x, y = +y, r = +r, ccw = !!ccw;
    if (r < 0)
      throw new Error(`negative radius: ${r}`);
    let dx = r * Math.cos(a0), dy = r * Math.sin(a0), x0 = x + dx, y0 = y + dy, cw = 1 ^ ccw, da = ccw ? a0 - a1 : a1 - a0;
    if (this._x1 === null) {
      this._append`M${x0},${y0}`;
    } else if (Math.abs(this._x1 - x0) > epsilon2 || Math.abs(this._y1 - y0) > epsilon2) {
      this._append`L${x0},${y0}`;
    }
    if (!r)
      return;
    if (da < 0)
      da = da % tau + tau;
    if (da > tauEpsilon) {
      this._append`A${r},${r},0,1,${cw},${x - dx},${y - dy}A${r},${r},0,1,${cw},${this._x1 = x0},${this._y1 = y0}`;
    } else if (da > epsilon2) {
      this._append`A${r},${r},0,${+(da >= pi)},${cw},${this._x1 = x + r * Math.cos(a1)},${this._y1 = y + r * Math.sin(a1)}`;
    }
  }
  rect(x, y, w, h) {
    this._append`M${this._x0 = this._x1 = +x},${this._y0 = this._y1 = +y}h${w = +w}v${+h}h${-w}Z`;
  }
  toString() {
    return this._;
  }
}
path.prototype = Path.prototype;
// node_modules/d3-format/src/formatDecimal.js
function formatDecimalParts(x, p) {
  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0)
    return null;
  var i, coefficient = x.slice(0, i);
  return [
    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
    +x.slice(i + 1)
  ];
}
function formatDecimal_default(x) {
  return Math.abs(x = Math.round(x)) >= 1000000000000000000000 ? x.toLocaleString("en").replace(/,/g, "") : x.toString(10);
}

// node_modules/d3-format/src/exponent.js
function exponent_default(x) {
  return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
}

// node_modules/d3-format/src/formatGroup.js
function formatGroup_default(grouping, thousands) {
  return function(value5, width) {
    var i = value5.length, t = [], j = 0, g = grouping[0], length2 = 0;
    while (i > 0 && g > 0) {
      if (length2 + g + 1 > width)
        g = Math.max(1, width - length2);
      t.push(value5.substring(i -= g, i + g));
      if ((length2 += g + 1) > width)
        break;
      g = grouping[j = (j + 1) % grouping.length];
    }
    return t.reverse().join(thousands);
  };
}

// node_modules/d3-format/src/formatNumerals.js
function formatNumerals_default(numerals) {
  return function(value5) {
    return value5.replace(/[0-9]/g, function(i) {
      return numerals[+i];
    });
  };
}

// node_modules/d3-format/src/formatSpecifier.js
function FormatSpecifier(specifier) {
  this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
  this.align = specifier.align === undefined ? ">" : specifier.align + "";
  this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
  this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
  this.zero = !!specifier.zero;
  this.width = specifier.width === undefined ? undefined : +specifier.width;
  this.comma = !!specifier.comma;
  this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
  this.trim = !!specifier.trim;
  this.type = specifier.type === undefined ? "" : specifier.type + "";
}
var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function formatSpecifier(specifier) {
  if (!(match = re.exec(specifier)))
    throw new Error("invalid format: " + specifier);
  var match;
  return new FormatSpecifier({
    fill: match[1],
    align: match[2],
    sign: match[3],
    symbol: match[4],
    zero: match[5],
    width: match[6],
    comma: match[7],
    precision: match[8] && match[8].slice(1),
    trim: match[9],
    type: match[10]
  });
}
formatSpecifier.prototype = FormatSpecifier.prototype;
FormatSpecifier.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === undefined ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};

// node_modules/d3-format/src/formatTrim.js
function formatTrim_default(s) {
  out:
    for (var n = s.length, i = 1, i0 = -1, i1;i < n; ++i) {
      switch (s[i]) {
        case ".":
          i0 = i1 = i;
          break;
        case "0":
          if (i0 === 0)
            i0 = i;
          i1 = i;
          break;
        default:
          if (!+s[i])
            break out;
          if (i0 > 0)
            i0 = 0;
          break;
      }
    }
  return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
}

// node_modules/d3-format/src/formatPrefixAuto.js
var prefixExponent;
function formatPrefixAuto_default(x, p) {
  var d = formatDecimalParts(x, p);
  if (!d)
    return x + "";
  var coefficient = d[0], exponent = d[1], i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1, n = coefficient.length;
  return i === n ? coefficient : i > n ? coefficient + new Array(i - n + 1).join("0") : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i) : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0];
}

// node_modules/d3-format/src/formatRounded.js
function formatRounded_default(x, p) {
  var d = formatDecimalParts(x, p);
  if (!d)
    return x + "";
  var coefficient = d[0], exponent = d[1];
  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1) : coefficient + new Array(exponent - coefficient.length + 2).join("0");
}

// node_modules/d3-format/src/formatTypes.js
var formatTypes_default = {
  "%": (x, p) => (x * 100).toFixed(p),
  b: (x) => Math.round(x).toString(2),
  c: (x) => x + "",
  d: formatDecimal_default,
  e: (x, p) => x.toExponential(p),
  f: (x, p) => x.toFixed(p),
  g: (x, p) => x.toPrecision(p),
  o: (x) => Math.round(x).toString(8),
  p: (x, p) => formatRounded_default(x * 100, p),
  r: formatRounded_default,
  s: formatPrefixAuto_default,
  X: (x) => Math.round(x).toString(16).toUpperCase(),
  x: (x) => Math.round(x).toString(16)
};

// node_modules/d3-format/src/identity.js
function identity_default3(x) {
  return x;
}

// node_modules/d3-format/src/locale.js
var map6 = Array.prototype.map;
var prefixes = ["y", "z", "a", "f", "p", "n", "\xB5", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function locale_default(locale) {
  var group3 = locale.grouping === undefined || locale.thousands === undefined ? identity_default3 : formatGroup_default(map6.call(locale.grouping, Number), locale.thousands + ""), currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "", currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "", decimal = locale.decimal === undefined ? "." : locale.decimal + "", numerals = locale.numerals === undefined ? identity_default3 : formatNumerals_default(map6.call(locale.numerals, String)), percent = locale.percent === undefined ? "%" : locale.percent + "", minus = locale.minus === undefined ? "\u2212" : locale.minus + "", nan = locale.nan === undefined ? "NaN" : locale.nan + "";
  function newFormat(specifier) {
    specifier = formatSpecifier(specifier);
    var { fill, align, sign, symbol, zero: zero3, width, comma, precision, trim, type: type6 } = specifier;
    if (type6 === "n")
      comma = true, type6 = "g";
    else if (!formatTypes_default[type6])
      precision === undefined && (precision = 12), trim = true, type6 = "g";
    if (zero3 || fill === "0" && align === "=")
      zero3 = true, fill = "0", align = "=";
    var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type6) ? "0" + type6.toLowerCase() : "", suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type6) ? percent : "";
    var formatType = formatTypes_default[type6], maybeSuffix = /[defgprs%]/.test(type6);
    precision = precision === undefined ? 6 : /[gprs]/.test(type6) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));
    function format(value5) {
      var valuePrefix = prefix, valueSuffix = suffix, i, n, c;
      if (type6 === "c") {
        valueSuffix = formatType(value5) + valueSuffix;
        value5 = "";
      } else {
        value5 = +value5;
        var valueNegative = value5 < 0 || 1 / value5 < 0;
        value5 = isNaN(value5) ? nan : formatType(Math.abs(value5), precision);
        if (trim)
          value5 = formatTrim_default(value5);
        if (valueNegative && +value5 === 0 && sign !== "+")
          valueNegative = false;
        valuePrefix = (valueNegative ? sign === "(" ? sign : minus : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
        valueSuffix = (type6 === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");
        if (maybeSuffix) {
          i = -1, n = value5.length;
          while (++i < n) {
            if (c = value5.charCodeAt(i), 48 > c || c > 57) {
              valueSuffix = (c === 46 ? decimal + value5.slice(i + 1) : value5.slice(i)) + valueSuffix;
              value5 = value5.slice(0, i);
              break;
            }
          }
        }
      }
      if (comma && !zero3)
        value5 = group3(value5, Infinity);
      var length2 = valuePrefix.length + value5.length + valueSuffix.length, padding = length2 < width ? new Array(width - length2 + 1).join(fill) : "";
      if (comma && zero3)
        value5 = group3(padding + value5, padding.length ? width - valueSuffix.length : Infinity), padding = "";
      switch (align) {
        case "<":
          value5 = valuePrefix + value5 + valueSuffix + padding;
          break;
        case "=":
          value5 = valuePrefix + padding + value5 + valueSuffix;
          break;
        case "^":
          value5 = padding.slice(0, length2 = padding.length >> 1) + valuePrefix + value5 + valueSuffix + padding.slice(length2);
          break;
        default:
          value5 = padding + valuePrefix + value5 + valueSuffix;
          break;
      }
      return numerals(value5);
    }
    format.toString = function() {
      return specifier + "";
    };
    return format;
  }
  function formatPrefix(specifier, value5) {
    var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)), e3 = Math.max(-8, Math.min(8, Math.floor(exponent_default(value5) / 3))) * 3, k = Math.pow(10, -e3), prefix = prefixes[8 + e3 / 3];
    return function(value6) {
      return f(k * value6) + prefix;
    };
  }
  return {
    format: newFormat,
    formatPrefix
  };
}

// node_modules/d3-format/src/defaultLocale.js
var locale2;
var format;
var formatPrefix;
defaultLocale({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function defaultLocale(definition) {
  locale2 = locale_default(definition);
  format = locale2.format;
  formatPrefix = locale2.formatPrefix;
  return locale2;
}
// node_modules/d3-format/src/precisionFixed.js
function precisionFixed_default(step) {
  return Math.max(0, -exponent_default(Math.abs(step)));
}
// node_modules/d3-format/src/precisionPrefix.js
function precisionPrefix_default(step, value5) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent_default(value5) / 3))) * 3 - exponent_default(Math.abs(step)));
}
// node_modules/d3-format/src/precisionRound.js
function precisionRound_default(step, max5) {
  step = Math.abs(step), max5 = Math.abs(max5) - step;
  return Math.max(0, exponent_default(max5) - exponent_default(step)) + 1;
}
// node_modules/d3-geo/src/math.js
function acos(x) {
  return x > 1 ? 0 : x < -1 ? pi2 : Math.acos(x);
}
function asin(x) {
  return x > 1 ? halfPi : x < -1 ? -halfPi : Math.asin(x);
}
var epsilon3 = 0.000001;
var epsilon22 = 0.000000000001;
var pi2 = Math.PI;
var halfPi = pi2 / 2;
var quarterPi = pi2 / 4;
var tau2 = pi2 * 2;
var degrees3 = 180 / pi2;
var radians2 = pi2 / 180;
var abs = Math.abs;
var atan = Math.atan;
var atan2 = Math.atan2;
var cos = Math.cos;
var exp2 = Math.exp;
var log2 = Math.log;
var pow = Math.pow;
var sin = Math.sin;
var sign = Math.sign || function(x) {
  return x > 0 ? 1 : x < 0 ? -1 : 0;
};
var sqrt = Math.sqrt;
var tan = Math.tan;

// node_modules/d3-geo/src/noop.js
function noop2() {
}

// node_modules/d3-geo/src/stream.js
var streamGeometry = function(geometry, stream) {
  if (geometry && streamGeometryType.hasOwnProperty(geometry.type)) {
    streamGeometryType[geometry.type](geometry, stream);
  }
};
var streamLine = function(coordinates, stream, closed) {
  var i = -1, n = coordinates.length - closed, coordinate;
  stream.lineStart();
  while (++i < n)
    coordinate = coordinates[i], stream.point(coordinate[0], coordinate[1], coordinate[2]);
  stream.lineEnd();
};
var streamPolygon = function(coordinates, stream) {
  var i = -1, n = coordinates.length;
  stream.polygonStart();
  while (++i < n)
    streamLine(coordinates[i], stream, 1);
  stream.polygonEnd();
};
var streamObjectType = {
  Feature: function(object2, stream) {
    streamGeometry(object2.geometry, stream);
  },
  FeatureCollection: function(object2, stream) {
    var features = object2.features, i = -1, n = features.length;
    while (++i < n)
      streamGeometry(features[i].geometry, stream);
  }
};
var streamGeometryType = {
  Sphere: function(object2, stream) {
    stream.sphere();
  },
  Point: function(object2, stream) {
    object2 = object2.coordinates;
    stream.point(object2[0], object2[1], object2[2]);
  },
  MultiPoint: function(object2, stream) {
    var coordinates = object2.coordinates, i = -1, n = coordinates.length;
    while (++i < n)
      object2 = coordinates[i], stream.point(object2[0], object2[1], object2[2]);
  },
  LineString: function(object2, stream) {
    streamLine(object2.coordinates, stream, 0);
  },
  MultiLineString: function(object2, stream) {
    var coordinates = object2.coordinates, i = -1, n = coordinates.length;
    while (++i < n)
      streamLine(coordinates[i], stream, 0);
  },
  Polygon: function(object2, stream) {
    streamPolygon(object2.coordinates, stream);
  },
  MultiPolygon: function(object2, stream) {
    var coordinates = object2.coordinates, i = -1, n = coordinates.length;
    while (++i < n)
      streamPolygon(coordinates[i], stream);
  },
  GeometryCollection: function(object2, stream) {
    var geometries = object2.geometries, i = -1, n = geometries.length;
    while (++i < n)
      streamGeometry(geometries[i], stream);
  }
};
function stream_default(object2, stream) {
  if (object2 && streamObjectType.hasOwnProperty(object2.type)) {
    streamObjectType[object2.type](object2, stream);
  } else {
    streamGeometry(object2, stream);
  }
}

// node_modules/d3-geo/src/cartesian.js
function spherical(cartesian) {
  return [atan2(cartesian[1], cartesian[0]), asin(cartesian[2])];
}
function cartesian(spherical2) {
  var lambda = spherical2[0], phi = spherical2[1], cosPhi = cos(phi);
  return [cosPhi * cos(lambda), cosPhi * sin(lambda), sin(phi)];
}
function cartesianDot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function cartesianCross(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
function cartesianAddInPlace(a, b) {
  a[0] += b[0], a[1] += b[1], a[2] += b[2];
}
function cartesianScale(vector, k) {
  return [vector[0] * k, vector[1] * k, vector[2] * k];
}
function cartesianNormalizeInPlace(d) {
  var l = sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
  d[0] /= l, d[1] /= l, d[2] /= l;
}

// node_modules/d3-geo/src/compose.js
function compose_default(a, b) {
  function compose(x, y) {
    return x = a(x, y), b(x[0], x[1]);
  }
  if (a.invert && b.invert)
    compose.invert = function(x, y) {
      return x = b.invert(x, y), x && a.invert(x[0], x[1]);
    };
  return compose;
}

// node_modules/d3-geo/src/rotation.js
var rotationIdentity = function(lambda, phi) {
  if (abs(lambda) > pi2)
    lambda -= Math.round(lambda / tau2) * tau2;
  return [lambda, phi];
};
function rotateRadians(deltaLambda, deltaPhi, deltaGamma) {
  return (deltaLambda %= tau2) ? deltaPhi || deltaGamma ? compose_default(rotationLambda(deltaLambda), rotationPhiGamma(deltaPhi, deltaGamma)) : rotationLambda(deltaLambda) : deltaPhi || deltaGamma ? rotationPhiGamma(deltaPhi, deltaGamma) : rotationIdentity;
}
var forwardRotationLambda = function(deltaLambda) {
  return function(lambda, phi) {
    lambda += deltaLambda;
    if (abs(lambda) > pi2)
      lambda -= Math.round(lambda / tau2) * tau2;
    return [lambda, phi];
  };
};
var rotationLambda = function(deltaLambda) {
  var rotation = forwardRotationLambda(deltaLambda);
  rotation.invert = forwardRotationLambda(-deltaLambda);
  return rotation;
};
var rotationPhiGamma = function(deltaPhi, deltaGamma) {
  var cosDeltaPhi = cos(deltaPhi), sinDeltaPhi = sin(deltaPhi), cosDeltaGamma = cos(deltaGamma), sinDeltaGamma = sin(deltaGamma);
  function rotation(lambda, phi) {
    var cosPhi = cos(phi), x = cos(lambda) * cosPhi, y = sin(lambda) * cosPhi, z = sin(phi), k = z * cosDeltaPhi + x * sinDeltaPhi;
    return [
      atan2(y * cosDeltaGamma - k * sinDeltaGamma, x * cosDeltaPhi - z * sinDeltaPhi),
      asin(k * cosDeltaGamma + y * sinDeltaGamma)
    ];
  }
  rotation.invert = function(lambda, phi) {
    var cosPhi = cos(phi), x = cos(lambda) * cosPhi, y = sin(lambda) * cosPhi, z = sin(phi), k = z * cosDeltaGamma - y * sinDeltaGamma;
    return [
      atan2(y * cosDeltaGamma + z * sinDeltaGamma, x * cosDeltaPhi + k * sinDeltaPhi),
      asin(k * cosDeltaPhi - x * sinDeltaPhi)
    ];
  };
  return rotation;
};
rotationIdentity.invert = rotationIdentity;
function rotation_default(rotate) {
  rotate = rotateRadians(rotate[0] * radians2, rotate[1] * radians2, rotate.length > 2 ? rotate[2] * radians2 : 0);
  function forward(coordinates) {
    coordinates = rotate(coordinates[0] * radians2, coordinates[1] * radians2);
    return coordinates[0] *= degrees3, coordinates[1] *= degrees3, coordinates;
  }
  forward.invert = function(coordinates) {
    coordinates = rotate.invert(coordinates[0] * radians2, coordinates[1] * radians2);
    return coordinates[0] *= degrees3, coordinates[1] *= degrees3, coordinates;
  };
  return forward;
}

// node_modules/d3-geo/src/circle.js
function circleStream(stream, radius, delta, direction, t02, t12) {
  if (!delta)
    return;
  var cosRadius = cos(radius), sinRadius = sin(radius), step = direction * delta;
  if (t02 == null) {
    t02 = radius + direction * tau2;
    t12 = radius - step / 2;
  } else {
    t02 = circleRadius(cosRadius, t02);
    t12 = circleRadius(cosRadius, t12);
    if (direction > 0 ? t02 < t12 : t02 > t12)
      t02 += direction * tau2;
  }
  for (var point, t = t02;direction > 0 ? t > t12 : t < t12; t -= step) {
    point = spherical([cosRadius, -sinRadius * cos(t), -sinRadius * sin(t)]);
    stream.point(point[0], point[1]);
  }
}
var circleRadius = function(cosRadius, point) {
  point = cartesian(point), point[0] -= cosRadius;
  cartesianNormalizeInPlace(point);
  var radius = acos(-point[1]);
  return ((-point[2] < 0 ? -radius : radius) + tau2 - epsilon3) % tau2;
};

// node_modules/d3-geo/src/clip/buffer.js
function buffer_default() {
  var lines = [], line;
  return {
    point: function(x, y, m) {
      line.push([x, y, m]);
    },
    lineStart: function() {
      lines.push(line = []);
    },
    lineEnd: noop2,
    rejoin: function() {
      if (lines.length > 1)
        lines.push(lines.pop().concat(lines.shift()));
    },
    result: function() {
      var result = lines;
      lines = [];
      line = null;
      return result;
    }
  };
}

// node_modules/d3-geo/src/pointEqual.js
function pointEqual_default(a, b) {
  return abs(a[0] - b[0]) < epsilon3 && abs(a[1] - b[1]) < epsilon3;
}

// node_modules/d3-geo/src/clip/rejoin.js
var Intersection = function(point, points, other, entry) {
  this.x = point;
  this.z = points;
  this.o = other;
  this.e = entry;
  this.v = false;
  this.n = this.p = null;
};
var link = function(array4) {
  if (!(n = array4.length))
    return;
  var n, i = 0, a = array4[0], b;
  while (++i < n) {
    a.n = b = array4[i];
    b.p = a;
    a = b;
  }
  a.n = b = array4[0];
  b.p = a;
};
function rejoin_default(segments, compareIntersection, startInside, interpolate3, stream) {
  var subject = [], clip = [], i, n;
  segments.forEach(function(segment) {
    if ((n2 = segment.length - 1) <= 0)
      return;
    var n2, p0 = segment[0], p1 = segment[n2], x;
    if (pointEqual_default(p0, p1)) {
      if (!p0[2] && !p1[2]) {
        stream.lineStart();
        for (i = 0;i < n2; ++i)
          stream.point((p0 = segment[i])[0], p0[1]);
        stream.lineEnd();
        return;
      }
      p1[0] += 2 * epsilon3;
    }
    subject.push(x = new Intersection(p0, segment, null, true));
    clip.push(x.o = new Intersection(p0, null, x, false));
    subject.push(x = new Intersection(p1, segment, null, false));
    clip.push(x.o = new Intersection(p1, null, x, true));
  });
  if (!subject.length)
    return;
  clip.sort(compareIntersection);
  link(subject);
  link(clip);
  for (i = 0, n = clip.length;i < n; ++i) {
    clip[i].e = startInside = !startInside;
  }
  var start2 = subject[0], points, point;
  while (true) {
    var current = start2, isSubject = true;
    while (current.v)
      if ((current = current.n) === start2)
        return;
    points = current.z;
    stream.lineStart();
    do {
      current.v = current.o.v = true;
      if (current.e) {
        if (isSubject) {
          for (i = 0, n = points.length;i < n; ++i)
            stream.point((point = points[i])[0], point[1]);
        } else {
          interpolate3(current.x, current.n.x, 1, stream);
        }
        current = current.n;
      } else {
        if (isSubject) {
          points = current.p.z;
          for (i = points.length - 1;i >= 0; --i)
            stream.point((point = points[i])[0], point[1]);
        } else {
          interpolate3(current.x, current.p.x, -1, stream);
        }
        current = current.p;
      }
      current = current.o;
      points = current.z;
      isSubject = !isSubject;
    } while (!current.v);
    stream.lineEnd();
  }
}

// node_modules/d3-geo/src/polygonContains.js
var longitude = function(point) {
  return abs(point[0]) <= pi2 ? point[0] : sign(point[0]) * ((abs(point[0]) + pi2) % tau2 - pi2);
};
function polygonContains_default(polygon, point) {
  var lambda = longitude(point), phi = point[1], sinPhi = sin(phi), normal = [sin(lambda), -cos(lambda), 0], angle = 0, winding = 0;
  var sum4 = new Adder;
  if (sinPhi === 1)
    phi = halfPi + epsilon3;
  else if (sinPhi === -1)
    phi = -halfPi - epsilon3;
  for (var i = 0, n = polygon.length;i < n; ++i) {
    if (!(m = (ring = polygon[i]).length))
      continue;
    var ring, m, point0 = ring[m - 1], lambda0 = longitude(point0), phi0 = point0[1] / 2 + quarterPi, sinPhi0 = sin(phi0), cosPhi0 = cos(phi0);
    for (var j = 0;j < m; ++j, lambda0 = lambda1, sinPhi0 = sinPhi1, cosPhi0 = cosPhi1, point0 = point1) {
      var point1 = ring[j], lambda1 = longitude(point1), phi1 = point1[1] / 2 + quarterPi, sinPhi1 = sin(phi1), cosPhi1 = cos(phi1), delta = lambda1 - lambda0, sign2 = delta >= 0 ? 1 : -1, absDelta = sign2 * delta, antimeridian = absDelta > pi2, k = sinPhi0 * sinPhi1;
      sum4.add(atan2(k * sign2 * sin(absDelta), cosPhi0 * cosPhi1 + k * cos(absDelta)));
      angle += antimeridian ? delta + sign2 * tau2 : delta;
      if (antimeridian ^ lambda0 >= lambda ^ lambda1 >= lambda) {
        var arc = cartesianCross(cartesian(point0), cartesian(point1));
        cartesianNormalizeInPlace(arc);
        var intersection = cartesianCross(normal, arc);
        cartesianNormalizeInPlace(intersection);
        var phiArc = (antimeridian ^ delta >= 0 ? -1 : 1) * asin(intersection[2]);
        if (phi > phiArc || phi === phiArc && (arc[0] || arc[1])) {
          winding += antimeridian ^ delta >= 0 ? 1 : -1;
        }
      }
    }
  }
  return (angle < -epsilon3 || angle < epsilon3 && sum4 < -epsilon22) ^ winding & 1;
}

// node_modules/d3-geo/src/clip/index.js
var validSegment = function(segment) {
  return segment.length > 1;
};
var compareIntersection = function(a, b) {
  return ((a = a.x)[0] < 0 ? a[1] - halfPi - epsilon3 : halfPi - a[1]) - ((b = b.x)[0] < 0 ? b[1] - halfPi - epsilon3 : halfPi - b[1]);
};
function clip_default(pointVisible, clipLine, interpolate3, start2) {
  return function(sink) {
    var line = clipLine(sink), ringBuffer = buffer_default(), ringSink = clipLine(ringBuffer), polygonStarted = false, polygon, segments, ring;
    var clip = {
      point,
      lineStart,
      lineEnd,
      polygonStart: function() {
        clip.point = pointRing;
        clip.lineStart = ringStart;
        clip.lineEnd = ringEnd;
        segments = [];
        polygon = [];
      },
      polygonEnd: function() {
        clip.point = point;
        clip.lineStart = lineStart;
        clip.lineEnd = lineEnd;
        segments = merge(segments);
        var startInside = polygonContains_default(polygon, start2);
        if (segments.length) {
          if (!polygonStarted)
            sink.polygonStart(), polygonStarted = true;
          rejoin_default(segments, compareIntersection, startInside, interpolate3, sink);
        } else if (startInside) {
          if (!polygonStarted)
            sink.polygonStart(), polygonStarted = true;
          sink.lineStart();
          interpolate3(null, null, 1, sink);
          sink.lineEnd();
        }
        if (polygonStarted)
          sink.polygonEnd(), polygonStarted = false;
        segments = polygon = null;
      },
      sphere: function() {
        sink.polygonStart();
        sink.lineStart();
        interpolate3(null, null, 1, sink);
        sink.lineEnd();
        sink.polygonEnd();
      }
    };
    function point(lambda, phi) {
      if (pointVisible(lambda, phi))
        sink.point(lambda, phi);
    }
    function pointLine(lambda, phi) {
      line.point(lambda, phi);
    }
    function lineStart() {
      clip.point = pointLine;
      line.lineStart();
    }
    function lineEnd() {
      clip.point = point;
      line.lineEnd();
    }
    function pointRing(lambda, phi) {
      ring.push([lambda, phi]);
      ringSink.point(lambda, phi);
    }
    function ringStart() {
      ringSink.lineStart();
      ring = [];
    }
    function ringEnd() {
      pointRing(ring[0][0], ring[0][1]);
      ringSink.lineEnd();
      var clean = ringSink.clean(), ringSegments = ringBuffer.result(), i, n = ringSegments.length, m, segment, point2;
      ring.pop();
      polygon.push(ring);
      ring = null;
      if (!n)
        return;
      if (clean & 1) {
        segment = ringSegments[0];
        if ((m = segment.length - 1) > 0) {
          if (!polygonStarted)
            sink.polygonStart(), polygonStarted = true;
          sink.lineStart();
          for (i = 0;i < m; ++i)
            sink.point((point2 = segment[i])[0], point2[1]);
          sink.lineEnd();
        }
        return;
      }
      if (n > 1 && clean & 2)
        ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));
      segments.push(ringSegments.filter(validSegment));
    }
    return clip;
  };
}

// node_modules/d3-geo/src/clip/antimeridian.js
var clipAntimeridianLine = function(stream) {
  var lambda0 = NaN, phi0 = NaN, sign0 = NaN, clean;
  return {
    lineStart: function() {
      stream.lineStart();
      clean = 1;
    },
    point: function(lambda1, phi1) {
      var sign1 = lambda1 > 0 ? pi2 : -pi2, delta = abs(lambda1 - lambda0);
      if (abs(delta - pi2) < epsilon3) {
        stream.point(lambda0, phi0 = (phi0 + phi1) / 2 > 0 ? halfPi : -halfPi);
        stream.point(sign0, phi0);
        stream.lineEnd();
        stream.lineStart();
        stream.point(sign1, phi0);
        stream.point(lambda1, phi0);
        clean = 0;
      } else if (sign0 !== sign1 && delta >= pi2) {
        if (abs(lambda0 - sign0) < epsilon3)
          lambda0 -= sign0 * epsilon3;
        if (abs(lambda1 - sign1) < epsilon3)
          lambda1 -= sign1 * epsilon3;
        phi0 = clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1);
        stream.point(sign0, phi0);
        stream.lineEnd();
        stream.lineStart();
        stream.point(sign1, phi0);
        clean = 0;
      }
      stream.point(lambda0 = lambda1, phi0 = phi1);
      sign0 = sign1;
    },
    lineEnd: function() {
      stream.lineEnd();
      lambda0 = phi0 = NaN;
    },
    clean: function() {
      return 2 - clean;
    }
  };
};
var clipAntimeridianIntersect = function(lambda0, phi0, lambda1, phi1) {
  var cosPhi0, cosPhi1, sinLambda0Lambda1 = sin(lambda0 - lambda1);
  return abs(sinLambda0Lambda1) > epsilon3 ? atan((sin(phi0) * (cosPhi1 = cos(phi1)) * sin(lambda1) - sin(phi1) * (cosPhi0 = cos(phi0)) * sin(lambda0)) / (cosPhi0 * cosPhi1 * sinLambda0Lambda1)) : (phi0 + phi1) / 2;
};
var clipAntimeridianInterpolate = function(from, to, direction, stream) {
  var phi;
  if (from == null) {
    phi = direction * halfPi;
    stream.point(-pi2, phi);
    stream.point(0, phi);
    stream.point(pi2, phi);
    stream.point(pi2, 0);
    stream.point(pi2, -phi);
    stream.point(0, -phi);
    stream.point(-pi2, -phi);
    stream.point(-pi2, 0);
    stream.point(-pi2, phi);
  } else if (abs(from[0] - to[0]) > epsilon3) {
    var lambda = from[0] < to[0] ? pi2 : -pi2;
    phi = direction * lambda / 2;
    stream.point(-lambda, phi);
    stream.point(0, phi);
    stream.point(lambda, phi);
  } else {
    stream.point(to[0], to[1]);
  }
};
var antimeridian_default = clip_default(function() {
  return true;
}, clipAntimeridianLine, clipAntimeridianInterpolate, [-pi2, -halfPi]);

// node_modules/d3-geo/src/clip/circle.js
function circle_default(radius) {
  var cr = cos(radius), delta = 6 * radians2, smallRadius = cr > 0, notHemisphere = abs(cr) > epsilon3;
  function interpolate3(from, to, direction, stream) {
    circleStream(stream, radius, delta, direction, from, to);
  }
  function visible(lambda, phi) {
    return cos(lambda) * cos(phi) > cr;
  }
  function clipLine(stream) {
    var point0, c0, v0, v00, clean;
    return {
      lineStart: function() {
        v00 = v0 = false;
        clean = 1;
      },
      point: function(lambda, phi) {
        var point1 = [lambda, phi], point2, v = visible(lambda, phi), c = smallRadius ? v ? 0 : code(lambda, phi) : v ? code(lambda + (lambda < 0 ? pi2 : -pi2), phi) : 0;
        if (!point0 && (v00 = v0 = v))
          stream.lineStart();
        if (v !== v0) {
          point2 = intersect(point0, point1);
          if (!point2 || pointEqual_default(point0, point2) || pointEqual_default(point1, point2))
            point1[2] = 1;
        }
        if (v !== v0) {
          clean = 0;
          if (v) {
            stream.lineStart();
            point2 = intersect(point1, point0);
            stream.point(point2[0], point2[1]);
          } else {
            point2 = intersect(point0, point1);
            stream.point(point2[0], point2[1], 2);
            stream.lineEnd();
          }
          point0 = point2;
        } else if (notHemisphere && point0 && smallRadius ^ v) {
          var t;
          if (!(c & c0) && (t = intersect(point1, point0, true))) {
            clean = 0;
            if (smallRadius) {
              stream.lineStart();
              stream.point(t[0][0], t[0][1]);
              stream.point(t[1][0], t[1][1]);
              stream.lineEnd();
            } else {
              stream.point(t[1][0], t[1][1]);
              stream.lineEnd();
              stream.lineStart();
              stream.point(t[0][0], t[0][1], 3);
            }
          }
        }
        if (v && (!point0 || !pointEqual_default(point0, point1))) {
          stream.point(point1[0], point1[1]);
        }
        point0 = point1, v0 = v, c0 = c;
      },
      lineEnd: function() {
        if (v0)
          stream.lineEnd();
        point0 = null;
      },
      clean: function() {
        return clean | (v00 && v0) << 1;
      }
    };
  }
  function intersect(a, b, two) {
    var pa = cartesian(a), pb = cartesian(b);
    var n1 = [1, 0, 0], n2 = cartesianCross(pa, pb), n2n2 = cartesianDot(n2, n2), n1n2 = n2[0], determinant = n2n2 - n1n2 * n1n2;
    if (!determinant)
      return !two && a;
    var c1 = cr * n2n2 / determinant, c2 = -cr * n1n2 / determinant, n1xn2 = cartesianCross(n1, n2), A2 = cartesianScale(n1, c1), B2 = cartesianScale(n2, c2);
    cartesianAddInPlace(A2, B2);
    var u = n1xn2, w = cartesianDot(A2, u), uu = cartesianDot(u, u), t22 = w * w - uu * (cartesianDot(A2, A2) - 1);
    if (t22 < 0)
      return;
    var t = sqrt(t22), q = cartesianScale(u, (-w - t) / uu);
    cartesianAddInPlace(q, A2);
    q = spherical(q);
    if (!two)
      return q;
    var lambda0 = a[0], lambda1 = b[0], phi0 = a[1], phi1 = b[1], z;
    if (lambda1 < lambda0)
      z = lambda0, lambda0 = lambda1, lambda1 = z;
    var delta2 = lambda1 - lambda0, polar = abs(delta2 - pi2) < epsilon3, meridian = polar || delta2 < epsilon3;
    if (!polar && phi1 < phi0)
      z = phi0, phi0 = phi1, phi1 = z;
    if (meridian ? polar ? phi0 + phi1 > 0 ^ q[1] < (abs(q[0] - lambda0) < epsilon3 ? phi0 : phi1) : phi0 <= q[1] && q[1] <= phi1 : delta2 > pi2 ^ (lambda0 <= q[0] && q[0] <= lambda1)) {
      var q1 = cartesianScale(u, (-w + t) / uu);
      cartesianAddInPlace(q1, A2);
      return [q, spherical(q1)];
    }
  }
  function code(lambda, phi) {
    var r = smallRadius ? radius : pi2 - radius, code2 = 0;
    if (lambda < -r)
      code2 |= 1;
    else if (lambda > r)
      code2 |= 2;
    if (phi < -r)
      code2 |= 4;
    else if (phi > r)
      code2 |= 8;
    return code2;
  }
  return clip_default(visible, clipLine, interpolate3, smallRadius ? [0, -radius] : [-pi2, radius - pi2]);
}

// node_modules/d3-geo/src/clip/line.js
function line_default(a, b, x0, y0, x1, y1) {
  var ax = a[0], ay = a[1], bx = b[0], by = b[1], t02 = 0, t12 = 1, dx = bx - ax, dy = by - ay, r;
  r = x0 - ax;
  if (!dx && r > 0)
    return;
  r /= dx;
  if (dx < 0) {
    if (r < t02)
      return;
    if (r < t12)
      t12 = r;
  } else if (dx > 0) {
    if (r > t12)
      return;
    if (r > t02)
      t02 = r;
  }
  r = x1 - ax;
  if (!dx && r < 0)
    return;
  r /= dx;
  if (dx < 0) {
    if (r > t12)
      return;
    if (r > t02)
      t02 = r;
  } else if (dx > 0) {
    if (r < t02)
      return;
    if (r < t12)
      t12 = r;
  }
  r = y0 - ay;
  if (!dy && r > 0)
    return;
  r /= dy;
  if (dy < 0) {
    if (r < t02)
      return;
    if (r < t12)
      t12 = r;
  } else if (dy > 0) {
    if (r > t12)
      return;
    if (r > t02)
      t02 = r;
  }
  r = y1 - ay;
  if (!dy && r < 0)
    return;
  r /= dy;
  if (dy < 0) {
    if (r > t12)
      return;
    if (r > t02)
      t02 = r;
  } else if (dy > 0) {
    if (r < t02)
      return;
    if (r < t12)
      t12 = r;
  }
  if (t02 > 0)
    a[0] = ax + t02 * dx, a[1] = ay + t02 * dy;
  if (t12 < 1)
    b[0] = ax + t12 * dx, b[1] = ay + t12 * dy;
  return true;
}

// node_modules/d3-geo/src/clip/rectangle.js
var clipMax = 1e9;
var clipMin = -clipMax;
function clipRectangle(x0, y0, x1, y1) {
  function visible(x, y) {
    return x0 <= x && x <= x1 && y0 <= y && y <= y1;
  }
  function interpolate3(from, to, direction, stream) {
    var a = 0, a1 = 0;
    if (from == null || (a = corner(from, direction)) !== (a1 = corner(to, direction)) || comparePoint(from, to) < 0 ^ direction > 0) {
      do
        stream.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);
      while ((a = (a + direction + 4) % 4) !== a1);
    } else {
      stream.point(to[0], to[1]);
    }
  }
  function corner(p, direction) {
    return abs(p[0] - x0) < epsilon3 ? direction > 0 ? 0 : 3 : abs(p[0] - x1) < epsilon3 ? direction > 0 ? 2 : 1 : abs(p[1] - y0) < epsilon3 ? direction > 0 ? 1 : 0 : direction > 0 ? 3 : 2;
  }
  function compareIntersection2(a, b) {
    return comparePoint(a.x, b.x);
  }
  function comparePoint(a, b) {
    var ca = corner(a, 1), cb = corner(b, 1);
    return ca !== cb ? ca - cb : ca === 0 ? b[1] - a[1] : ca === 1 ? a[0] - b[0] : ca === 2 ? a[1] - b[1] : b[0] - a[0];
  }
  return function(stream) {
    var activeStream = stream, bufferStream = buffer_default(), segments, polygon, ring, x__, y__, v__, x_, y_, v_, first, clean;
    var clipStream = {
      point,
      lineStart,
      lineEnd,
      polygonStart,
      polygonEnd
    };
    function point(x, y) {
      if (visible(x, y))
        activeStream.point(x, y);
    }
    function polygonInside() {
      var winding = 0;
      for (var i = 0, n = polygon.length;i < n; ++i) {
        for (var ring2 = polygon[i], j = 1, m = ring2.length, point2 = ring2[0], a0, a1, b0 = point2[0], b1 = point2[1];j < m; ++j) {
          a0 = b0, a1 = b1, point2 = ring2[j], b0 = point2[0], b1 = point2[1];
          if (a1 <= y1) {
            if (b1 > y1 && (b0 - a0) * (y1 - a1) > (b1 - a1) * (x0 - a0))
              ++winding;
          } else {
            if (b1 <= y1 && (b0 - a0) * (y1 - a1) < (b1 - a1) * (x0 - a0))
              --winding;
          }
        }
      }
      return winding;
    }
    function polygonStart() {
      activeStream = bufferStream, segments = [], polygon = [], clean = true;
    }
    function polygonEnd() {
      var startInside = polygonInside(), cleanInside = clean && startInside, visible2 = (segments = merge(segments)).length;
      if (cleanInside || visible2) {
        stream.polygonStart();
        if (cleanInside) {
          stream.lineStart();
          interpolate3(null, null, 1, stream);
          stream.lineEnd();
        }
        if (visible2) {
          rejoin_default(segments, compareIntersection2, startInside, interpolate3, stream);
        }
        stream.polygonEnd();
      }
      activeStream = stream, segments = polygon = ring = null;
    }
    function lineStart() {
      clipStream.point = linePoint;
      if (polygon)
        polygon.push(ring = []);
      first = true;
      v_ = false;
      x_ = y_ = NaN;
    }
    function lineEnd() {
      if (segments) {
        linePoint(x__, y__);
        if (v__ && v_)
          bufferStream.rejoin();
        segments.push(bufferStream.result());
      }
      clipStream.point = point;
      if (v_)
        activeStream.lineEnd();
    }
    function linePoint(x, y) {
      var v = visible(x, y);
      if (polygon)
        ring.push([x, y]);
      if (first) {
        x__ = x, y__ = y, v__ = v;
        first = false;
        if (v) {
          activeStream.lineStart();
          activeStream.point(x, y);
        }
      } else {
        if (v && v_)
          activeStream.point(x, y);
        else {
          var a = [x_ = Math.max(clipMin, Math.min(clipMax, x_)), y_ = Math.max(clipMin, Math.min(clipMax, y_))], b = [x = Math.max(clipMin, Math.min(clipMax, x)), y = Math.max(clipMin, Math.min(clipMax, y))];
          if (line_default(a, b, x0, y0, x1, y1)) {
            if (!v_) {
              activeStream.lineStart();
              activeStream.point(a[0], a[1]);
            }
            activeStream.point(b[0], b[1]);
            if (!v)
              activeStream.lineEnd();
            clean = false;
          } else if (v) {
            activeStream.lineStart();
            activeStream.point(x, y);
            clean = false;
          }
        }
      }
      x_ = x, y_ = y, v_ = v;
    }
    return clipStream;
  };
}
// node_modules/d3-geo/src/identity.js
var identity_default4 = (x) => x;

// node_modules/d3-geo/src/path/area.js
var areaRingStart = function() {
  areaStream.point = areaPointFirst;
};
var areaPointFirst = function(x, y) {
  areaStream.point = areaPoint;
  x00 = x0 = x, y00 = y0 = y;
};
var areaPoint = function(x, y) {
  areaRingSum.add(y0 * x - x0 * y);
  x0 = x, y0 = y;
};
var areaRingEnd = function() {
  areaPoint(x00, y00);
};
var areaSum = new Adder;
var areaRingSum = new Adder;
var x00;
var y00;
var x0;
var y0;
var areaStream = {
  point: noop2,
  lineStart: noop2,
  lineEnd: noop2,
  polygonStart: function() {
    areaStream.lineStart = areaRingStart;
    areaStream.lineEnd = areaRingEnd;
  },
  polygonEnd: function() {
    areaStream.lineStart = areaStream.lineEnd = areaStream.point = noop2;
    areaSum.add(abs(areaRingSum));
    areaRingSum = new Adder;
  },
  result: function() {
    var area = areaSum / 2;
    areaSum = new Adder;
    return area;
  }
};
var area_default = areaStream;

// node_modules/d3-geo/src/path/bounds.js
var boundsPoint = function(x, y) {
  if (x < x02)
    x02 = x;
  if (x > x1)
    x1 = x;
  if (y < y02)
    y02 = y;
  if (y > y1)
    y1 = y;
};
var x02 = Infinity;
var y02 = x02;
var x1 = -x02;
var y1 = x1;
var boundsStream = {
  point: boundsPoint,
  lineStart: noop2,
  lineEnd: noop2,
  polygonStart: noop2,
  polygonEnd: noop2,
  result: function() {
    var bounds = [[x02, y02], [x1, y1]];
    x1 = y1 = -(y02 = x02 = Infinity);
    return bounds;
  }
};
var bounds_default = boundsStream;

// node_modules/d3-geo/src/path/centroid.js
var centroidPoint = function(x, y) {
  X0 += x;
  Y0 += y;
  ++Z0;
};
var centroidLineStart = function() {
  centroidStream.point = centroidPointFirstLine;
};
var centroidPointFirstLine = function(x, y) {
  centroidStream.point = centroidPointLine;
  centroidPoint(x03 = x, y03 = y);
};
var centroidPointLine = function(x, y) {
  var dx = x - x03, dy = y - y03, z = sqrt(dx * dx + dy * dy);
  X1 += z * (x03 + x) / 2;
  Y1 += z * (y03 + y) / 2;
  Z1 += z;
  centroidPoint(x03 = x, y03 = y);
};
var centroidLineEnd = function() {
  centroidStream.point = centroidPoint;
};
var centroidRingStart = function() {
  centroidStream.point = centroidPointFirstRing;
};
var centroidRingEnd = function() {
  centroidPointRing(x002, y002);
};
var centroidPointFirstRing = function(x, y) {
  centroidStream.point = centroidPointRing;
  centroidPoint(x002 = x03 = x, y002 = y03 = y);
};
var centroidPointRing = function(x, y) {
  var dx = x - x03, dy = y - y03, z = sqrt(dx * dx + dy * dy);
  X1 += z * (x03 + x) / 2;
  Y1 += z * (y03 + y) / 2;
  Z1 += z;
  z = y03 * x - x03 * y;
  X2 += z * (x03 + x);
  Y2 += z * (y03 + y);
  Z2 += z * 3;
  centroidPoint(x03 = x, y03 = y);
};
var X0 = 0;
var Y0 = 0;
var Z0 = 0;
var X1 = 0;
var Y1 = 0;
var Z1 = 0;
var X2 = 0;
var Y2 = 0;
var Z2 = 0;
var x002;
var y002;
var x03;
var y03;
var centroidStream = {
  point: centroidPoint,
  lineStart: centroidLineStart,
  lineEnd: centroidLineEnd,
  polygonStart: function() {
    centroidStream.lineStart = centroidRingStart;
    centroidStream.lineEnd = centroidRingEnd;
  },
  polygonEnd: function() {
    centroidStream.point = centroidPoint;
    centroidStream.lineStart = centroidLineStart;
    centroidStream.lineEnd = centroidLineEnd;
  },
  result: function() {
    var centroid = Z2 ? [X2 / Z2, Y2 / Z2] : Z1 ? [X1 / Z1, Y1 / Z1] : Z0 ? [X0 / Z0, Y0 / Z0] : [NaN, NaN];
    X0 = Y0 = Z0 = X1 = Y1 = Z1 = X2 = Y2 = Z2 = 0;
    return centroid;
  }
};
var centroid_default = centroidStream;

// node_modules/d3-geo/src/path/context.js
function PathContext(context) {
  this._context = context;
}
PathContext.prototype = {
  _radius: 4.5,
  pointRadius: function(_) {
    return this._radius = _, this;
  },
  polygonStart: function() {
    this._line = 0;
  },
  polygonEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line === 0)
      this._context.closePath();
    this._point = NaN;
  },
  point: function(x, y) {
    switch (this._point) {
      case 0: {
        this._context.moveTo(x, y);
        this._point = 1;
        break;
      }
      case 1: {
        this._context.lineTo(x, y);
        break;
      }
      default: {
        this._context.moveTo(x + this._radius, y);
        this._context.arc(x, y, this._radius, 0, tau2);
        break;
      }
    }
  },
  result: noop2
};

// node_modules/d3-geo/src/path/measure.js
var lengthPointFirst = function(x, y) {
  lengthStream.point = lengthPoint;
  x003 = x04 = x, y003 = y04 = y;
};
var lengthPoint = function(x, y) {
  x04 -= x, y04 -= y;
  lengthSum.add(sqrt(x04 * x04 + y04 * y04));
  x04 = x, y04 = y;
};
var lengthSum = new Adder;
var lengthRing;
var x003;
var y003;
var x04;
var y04;
var lengthStream = {
  point: noop2,
  lineStart: function() {
    lengthStream.point = lengthPointFirst;
  },
  lineEnd: function() {
    if (lengthRing)
      lengthPoint(x003, y003);
    lengthStream.point = noop2;
  },
  polygonStart: function() {
    lengthRing = true;
  },
  polygonEnd: function() {
    lengthRing = null;
  },
  result: function() {
    var length2 = +lengthSum;
    lengthSum = new Adder;
    return length2;
  }
};
var measure_default = lengthStream;

// node_modules/d3-geo/src/path/string.js
var append3 = function(strings) {
  let i = 1;
  this._ += strings[0];
  for (const j = strings.length;i < j; ++i) {
    this._ += arguments[i] + strings[i];
  }
};
var appendRound2 = function(digits) {
  const d = Math.floor(digits);
  if (!(d >= 0))
    throw new RangeError(`invalid digits: ${digits}`);
  if (d > 15)
    return append3;
  if (d !== cacheDigits) {
    const k = 10 ** d;
    cacheDigits = d;
    cacheAppend = function append(strings) {
      let i = 1;
      this._ += strings[0];
      for (const j = strings.length;i < j; ++i) {
        this._ += Math.round(arguments[i] * k) / k + strings[i];
      }
    };
  }
  return cacheAppend;
};
var cacheDigits;
var cacheAppend;
var cacheRadius;
var cacheCircle;

class PathString {
  constructor(digits) {
    this._append = digits == null ? append3 : appendRound2(digits);
    this._radius = 4.5;
    this._ = "";
  }
  pointRadius(_) {
    this._radius = +_;
    return this;
  }
  polygonStart() {
    this._line = 0;
  }
  polygonEnd() {
    this._line = NaN;
  }
  lineStart() {
    this._point = 0;
  }
  lineEnd() {
    if (this._line === 0)
      this._ += "Z";
    this._point = NaN;
  }
  point(x, y) {
    switch (this._point) {
      case 0: {
        this._append`M${x},${y}`;
        this._point = 1;
        break;
      }
      case 1: {
        this._append`L${x},${y}`;
        break;
      }
      default: {
        this._append`M${x},${y}`;
        if (this._radius !== cacheRadius || this._append !== cacheAppend) {
          const r = this._radius;
          const s = this._;
          this._ = "";
          this._append`m0,${r}a${r},${r} 0 1,1 0,${-2 * r}a${r},${r} 0 1,1 0,${2 * r}z`;
          cacheRadius = r;
          cacheAppend = this._append;
          cacheCircle = this._;
          this._ = s;
        }
        this._ += cacheCircle;
        break;
      }
    }
  }
  result() {
    const result = this._;
    this._ = "";
    return result.length ? result : null;
  }
}

// node_modules/d3-geo/src/path/index.js
function path_default(projection, context2) {
  let digits = 3, pointRadius = 4.5, projectionStream, contextStream;
  function path2(object2) {
    if (object2) {
      if (typeof pointRadius === "function")
        contextStream.pointRadius(+pointRadius.apply(this, arguments));
      stream_default(object2, projectionStream(contextStream));
    }
    return contextStream.result();
  }
  path2.area = function(object2) {
    stream_default(object2, projectionStream(area_default));
    return area_default.result();
  };
  path2.measure = function(object2) {
    stream_default(object2, projectionStream(measure_default));
    return measure_default.result();
  };
  path2.bounds = function(object2) {
    stream_default(object2, projectionStream(bounds_default));
    return bounds_default.result();
  };
  path2.centroid = function(object2) {
    stream_default(object2, projectionStream(centroid_default));
    return centroid_default.result();
  };
  path2.projection = function(_) {
    if (!arguments.length)
      return projection;
    projectionStream = _ == null ? (projection = null, identity_default4) : (projection = _).stream;
    return path2;
  };
  path2.context = function(_) {
    if (!arguments.length)
      return context2;
    contextStream = _ == null ? (context2 = null, new PathString(digits)) : new PathContext(context2 = _);
    if (typeof pointRadius !== "function")
      contextStream.pointRadius(pointRadius);
    return path2;
  };
  path2.pointRadius = function(_) {
    if (!arguments.length)
      return pointRadius;
    pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
    return path2;
  };
  path2.digits = function(_) {
    if (!arguments.length)
      return digits;
    if (_ == null)
      digits = null;
    else {
      const d = Math.floor(_);
      if (!(d >= 0))
        throw new RangeError(`invalid digits: ${_}`);
      digits = d;
    }
    if (context2 === null)
      contextStream = new PathString(digits);
    return path2;
  };
  return path2.projection(projection).digits(digits).context(context2);
}
// node_modules/d3-geo/src/transform.js
function transformer(methods) {
  return function(stream2) {
    var s = new TransformStream;
    for (var key in methods)
      s[key] = methods[key];
    s.stream = stream2;
    return s;
  };
}
var TransformStream = function() {
};
function transform_default(methods) {
  return {
    stream: transformer(methods)
  };
}
TransformStream.prototype = {
  constructor: TransformStream,
  point: function(x, y) {
    this.stream.point(x, y);
  },
  sphere: function() {
    this.stream.sphere();
  },
  lineStart: function() {
    this.stream.lineStart();
  },
  lineEnd: function() {
    this.stream.lineEnd();
  },
  polygonStart: function() {
    this.stream.polygonStart();
  },
  polygonEnd: function() {
    this.stream.polygonEnd();
  }
};

// node_modules/d3-geo/src/projection/fit.js
var fit = function(projection, fitBounds, object2) {
  var clip = projection.clipExtent && projection.clipExtent();
  projection.scale(150).translate([0, 0]);
  if (clip != null)
    projection.clipExtent(null);
  stream_default(object2, projection.stream(bounds_default));
  fitBounds(bounds_default.result());
  if (clip != null)
    projection.clipExtent(clip);
  return projection;
};
function fitExtent(projection, extent2, object2) {
  return fit(projection, function(b) {
    var w = extent2[1][0] - extent2[0][0], h = extent2[1][1] - extent2[0][1], k = Math.min(w / (b[1][0] - b[0][0]), h / (b[1][1] - b[0][1])), x = +extent2[0][0] + (w - k * (b[1][0] + b[0][0])) / 2, y = +extent2[0][1] + (h - k * (b[1][1] + b[0][1])) / 2;
    projection.scale(150 * k).translate([x, y]);
  }, object2);
}
function fitSize(projection, size2, object2) {
  return fitExtent(projection, [[0, 0], size2], object2);
}
function fitWidth(projection, width, object2) {
  return fit(projection, function(b) {
    var w = +width, k = w / (b[1][0] - b[0][0]), x = (w - k * (b[1][0] + b[0][0])) / 2, y = -k * b[0][1];
    projection.scale(150 * k).translate([x, y]);
  }, object2);
}
function fitHeight(projection, height, object2) {
  return fit(projection, function(b) {
    var h = +height, k = h / (b[1][1] - b[0][1]), x = -k * b[0][0], y = (h - k * (b[1][1] + b[0][1])) / 2;
    projection.scale(150 * k).translate([x, y]);
  }, object2);
}

// node_modules/d3-geo/src/projection/resample.js
var resampleNone = function(project) {
  return transformer({
    point: function(x, y) {
      x = project(x, y);
      this.stream.point(x[0], x[1]);
    }
  });
};
var resample = function(project, delta2) {
  function resampleLineTo(x05, y05, lambda0, a0, b0, c0, x12, y12, lambda1, a1, b1, c1, depth, stream3) {
    var dx = x12 - x05, dy = y12 - y05, d2 = dx * dx + dy * dy;
    if (d2 > 4 * delta2 && depth--) {
      var a = a0 + a1, b = b0 + b1, c = c0 + c1, m = sqrt(a * a + b * b + c * c), phi2 = asin(c /= m), lambda2 = abs(abs(c) - 1) < epsilon3 || abs(lambda0 - lambda1) < epsilon3 ? (lambda0 + lambda1) / 2 : atan2(b, a), p = project(lambda2, phi2), x2 = p[0], y2 = p[1], dx2 = x2 - x05, dy2 = y2 - y05, dz = dy * dx2 - dx * dy2;
      if (dz * dz / d2 > delta2 || abs((dx * dx2 + dy * dy2) / d2 - 0.5) > 0.3 || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) {
        resampleLineTo(x05, y05, lambda0, a0, b0, c0, x2, y2, lambda2, a /= m, b /= m, c, depth, stream3);
        stream3.point(x2, y2);
        resampleLineTo(x2, y2, lambda2, a, b, c, x12, y12, lambda1, a1, b1, c1, depth, stream3);
      }
    }
  }
  return function(stream3) {
    var lambda00, x004, y004, a00, b00, c00, lambda0, x05, y05, a0, b0, c0;
    var resampleStream = {
      point,
      lineStart,
      lineEnd,
      polygonStart: function() {
        stream3.polygonStart();
        resampleStream.lineStart = ringStart;
      },
      polygonEnd: function() {
        stream3.polygonEnd();
        resampleStream.lineStart = lineStart;
      }
    };
    function point(x, y) {
      x = project(x, y);
      stream3.point(x[0], x[1]);
    }
    function lineStart() {
      x05 = NaN;
      resampleStream.point = linePoint;
      stream3.lineStart();
    }
    function linePoint(lambda, phi) {
      var c = cartesian([lambda, phi]), p = project(lambda, phi);
      resampleLineTo(x05, y05, lambda0, a0, b0, c0, x05 = p[0], y05 = p[1], lambda0 = lambda, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream3);
      stream3.point(x05, y05);
    }
    function lineEnd() {
      resampleStream.point = point;
      stream3.lineEnd();
    }
    function ringStart() {
      lineStart();
      resampleStream.point = ringPoint;
      resampleStream.lineEnd = ringEnd;
    }
    function ringPoint(lambda, phi) {
      linePoint(lambda00 = lambda, phi), x004 = x05, y004 = y05, a00 = a0, b00 = b0, c00 = c0;
      resampleStream.point = linePoint;
    }
    function ringEnd() {
      resampleLineTo(x05, y05, lambda0, a0, b0, c0, x004, y004, lambda00, a00, b00, c00, maxDepth, stream3);
      resampleStream.lineEnd = lineEnd;
      lineEnd();
    }
    return resampleStream;
  };
};
var maxDepth = 16;
var cosMinDistance = cos(30 * radians2);
function resample_default(project, delta2) {
  return +delta2 ? resample(project, delta2) : resampleNone(project);
}

// node_modules/d3-geo/src/projection/index.js
var transformRotate = function(rotate) {
  return transformer({
    point: function(x, y) {
      var r = rotate(x, y);
      return this.stream.point(r[0], r[1]);
    }
  });
};
var scaleTranslate = function(k, dx, dy, sx, sy) {
  function transform3(x, y) {
    x *= sx;
    y *= sy;
    return [dx + k * x, dy - k * y];
  }
  transform3.invert = function(x, y) {
    return [(x - dx) / k * sx, (dy - y) / k * sy];
  };
  return transform3;
};
var scaleTranslateRotate = function(k, dx, dy, sx, sy, alpha) {
  if (!alpha)
    return scaleTranslate(k, dx, dy, sx, sy);
  var cosAlpha = cos(alpha), sinAlpha = sin(alpha), a = cosAlpha * k, b = sinAlpha * k, ai = cosAlpha / k, bi = sinAlpha / k, ci = (sinAlpha * dy - cosAlpha * dx) / k, fi = (sinAlpha * dx + cosAlpha * dy) / k;
  function transform3(x, y) {
    x *= sx;
    y *= sy;
    return [a * x - b * y + dx, dy - b * x - a * y];
  }
  transform3.invert = function(x, y) {
    return [sx * (ai * x - bi * y + ci), sy * (fi - bi * x - ai * y)];
  };
  return transform3;
};
function projectionMutator(projectAt) {
  var project, k = 150, x = 480, y = 250, lambda = 0, phi = 0, deltaLambda = 0, deltaPhi = 0, deltaGamma = 0, rotate, alpha = 0, sx = 1, sy = 1, theta = null, preclip = antimeridian_default, x05 = null, y05, x12, y12, postclip = identity_default4, delta2 = 0.5, projectResample, projectTransform, projectRotateTransform, cache, cacheStream;
  function projection(point) {
    return projectRotateTransform(point[0] * radians2, point[1] * radians2);
  }
  function invert(point) {
    point = projectRotateTransform.invert(point[0], point[1]);
    return point && [point[0] * degrees3, point[1] * degrees3];
  }
  projection.stream = function(stream3) {
    return cache && cacheStream === stream3 ? cache : cache = transformRadians(transformRotate(rotate)(preclip(projectResample(postclip(cacheStream = stream3)))));
  };
  projection.preclip = function(_) {
    return arguments.length ? (preclip = _, theta = undefined, reset()) : preclip;
  };
  projection.postclip = function(_) {
    return arguments.length ? (postclip = _, x05 = y05 = x12 = y12 = null, reset()) : postclip;
  };
  projection.clipAngle = function(_) {
    return arguments.length ? (preclip = +_ ? circle_default(theta = _ * radians2) : (theta = null, antimeridian_default), reset()) : theta * degrees3;
  };
  projection.clipExtent = function(_) {
    return arguments.length ? (postclip = _ == null ? (x05 = y05 = x12 = y12 = null, identity_default4) : clipRectangle(x05 = +_[0][0], y05 = +_[0][1], x12 = +_[1][0], y12 = +_[1][1]), reset()) : x05 == null ? null : [[x05, y05], [x12, y12]];
  };
  projection.scale = function(_) {
    return arguments.length ? (k = +_, recenter()) : k;
  };
  projection.translate = function(_) {
    return arguments.length ? (x = +_[0], y = +_[1], recenter()) : [x, y];
  };
  projection.center = function(_) {
    return arguments.length ? (lambda = _[0] % 360 * radians2, phi = _[1] % 360 * radians2, recenter()) : [lambda * degrees3, phi * degrees3];
  };
  projection.rotate = function(_) {
    return arguments.length ? (deltaLambda = _[0] % 360 * radians2, deltaPhi = _[1] % 360 * radians2, deltaGamma = _.length > 2 ? _[2] % 360 * radians2 : 0, recenter()) : [deltaLambda * degrees3, deltaPhi * degrees3, deltaGamma * degrees3];
  };
  projection.angle = function(_) {
    return arguments.length ? (alpha = _ % 360 * radians2, recenter()) : alpha * degrees3;
  };
  projection.reflectX = function(_) {
    return arguments.length ? (sx = _ ? -1 : 1, recenter()) : sx < 0;
  };
  projection.reflectY = function(_) {
    return arguments.length ? (sy = _ ? -1 : 1, recenter()) : sy < 0;
  };
  projection.precision = function(_) {
    return arguments.length ? (projectResample = resample_default(projectTransform, delta2 = _ * _), reset()) : sqrt(delta2);
  };
  projection.fitExtent = function(extent2, object2) {
    return fitExtent(projection, extent2, object2);
  };
  projection.fitSize = function(size2, object2) {
    return fitSize(projection, size2, object2);
  };
  projection.fitWidth = function(width, object2) {
    return fitWidth(projection, width, object2);
  };
  projection.fitHeight = function(height, object2) {
    return fitHeight(projection, height, object2);
  };
  function recenter() {
    var center2 = scaleTranslateRotate(k, 0, 0, sx, sy, alpha).apply(null, project(lambda, phi)), transform3 = scaleTranslateRotate(k, x - center2[0], y - center2[1], sx, sy, alpha);
    rotate = rotateRadians(deltaLambda, deltaPhi, deltaGamma);
    projectTransform = compose_default(project, transform3);
    projectRotateTransform = compose_default(rotate, projectTransform);
    projectResample = resample_default(projectTransform, delta2);
    return reset();
  }
  function reset() {
    cache = cacheStream = null;
    return projection;
  }
  return function() {
    project = projectAt.apply(this, arguments);
    projection.invert = project.invert && invert;
    return recenter();
  };
}
var transformRadians = transformer({
  point: function(x, y) {
    this.stream.point(x * radians2, y * radians2);
  }
});
function projection(project) {
  return projectionMutator(function() {
    return project;
  })();
}

// node_modules/d3-geo/src/projection/conic.js
function conicProjection(projectAt) {
  var phi0 = 0, phi1 = pi2 / 3, m = projectionMutator(projectAt), p = m(phi0, phi1);
  p.parallels = function(_) {
    return arguments.length ? m(phi0 = _[0] * radians2, phi1 = _[1] * radians2) : [phi0 * degrees3, phi1 * degrees3];
  };
  return p;
}

// node_modules/d3-geo/src/projection/cylindricalEqualArea.js
function cylindricalEqualAreaRaw(phi0) {
  var cosPhi0 = cos(phi0);
  function forward(lambda, phi) {
    return [lambda * cosPhi0, sin(phi) / cosPhi0];
  }
  forward.invert = function(x, y) {
    return [x / cosPhi0, asin(y * cosPhi0)];
  };
  return forward;
}

// node_modules/d3-geo/src/projection/conicEqualArea.js
function conicEqualAreaRaw(y05, y12) {
  var sy0 = sin(y05), n = (sy0 + sin(y12)) / 2;
  if (abs(n) < epsilon3)
    return cylindricalEqualAreaRaw(y05);
  var c = 1 + sy0 * (2 * n - sy0), r0 = sqrt(c) / n;
  function project(x, y) {
    var r = sqrt(c - 2 * n * sin(y)) / n;
    return [r * sin(x *= n), r0 - r * cos(x)];
  }
  project.invert = function(x, y) {
    var r0y = r0 - y, l = atan2(x, abs(r0y)) * sign(r0y);
    if (r0y * n < 0)
      l -= pi2 * sign(x) * sign(r0y);
    return [l / n, asin((c - (x * x + r0y * r0y) * n * n) / (2 * n))];
  };
  return project;
}
function conicEqualArea_default() {
  return conicProjection(conicEqualAreaRaw).scale(155.424).center([0, 33.6442]);
}

// node_modules/d3-geo/src/projection/albers.js
function albers_default() {
  return conicEqualArea_default().parallels([29.5, 45.5]).scale(1070).translate([480, 250]).rotate([96, 0]).center([-0.6, 38.7]);
}
// node_modules/d3-geo/src/projection/albersUsa.js
var multiplex = function(streams) {
  var n = streams.length;
  return {
    point: function(x, y) {
      var i = -1;
      while (++i < n)
        streams[i].point(x, y);
    },
    sphere: function() {
      var i = -1;
      while (++i < n)
        streams[i].sphere();
    },
    lineStart: function() {
      var i = -1;
      while (++i < n)
        streams[i].lineStart();
    },
    lineEnd: function() {
      var i = -1;
      while (++i < n)
        streams[i].lineEnd();
    },
    polygonStart: function() {
      var i = -1;
      while (++i < n)
        streams[i].polygonStart();
    },
    polygonEnd: function() {
      var i = -1;
      while (++i < n)
        streams[i].polygonEnd();
    }
  };
};
function albersUsa_default() {
  var cache, cacheStream, lower48 = albers_default(), lower48Point, alaska = conicEqualArea_default().rotate([154, 0]).center([-2, 58.5]).parallels([55, 65]), alaskaPoint, hawaii = conicEqualArea_default().rotate([157, 0]).center([-3, 19.9]).parallels([8, 18]), hawaiiPoint, point, pointStream = { point: function(x, y) {
    point = [x, y];
  } };
  function albersUsa(coordinates) {
    var x = coordinates[0], y = coordinates[1];
    return point = null, (lower48Point.point(x, y), point) || (alaskaPoint.point(x, y), point) || (hawaiiPoint.point(x, y), point);
  }
  albersUsa.invert = function(coordinates) {
    var k = lower48.scale(), t = lower48.translate(), x = (coordinates[0] - t[0]) / k, y = (coordinates[1] - t[1]) / k;
    return (y >= 0.12 && y < 0.234 && x >= -0.425 && x < -0.214 ? alaska : y >= 0.166 && y < 0.234 && x >= -0.214 && x < -0.115 ? hawaii : lower48).invert(coordinates);
  };
  albersUsa.stream = function(stream3) {
    return cache && cacheStream === stream3 ? cache : cache = multiplex([lower48.stream(cacheStream = stream3), alaska.stream(stream3), hawaii.stream(stream3)]);
  };
  albersUsa.precision = function(_) {
    if (!arguments.length)
      return lower48.precision();
    lower48.precision(_), alaska.precision(_), hawaii.precision(_);
    return reset();
  };
  albersUsa.scale = function(_) {
    if (!arguments.length)
      return lower48.scale();
    lower48.scale(_), alaska.scale(_ * 0.35), hawaii.scale(_);
    return albersUsa.translate(lower48.translate());
  };
  albersUsa.translate = function(_) {
    if (!arguments.length)
      return lower48.translate();
    var k = lower48.scale(), x = +_[0], y = +_[1];
    lower48Point = lower48.translate(_).clipExtent([[x - 0.455 * k, y - 0.238 * k], [x + 0.455 * k, y + 0.238 * k]]).stream(pointStream);
    alaskaPoint = alaska.translate([x - 0.307 * k, y + 0.201 * k]).clipExtent([[x - 0.425 * k + epsilon3, y + 0.12 * k + epsilon3], [x - 0.214 * k - epsilon3, y + 0.234 * k - epsilon3]]).stream(pointStream);
    hawaiiPoint = hawaii.translate([x - 0.205 * k, y + 0.212 * k]).clipExtent([[x - 0.214 * k + epsilon3, y + 0.166 * k + epsilon3], [x - 0.115 * k - epsilon3, y + 0.234 * k - epsilon3]]).stream(pointStream);
    return reset();
  };
  albersUsa.fitExtent = function(extent2, object2) {
    return fitExtent(albersUsa, extent2, object2);
  };
  albersUsa.fitSize = function(size2, object2) {
    return fitSize(albersUsa, size2, object2);
  };
  albersUsa.fitWidth = function(width, object2) {
    return fitWidth(albersUsa, width, object2);
  };
  albersUsa.fitHeight = function(height, object2) {
    return fitHeight(albersUsa, height, object2);
  };
  function reset() {
    cache = cacheStream = null;
    return albersUsa;
  }
  return albersUsa.scale(1070);
}
// node_modules/d3-geo/src/projection/azimuthal.js
function azimuthalRaw(scale) {
  return function(x, y) {
    var cx = cos(x), cy = cos(y), k = scale(cx * cy);
    if (k === Infinity)
      return [2, 0];
    return [
      k * cy * sin(x),
      k * sin(y)
    ];
  };
}
function azimuthalInvert(angle) {
  return function(x, y) {
    var z = sqrt(x * x + y * y), c = angle(z), sc = sin(c), cc = cos(c);
    return [
      atan2(x * sc, z * cc),
      asin(z && y * sc / z)
    ];
  };
}

// node_modules/d3-geo/src/projection/azimuthalEqualArea.js
var azimuthalEqualAreaRaw = azimuthalRaw(function(cxcy) {
  return sqrt(2 / (1 + cxcy));
});
azimuthalEqualAreaRaw.invert = azimuthalInvert(function(z) {
  return 2 * asin(z / 2);
});
function azimuthalEqualArea_default() {
  return projection(azimuthalEqualAreaRaw).scale(124.75).clipAngle(180 - 0.001);
}
// node_modules/d3-geo/src/projection/azimuthalEquidistant.js
var azimuthalEquidistantRaw = azimuthalRaw(function(c) {
  return (c = acos(c)) && c / sin(c);
});
azimuthalEquidistantRaw.invert = azimuthalInvert(function(z) {
  return z;
});
function azimuthalEquidistant_default() {
  return projection(azimuthalEquidistantRaw).scale(79.4188).clipAngle(180 - 0.001);
}
// node_modules/d3-geo/src/projection/mercator.js
function mercatorRaw(lambda, phi) {
  return [lambda, log2(tan((halfPi + phi) / 2))];
}
function mercatorProjection(project) {
  var m = projection(project), center2 = m.center, scale = m.scale, translate = m.translate, clipExtent = m.clipExtent, x05 = null, y05, x12, y12;
  m.scale = function(_) {
    return arguments.length ? (scale(_), reclip()) : scale();
  };
  m.translate = function(_) {
    return arguments.length ? (translate(_), reclip()) : translate();
  };
  m.center = function(_) {
    return arguments.length ? (center2(_), reclip()) : center2();
  };
  m.clipExtent = function(_) {
    return arguments.length ? (_ == null ? x05 = y05 = x12 = y12 = null : (x05 = +_[0][0], y05 = +_[0][1], x12 = +_[1][0], y12 = +_[1][1]), reclip()) : x05 == null ? null : [[x05, y05], [x12, y12]];
  };
  function reclip() {
    var k = pi2 * scale(), t = m(rotation_default(m.rotate()).invert([0, 0]));
    return clipExtent(x05 == null ? [[t[0] - k, t[1] - k], [t[0] + k, t[1] + k]] : project === mercatorRaw ? [[Math.max(t[0] - k, x05), y05], [Math.min(t[0] + k, x12), y12]] : [[x05, Math.max(t[1] - k, y05)], [x12, Math.min(t[1] + k, y12)]]);
  }
  return reclip();
}
mercatorRaw.invert = function(x, y) {
  return [x, 2 * atan(exp2(y)) - halfPi];
};
function mercator_default() {
  return mercatorProjection(mercatorRaw).scale(961 / tau2);
}

// node_modules/d3-geo/src/projection/conicConformal.js
var tany = function(y) {
  return tan((halfPi + y) / 2);
};
function conicConformalRaw(y05, y12) {
  var cy0 = cos(y05), n = y05 === y12 ? sin(y05) : log2(cy0 / cos(y12)) / log2(tany(y12) / tany(y05)), f = cy0 * pow(tany(y05), n) / n;
  if (!n)
    return mercatorRaw;
  function project(x, y) {
    if (f > 0) {
      if (y < -halfPi + epsilon3)
        y = -halfPi + epsilon3;
    } else {
      if (y > halfPi - epsilon3)
        y = halfPi - epsilon3;
    }
    var r = f / pow(tany(y), n);
    return [r * sin(n * x), f - r * cos(n * x)];
  }
  project.invert = function(x, y) {
    var fy = f - y, r = sign(n) * sqrt(x * x + fy * fy), l = atan2(x, abs(fy)) * sign(fy);
    if (fy * n < 0)
      l -= pi2 * sign(x) * sign(fy);
    return [l / n, 2 * atan(pow(f / r, 1 / n)) - halfPi];
  };
  return project;
}
function conicConformal_default() {
  return conicProjection(conicConformalRaw).scale(109.5).parallels([30, 30]);
}
// node_modules/d3-geo/src/projection/equirectangular.js
function equirectangularRaw(lambda, phi) {
  return [lambda, phi];
}
equirectangularRaw.invert = equirectangularRaw;
function equirectangular_default() {
  return projection(equirectangularRaw).scale(152.63);
}

// node_modules/d3-geo/src/projection/conicEquidistant.js
function conicEquidistantRaw(y05, y12) {
  var cy0 = cos(y05), n = y05 === y12 ? sin(y05) : (cy0 - cos(y12)) / (y12 - y05), g = cy0 / n + y05;
  if (abs(n) < epsilon3)
    return equirectangularRaw;
  function project(x, y) {
    var gy = g - y, nx = n * x;
    return [gy * sin(nx), g - gy * cos(nx)];
  }
  project.invert = function(x, y) {
    var gy = g - y, l = atan2(x, abs(gy)) * sign(gy);
    if (gy * n < 0)
      l -= pi2 * sign(x) * sign(gy);
    return [l / n, g - sign(n) * sqrt(x * x + gy * gy)];
  };
  return project;
}
function conicEquidistant_default() {
  return conicProjection(conicEquidistantRaw).scale(131.154).center([0, 13.9389]);
}
// node_modules/d3-geo/src/projection/equalEarth.js
function equalEarthRaw(lambda, phi) {
  var l = asin(M * sin(phi)), l2 = l * l, l6 = l2 * l2 * l2;
  return [
    lambda * cos(l) / (M * (A1 + 3 * A2 * l2 + l6 * (7 * A3 + 9 * A4 * l2))),
    l * (A1 + A2 * l2 + l6 * (A3 + A4 * l2))
  ];
}
var A1 = 1.340264;
var A2 = -0.081106;
var A3 = 0.000893;
var A4 = 0.003796;
var M = sqrt(3) / 2;
var iterations = 12;
equalEarthRaw.invert = function(x, y) {
  var l = y, l2 = l * l, l6 = l2 * l2 * l2;
  for (var i = 0, delta, fy, fpy;i < iterations; ++i) {
    fy = l * (A1 + A2 * l2 + l6 * (A3 + A4 * l2)) - y;
    fpy = A1 + 3 * A2 * l2 + l6 * (7 * A3 + 9 * A4 * l2);
    l -= delta = fy / fpy, l2 = l * l, l6 = l2 * l2 * l2;
    if (abs(delta) < epsilon22)
      break;
  }
  return [
    M * x * (A1 + 3 * A2 * l2 + l6 * (7 * A3 + 9 * A4 * l2)) / cos(l),
    asin(sin(l) / M)
  ];
};
function equalEarth_default() {
  return projection(equalEarthRaw).scale(177.158);
}
// node_modules/d3-geo/src/projection/gnomonic.js
function gnomonicRaw(x, y) {
  var cy = cos(y), k = cos(x) * cy;
  return [cy * sin(x) / k, sin(y) / k];
}
gnomonicRaw.invert = azimuthalInvert(atan);
function gnomonic_default() {
  return projection(gnomonicRaw).scale(144.049).clipAngle(60);
}
// node_modules/d3-geo/src/projection/orthographic.js
function orthographicRaw(x, y) {
  return [cos(y) * sin(x), sin(y)];
}
orthographicRaw.invert = azimuthalInvert(asin);
function orthographic_default() {
  return projection(orthographicRaw).scale(249.5).clipAngle(90 + epsilon3);
}
// node_modules/d3-geo/src/projection/stereographic.js
function stereographicRaw(x, y) {
  var cy = cos(y), k = 1 + cos(x) * cy;
  return [cy * sin(x) / k, sin(y) / k];
}
stereographicRaw.invert = azimuthalInvert(function(z) {
  return 2 * atan(z);
});
function stereographic_default() {
  return projection(stereographicRaw).scale(250).clipAngle(142);
}
// node_modules/d3-geo/src/projection/transverseMercator.js
function transverseMercatorRaw(lambda, phi) {
  return [log2(tan((halfPi + phi) / 2)), -lambda];
}
transverseMercatorRaw.invert = function(x, y) {
  return [-y, 2 * atan(exp2(x)) - halfPi];
};
function transverseMercator_default() {
  var m = mercatorProjection(transverseMercatorRaw), center2 = m.center, rotate = m.rotate;
  m.center = function(_) {
    return arguments.length ? center2([-_[1], _[0]]) : (_ = center2(), [_[1], -_[0]]);
  };
  m.rotate = function(_) {
    return arguments.length ? rotate([_[0], _[1], _.length > 2 ? _[2] + 90 : 90]) : (_ = rotate(), [_[0], _[1], _[2] - 90]);
  };
  return rotate([0, 0, 90]).scale(159.155);
}
// node_modules/d3-scale/src/init.js
function initRange(domain, range4) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(domain);
      break;
    default:
      this.range(range4).domain(domain);
      break;
  }
  return this;
}
function initInterpolator(domain, interpolator) {
  switch (arguments.length) {
    case 0:
      break;
    case 1: {
      if (typeof domain === "function")
        this.interpolator(domain);
      else
        this.range(domain);
      break;
    }
    default: {
      this.domain(domain);
      if (typeof interpolator === "function")
        this.interpolator(interpolator);
      else
        this.range(interpolator);
      break;
    }
  }
  return this;
}

// node_modules/d3-scale/src/ordinal.js
var implicit = Symbol("implicit");
function ordinal() {
  var index2 = new InternMap, domain = [], range4 = [], unknown = implicit;
  function scale(d) {
    let i = index2.get(d);
    if (i === undefined) {
      if (unknown !== implicit)
        return unknown;
      index2.set(d, i = domain.push(d) - 1);
    }
    return range4[i % range4.length];
  }
  scale.domain = function(_) {
    if (!arguments.length)
      return domain.slice();
    domain = [], index2 = new InternMap;
    for (const value5 of _) {
      if (index2.has(value5))
        continue;
      index2.set(value5, domain.push(value5) - 1);
    }
    return scale;
  };
  scale.range = function(_) {
    return arguments.length ? (range4 = Array.from(_), scale) : range4.slice();
  };
  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };
  scale.copy = function() {
    return ordinal(domain, range4).unknown(unknown);
  };
  initRange.apply(scale, arguments);
  return scale;
}

// node_modules/d3-scale/src/band.js
var pointish = function(scale) {
  var copy = scale.copy;
  scale.padding = scale.paddingOuter;
  delete scale.paddingInner;
  delete scale.paddingOuter;
  scale.copy = function() {
    return pointish(copy());
  };
  return scale;
};
function point() {
  return pointish(band.apply(null, arguments).paddingInner(1));
}
function band() {
  var scale = ordinal().unknown(undefined), domain = scale.domain, ordinalRange = scale.range, r0 = 0, r1 = 1, step, bandwidth, round = false, paddingInner = 0, paddingOuter = 0, align = 0.5;
  delete scale.unknown;
  function rescale() {
    var n = domain().length, reverse2 = r1 < r0, start2 = reverse2 ? r1 : r0, stop = reverse2 ? r0 : r1;
    step = (stop - start2) / Math.max(1, n - paddingInner + paddingOuter * 2);
    if (round)
      step = Math.floor(step);
    start2 += (stop - start2 - step * (n - paddingInner)) * align;
    bandwidth = step * (1 - paddingInner);
    if (round)
      start2 = Math.round(start2), bandwidth = Math.round(bandwidth);
    var values3 = range3(n).map(function(i) {
      return start2 + step * i;
    });
    return ordinalRange(reverse2 ? values3.reverse() : values3);
  }
  scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };
  scale.range = function(_) {
    return arguments.length ? ([r0, r1] = _, r0 = +r0, r1 = +r1, rescale()) : [r0, r1];
  };
  scale.rangeRound = function(_) {
    return [r0, r1] = _, r0 = +r0, r1 = +r1, round = true, rescale();
  };
  scale.bandwidth = function() {
    return bandwidth;
  };
  scale.step = function() {
    return step;
  };
  scale.round = function(_) {
    return arguments.length ? (round = !!_, rescale()) : round;
  };
  scale.padding = function(_) {
    return arguments.length ? (paddingInner = Math.min(1, paddingOuter = +_), rescale()) : paddingInner;
  };
  scale.paddingInner = function(_) {
    return arguments.length ? (paddingInner = Math.min(1, _), rescale()) : paddingInner;
  };
  scale.paddingOuter = function(_) {
    return arguments.length ? (paddingOuter = +_, rescale()) : paddingOuter;
  };
  scale.align = function(_) {
    return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
  };
  scale.copy = function() {
    return band(domain(), [r0, r1]).round(round).paddingInner(paddingInner).paddingOuter(paddingOuter).align(align);
  };
  return initRange.apply(rescale(), arguments);
}
// node_modules/d3-scale/src/constant.js
function constants(x) {
  return function() {
    return x;
  };
}

// node_modules/d3-scale/src/number.js
function number8(x) {
  return +x;
}

// node_modules/d3-scale/src/continuous.js
function identity10(x) {
  return x;
}
var normalize = function(a, b) {
  return (b -= a = +a) ? function(x) {
    return (x - a) / b;
  } : constants(isNaN(b) ? NaN : 0.5);
};
var clamper = function(a, b) {
  var t;
  if (a > b)
    t = a, a = b, b = t;
  return function(x) {
    return Math.max(a, Math.min(b, x));
  };
};
var bimap = function(domain, range4, interpolate3) {
  var d0 = domain[0], d1 = domain[1], r0 = range4[0], r1 = range4[1];
  if (d1 < d0)
    d0 = normalize(d1, d0), r0 = interpolate3(r1, r0);
  else
    d0 = normalize(d0, d1), r0 = interpolate3(r0, r1);
  return function(x) {
    return r0(d0(x));
  };
};
var polymap = function(domain, range4, interpolate3) {
  var j = Math.min(domain.length, range4.length) - 1, d = new Array(j), r = new Array(j), i = -1;
  if (domain[j] < domain[0]) {
    domain = domain.slice().reverse();
    range4 = range4.slice().reverse();
  }
  while (++i < j) {
    d[i] = normalize(domain[i], domain[i + 1]);
    r[i] = interpolate3(range4[i], range4[i + 1]);
  }
  return function(x) {
    var i2 = bisect_default(domain, x, 1, j) - 1;
    return r[i2](d[i2](x));
  };
};
function copy(source, target) {
  return target.domain(source.domain()).range(source.range()).interpolate(source.interpolate()).clamp(source.clamp()).unknown(source.unknown());
}
function transformer2() {
  var domain = unit, range4 = unit, interpolate3 = value_default, transform3, untransform, unknown, clamp = identity10, piecewise2, output, input;
  function rescale() {
    var n = Math.min(domain.length, range4.length);
    if (clamp !== identity10)
      clamp = clamper(domain[0], domain[n - 1]);
    piecewise2 = n > 2 ? polymap : bimap;
    output = input = null;
    return scale;
  }
  function scale(x) {
    return x == null || isNaN(x = +x) ? unknown : (output || (output = piecewise2(domain.map(transform3), range4, interpolate3)))(transform3(clamp(x)));
  }
  scale.invert = function(y) {
    return clamp(untransform((input || (input = piecewise2(range4, domain.map(transform3), number_default)))(y)));
  };
  scale.domain = function(_) {
    return arguments.length ? (domain = Array.from(_, number8), rescale()) : domain.slice();
  };
  scale.range = function(_) {
    return arguments.length ? (range4 = Array.from(_), rescale()) : range4.slice();
  };
  scale.rangeRound = function(_) {
    return range4 = Array.from(_), interpolate3 = round_default, rescale();
  };
  scale.clamp = function(_) {
    return arguments.length ? (clamp = _ ? true : identity10, rescale()) : clamp !== identity10;
  };
  scale.interpolate = function(_) {
    return arguments.length ? (interpolate3 = _, rescale()) : interpolate3;
  };
  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };
  return function(t, u) {
    transform3 = t, untransform = u;
    return rescale();
  };
}
var unit = [0, 1];
function continuous() {
  return transformer2()(identity10, identity10);
}

// node_modules/d3-scale/src/tickFormat.js
function tickFormat(start2, stop, count5, specifier) {
  var step = tickStep(start2, stop, count5), precision;
  specifier = formatSpecifier(specifier == null ? ",f" : specifier);
  switch (specifier.type) {
    case "s": {
      var value5 = Math.max(Math.abs(start2), Math.abs(stop));
      if (specifier.precision == null && !isNaN(precision = precisionPrefix_default(step, value5)))
        specifier.precision = precision;
      return formatPrefix(specifier, value5);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      if (specifier.precision == null && !isNaN(precision = precisionRound_default(step, Math.max(Math.abs(start2), Math.abs(stop)))))
        specifier.precision = precision - (specifier.type === "e");
      break;
    }
    case "f":
    case "%": {
      if (specifier.precision == null && !isNaN(precision = precisionFixed_default(step)))
        specifier.precision = precision - (specifier.type === "%") * 2;
      break;
    }
  }
  return format(specifier);
}

// node_modules/d3-scale/src/linear.js
function linearish(scale) {
  var domain = scale.domain;
  scale.ticks = function(count5) {
    var d = domain();
    return ticks(d[0], d[d.length - 1], count5 == null ? 10 : count5);
  };
  scale.tickFormat = function(count5, specifier) {
    var d = domain();
    return tickFormat(d[0], d[d.length - 1], count5 == null ? 10 : count5, specifier);
  };
  scale.nice = function(count5) {
    if (count5 == null)
      count5 = 10;
    var d = domain();
    var i0 = 0;
    var i1 = d.length - 1;
    var start2 = d[i0];
    var stop = d[i1];
    var prestep;
    var step;
    var maxIter = 10;
    if (stop < start2) {
      step = start2, start2 = stop, stop = step;
      step = i0, i0 = i1, i1 = step;
    }
    while (maxIter-- > 0) {
      step = tickIncrement(start2, stop, count5);
      if (step === prestep) {
        d[i0] = start2;
        d[i1] = stop;
        return domain(d);
      } else if (step > 0) {
        start2 = Math.floor(start2 / step) * step;
        stop = Math.ceil(stop / step) * step;
      } else if (step < 0) {
        start2 = Math.ceil(start2 * step) / step;
        stop = Math.floor(stop * step) / step;
      } else {
        break;
      }
      prestep = step;
    }
    return scale;
  };
  return scale;
}
function linear2() {
  var scale = continuous();
  scale.copy = function() {
    return copy(scale, linear2());
  };
  initRange.apply(scale, arguments);
  return linearish(scale);
}

// node_modules/d3-scale/src/identity.js
function identity11(domain) {
  var unknown;
  function scale(x) {
    return x == null || isNaN(x = +x) ? unknown : x;
  }
  scale.invert = scale;
  scale.domain = scale.range = function(_) {
    return arguments.length ? (domain = Array.from(_, number8), scale) : domain.slice();
  };
  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };
  scale.copy = function() {
    return identity11(domain).unknown(unknown);
  };
  domain = arguments.length ? Array.from(domain, number8) : [0, 1];
  return linearish(scale);
}
// node_modules/d3-scale/src/nice.js
function nice(domain, interval2) {
  domain = domain.slice();
  var i0 = 0, i1 = domain.length - 1, x05 = domain[i0], x12 = domain[i1], t;
  if (x12 < x05) {
    t = i0, i0 = i1, i1 = t;
    t = x05, x05 = x12, x12 = t;
  }
  domain[i0] = interval2.floor(x05);
  domain[i1] = interval2.ceil(x12);
  return domain;
}

// node_modules/d3-scale/src/log.js
var transformLog = function(x) {
  return Math.log(x);
};
var transformExp = function(x) {
  return Math.exp(x);
};
var transformLogn = function(x) {
  return -Math.log(-x);
};
var transformExpn = function(x) {
  return -Math.exp(-x);
};
var pow10 = function(x) {
  return isFinite(x) ? +("1e" + x) : x < 0 ? 0 : x;
};
var powp = function(base) {
  return base === 10 ? pow10 : base === Math.E ? Math.exp : (x) => Math.pow(base, x);
};
var logp = function(base) {
  return base === Math.E ? Math.log : base === 10 && Math.log10 || base === 2 && Math.log2 || (base = Math.log(base), (x) => Math.log(x) / base);
};
var reflect = function(f) {
  return (x, k) => -f(-x, k);
};
function loggish(transform3) {
  const scale = transform3(transformLog, transformExp);
  const domain = scale.domain;
  let base = 10;
  let logs;
  let pows;
  function rescale() {
    logs = logp(base), pows = powp(base);
    if (domain()[0] < 0) {
      logs = reflect(logs), pows = reflect(pows);
      transform3(transformLogn, transformExpn);
    } else {
      transform3(transformLog, transformExp);
    }
    return scale;
  }
  scale.base = function(_) {
    return arguments.length ? (base = +_, rescale()) : base;
  };
  scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };
  scale.ticks = (count5) => {
    const d = domain();
    let u = d[0];
    let v = d[d.length - 1];
    const r = v < u;
    if (r)
      [u, v] = [v, u];
    let i = logs(u);
    let j = logs(v);
    let k;
    let t;
    const n = count5 == null ? 10 : +count5;
    let z = [];
    if (!(base % 1) && j - i < n) {
      i = Math.floor(i), j = Math.ceil(j);
      if (u > 0)
        for (;i <= j; ++i) {
          for (k = 1;k < base; ++k) {
            t = i < 0 ? k / pows(-i) : k * pows(i);
            if (t < u)
              continue;
            if (t > v)
              break;
            z.push(t);
          }
        }
      else
        for (;i <= j; ++i) {
          for (k = base - 1;k >= 1; --k) {
            t = i > 0 ? k / pows(-i) : k * pows(i);
            if (t < u)
              continue;
            if (t > v)
              break;
            z.push(t);
          }
        }
      if (z.length * 2 < n)
        z = ticks(u, v, n);
    } else {
      z = ticks(i, j, Math.min(j - i, n)).map(pows);
    }
    return r ? z.reverse() : z;
  };
  scale.tickFormat = (count5, specifier) => {
    if (count5 == null)
      count5 = 10;
    if (specifier == null)
      specifier = base === 10 ? "s" : ",";
    if (typeof specifier !== "function") {
      if (!(base % 1) && (specifier = formatSpecifier(specifier)).precision == null)
        specifier.trim = true;
      specifier = format(specifier);
    }
    if (count5 === Infinity)
      return specifier;
    const k = Math.max(1, base * count5 / scale.ticks().length);
    return (d) => {
      let i = d / pows(Math.round(logs(d)));
      if (i * base < base - 0.5)
        i *= base;
      return i <= k ? specifier(d) : "";
    };
  };
  scale.nice = () => {
    return domain(nice(domain(), {
      floor: (x) => pows(Math.floor(logs(x))),
      ceil: (x) => pows(Math.ceil(logs(x)))
    }));
  };
  return scale;
}
function log3() {
  const scale = loggish(transformer2()).domain([1, 10]);
  scale.copy = () => copy(scale, log3()).base(scale.base());
  initRange.apply(scale, arguments);
  return scale;
}
// node_modules/d3-scale/src/symlog.js
var transformSymlog = function(c) {
  return function(x) {
    return Math.sign(x) * Math.log1p(Math.abs(x / c));
  };
};
var transformSymexp = function(c) {
  return function(x) {
    return Math.sign(x) * Math.expm1(Math.abs(x)) * c;
  };
};
function symlogish(transform3) {
  var c = 1, scale = transform3(transformSymlog(c), transformSymexp(c));
  scale.constant = function(_) {
    return arguments.length ? transform3(transformSymlog(c = +_), transformSymexp(c)) : c;
  };
  return linearish(scale);
}
function symlog() {
  var scale = symlogish(transformer2());
  scale.copy = function() {
    return copy(scale, symlog()).constant(scale.constant());
  };
  return initRange.apply(scale, arguments);
}
// node_modules/d3-scale/src/pow.js
var transformPow = function(exponent5) {
  return function(x) {
    return x < 0 ? -Math.pow(-x, exponent5) : Math.pow(x, exponent5);
  };
};
var transformSqrt = function(x) {
  return x < 0 ? -Math.sqrt(-x) : Math.sqrt(x);
};
var transformSquare = function(x) {
  return x < 0 ? -x * x : x * x;
};
function powish(transform3) {
  var scale = transform3(identity10, identity10), exponent5 = 1;
  function rescale() {
    return exponent5 === 1 ? transform3(identity10, identity10) : exponent5 === 0.5 ? transform3(transformSqrt, transformSquare) : transform3(transformPow(exponent5), transformPow(1 / exponent5));
  }
  scale.exponent = function(_) {
    return arguments.length ? (exponent5 = +_, rescale()) : exponent5;
  };
  return linearish(scale);
}
function pow2() {
  var scale = powish(transformer2());
  scale.copy = function() {
    return copy(scale, pow2()).exponent(scale.exponent());
  };
  initRange.apply(scale, arguments);
  return scale;
}
// node_modules/d3-scale/src/quantile.js
function quantile4() {
  var domain = [], range4 = [], thresholds = [], unknown;
  function rescale() {
    var i = 0, n = Math.max(1, range4.length);
    thresholds = new Array(n - 1);
    while (++i < n)
      thresholds[i - 1] = quantileSorted(domain, i / n);
    return scale;
  }
  function scale(x) {
    return x == null || isNaN(x = +x) ? unknown : range4[bisect_default(thresholds, x)];
  }
  scale.invertExtent = function(y) {
    var i = range4.indexOf(y);
    return i < 0 ? [NaN, NaN] : [
      i > 0 ? thresholds[i - 1] : domain[0],
      i < thresholds.length ? thresholds[i] : domain[domain.length - 1]
    ];
  };
  scale.domain = function(_) {
    if (!arguments.length)
      return domain.slice();
    domain = [];
    for (let d of _)
      if (d != null && !isNaN(d = +d))
        domain.push(d);
    domain.sort(ascending);
    return rescale();
  };
  scale.range = function(_) {
    return arguments.length ? (range4 = Array.from(_), rescale()) : range4.slice();
  };
  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };
  scale.quantiles = function() {
    return thresholds.slice();
  };
  scale.copy = function() {
    return quantile4().domain(domain).range(range4).unknown(unknown);
  };
  return initRange.apply(scale, arguments);
}
// node_modules/d3-scale/src/threshold.js
function threshold() {
  var domain = [0.5], range4 = [0, 1], unknown, n = 1;
  function scale(x) {
    return x != null && x <= x ? range4[bisect_default(domain, x, 0, n)] : unknown;
  }
  scale.domain = function(_) {
    return arguments.length ? (domain = Array.from(_), n = Math.min(domain.length, range4.length - 1), scale) : domain.slice();
  };
  scale.range = function(_) {
    return arguments.length ? (range4 = Array.from(_), n = Math.min(domain.length, range4.length - 1), scale) : range4.slice();
  };
  scale.invertExtent = function(y) {
    var i = range4.indexOf(y);
    return [domain[i - 1], domain[i]];
  };
  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };
  scale.copy = function() {
    return threshold().domain(domain).range(range4).unknown(unknown);
  };
  return initRange.apply(scale, arguments);
}
// node_modules/d3-time/src/interval.js
function timeInterval(floori, offseti, count5, field) {
  function interval2(date2) {
    return floori(date2 = arguments.length === 0 ? new Date : new Date(+date2)), date2;
  }
  interval2.floor = (date2) => {
    return floori(date2 = new Date(+date2)), date2;
  };
  interval2.ceil = (date2) => {
    return floori(date2 = new Date(date2 - 1)), offseti(date2, 1), floori(date2), date2;
  };
  interval2.round = (date2) => {
    const d0 = interval2(date2), d1 = interval2.ceil(date2);
    return date2 - d0 < d1 - date2 ? d0 : d1;
  };
  interval2.offset = (date2, step) => {
    return offseti(date2 = new Date(+date2), step == null ? 1 : Math.floor(step)), date2;
  };
  interval2.range = (start2, stop, step) => {
    const range4 = [];
    start2 = interval2.ceil(start2);
    step = step == null ? 1 : Math.floor(step);
    if (!(start2 < stop) || !(step > 0))
      return range4;
    let previous;
    do
      range4.push(previous = new Date(+start2)), offseti(start2, step), floori(start2);
    while (previous < start2 && start2 < stop);
    return range4;
  };
  interval2.filter = (test) => {
    return timeInterval((date2) => {
      if (date2 >= date2)
        while (floori(date2), !test(date2))
          date2.setTime(date2 - 1);
    }, (date2, step) => {
      if (date2 >= date2) {
        if (step < 0)
          while (++step <= 0) {
            while (offseti(date2, -1), !test(date2)) {
            }
          }
        else
          while (--step >= 0) {
            while (offseti(date2, 1), !test(date2)) {
            }
          }
      }
    });
  };
  if (count5) {
    interval2.count = (start2, end2) => {
      t02.setTime(+start2), t12.setTime(+end2);
      floori(t02), floori(t12);
      return Math.floor(count5(t02, t12));
    };
    interval2.every = (step) => {
      step = Math.floor(step);
      return !isFinite(step) || !(step > 0) ? null : !(step > 1) ? interval2 : interval2.filter(field ? (d) => field(d) % step === 0 : (d) => interval2.count(0, d) % step === 0);
    };
  }
  return interval2;
}
var t02 = new Date;
var t12 = new Date;

// node_modules/d3-time/src/millisecond.js
var millisecond = timeInterval(() => {
}, (date2, step) => {
  date2.setTime(+date2 + step);
}, (start2, end2) => {
  return end2 - start2;
});
millisecond.every = (k) => {
  k = Math.floor(k);
  if (!isFinite(k) || !(k > 0))
    return null;
  if (!(k > 1))
    return millisecond;
  return timeInterval((date2) => {
    date2.setTime(Math.floor(date2 / k) * k);
  }, (date2, step) => {
    date2.setTime(+date2 + step * k);
  }, (start2, end2) => {
    return (end2 - start2) / k;
  });
};
var milliseconds = millisecond.range;

// node_modules/d3-time/src/duration.js
var durationSecond = 1000;
var durationMinute = durationSecond * 60;
var durationHour = durationMinute * 60;
var durationDay = durationHour * 24;
var durationWeek = durationDay * 7;
var durationMonth = durationDay * 30;
var durationYear = durationDay * 365;

// node_modules/d3-time/src/second.js
var second = timeInterval((date2) => {
  date2.setTime(date2 - date2.getMilliseconds());
}, (date2, step) => {
  date2.setTime(+date2 + step * durationSecond);
}, (start2, end2) => {
  return (end2 - start2) / durationSecond;
}, (date2) => {
  return date2.getUTCSeconds();
});
var seconds = second.range;
// node_modules/d3-time/src/minute.js
var timeMinute = timeInterval((date2) => {
  date2.setTime(date2 - date2.getMilliseconds() - date2.getSeconds() * durationSecond);
}, (date2, step) => {
  date2.setTime(+date2 + step * durationMinute);
}, (start2, end2) => {
  return (end2 - start2) / durationMinute;
}, (date2) => {
  return date2.getMinutes();
});
var timeMinutes = timeMinute.range;
var utcMinute = timeInterval((date2) => {
  date2.setUTCSeconds(0, 0);
}, (date2, step) => {
  date2.setTime(+date2 + step * durationMinute);
}, (start2, end2) => {
  return (end2 - start2) / durationMinute;
}, (date2) => {
  return date2.getUTCMinutes();
});
var utcMinutes = utcMinute.range;
// node_modules/d3-time/src/hour.js
var timeHour = timeInterval((date2) => {
  date2.setTime(date2 - date2.getMilliseconds() - date2.getSeconds() * durationSecond - date2.getMinutes() * durationMinute);
}, (date2, step) => {
  date2.setTime(+date2 + step * durationHour);
}, (start2, end2) => {
  return (end2 - start2) / durationHour;
}, (date2) => {
  return date2.getHours();
});
var timeHours = timeHour.range;
var utcHour = timeInterval((date2) => {
  date2.setUTCMinutes(0, 0, 0);
}, (date2, step) => {
  date2.setTime(+date2 + step * durationHour);
}, (start2, end2) => {
  return (end2 - start2) / durationHour;
}, (date2) => {
  return date2.getUTCHours();
});
var utcHours = utcHour.range;
// node_modules/d3-time/src/day.js
var timeDay = timeInterval((date2) => date2.setHours(0, 0, 0, 0), (date2, step) => date2.setDate(date2.getDate() + step), (start2, end2) => (end2 - start2 - (end2.getTimezoneOffset() - start2.getTimezoneOffset()) * durationMinute) / durationDay, (date2) => date2.getDate() - 1);
var timeDays = timeDay.range;
var utcDay = timeInterval((date2) => {
  date2.setUTCHours(0, 0, 0, 0);
}, (date2, step) => {
  date2.setUTCDate(date2.getUTCDate() + step);
}, (start2, end2) => {
  return (end2 - start2) / durationDay;
}, (date2) => {
  return date2.getUTCDate() - 1;
});
var utcDays = utcDay.range;
var unixDay = timeInterval((date2) => {
  date2.setUTCHours(0, 0, 0, 0);
}, (date2, step) => {
  date2.setUTCDate(date2.getUTCDate() + step);
}, (start2, end2) => {
  return (end2 - start2) / durationDay;
}, (date2) => {
  return Math.floor(date2 / durationDay);
});
var unixDays = unixDay.range;
// node_modules/d3-time/src/week.js
var timeWeekday = function(i) {
  return timeInterval((date2) => {
    date2.setDate(date2.getDate() - (date2.getDay() + 7 - i) % 7);
    date2.setHours(0, 0, 0, 0);
  }, (date2, step) => {
    date2.setDate(date2.getDate() + step * 7);
  }, (start2, end2) => {
    return (end2 - start2 - (end2.getTimezoneOffset() - start2.getTimezoneOffset()) * durationMinute) / durationWeek;
  });
};
var utcWeekday = function(i) {
  return timeInterval((date2) => {
    date2.setUTCDate(date2.getUTCDate() - (date2.getUTCDay() + 7 - i) % 7);
    date2.setUTCHours(0, 0, 0, 0);
  }, (date2, step) => {
    date2.setUTCDate(date2.getUTCDate() + step * 7);
  }, (start2, end2) => {
    return (end2 - start2) / durationWeek;
  });
};
var timeSunday = timeWeekday(0);
var timeMonday = timeWeekday(1);
var timeTuesday = timeWeekday(2);
var timeWednesday = timeWeekday(3);
var timeThursday = timeWeekday(4);
var timeFriday = timeWeekday(5);
var timeSaturday = timeWeekday(6);
var timeSundays = timeSunday.range;
var timeMondays = timeMonday.range;
var timeTuesdays = timeTuesday.range;
var timeWednesdays = timeWednesday.range;
var timeThursdays = timeThursday.range;
var timeFridays = timeFriday.range;
var timeSaturdays = timeSaturday.range;
var utcSunday = utcWeekday(0);
var utcMonday = utcWeekday(1);
var utcTuesday = utcWeekday(2);
var utcWednesday = utcWeekday(3);
var utcThursday = utcWeekday(4);
var utcFriday = utcWeekday(5);
var utcSaturday = utcWeekday(6);
var utcSundays = utcSunday.range;
var utcMondays = utcMonday.range;
var utcTuesdays = utcTuesday.range;
var utcWednesdays = utcWednesday.range;
var utcThursdays = utcThursday.range;
var utcFridays = utcFriday.range;
var utcSaturdays = utcSaturday.range;
// node_modules/d3-time/src/month.js
var timeMonth = timeInterval((date2) => {
  date2.setDate(1);
  date2.setHours(0, 0, 0, 0);
}, (date2, step) => {
  date2.setMonth(date2.getMonth() + step);
}, (start2, end2) => {
  return end2.getMonth() - start2.getMonth() + (end2.getFullYear() - start2.getFullYear()) * 12;
}, (date2) => {
  return date2.getMonth();
});
var timeMonths = timeMonth.range;
var utcMonth = timeInterval((date2) => {
  date2.setUTCDate(1);
  date2.setUTCHours(0, 0, 0, 0);
}, (date2, step) => {
  date2.setUTCMonth(date2.getUTCMonth() + step);
}, (start2, end2) => {
  return end2.getUTCMonth() - start2.getUTCMonth() + (end2.getUTCFullYear() - start2.getUTCFullYear()) * 12;
}, (date2) => {
  return date2.getUTCMonth();
});
var utcMonths = utcMonth.range;
// node_modules/d3-time/src/year.js
var timeYear = timeInterval((date2) => {
  date2.setMonth(0, 1);
  date2.setHours(0, 0, 0, 0);
}, (date2, step) => {
  date2.setFullYear(date2.getFullYear() + step);
}, (start2, end2) => {
  return end2.getFullYear() - start2.getFullYear();
}, (date2) => {
  return date2.getFullYear();
});
timeYear.every = (k) => {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : timeInterval((date2) => {
    date2.setFullYear(Math.floor(date2.getFullYear() / k) * k);
    date2.setMonth(0, 1);
    date2.setHours(0, 0, 0, 0);
  }, (date2, step) => {
    date2.setFullYear(date2.getFullYear() + step * k);
  });
};
var timeYears = timeYear.range;
var utcYear = timeInterval((date2) => {
  date2.setUTCMonth(0, 1);
  date2.setUTCHours(0, 0, 0, 0);
}, (date2, step) => {
  date2.setUTCFullYear(date2.getUTCFullYear() + step);
}, (start2, end2) => {
  return end2.getUTCFullYear() - start2.getUTCFullYear();
}, (date2) => {
  return date2.getUTCFullYear();
});
utcYear.every = (k) => {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : timeInterval((date2) => {
    date2.setUTCFullYear(Math.floor(date2.getUTCFullYear() / k) * k);
    date2.setUTCMonth(0, 1);
    date2.setUTCHours(0, 0, 0, 0);
  }, (date2, step) => {
    date2.setUTCFullYear(date2.getUTCFullYear() + step * k);
  });
};
var utcYears = utcYear.range;
// node_modules/d3-time/src/ticks.js
var ticker = function(year2, month2, week2, day2, hour2, minute2) {
  const tickIntervals = [
    [second, 1, durationSecond],
    [second, 5, 5 * durationSecond],
    [second, 15, 15 * durationSecond],
    [second, 30, 30 * durationSecond],
    [minute2, 1, durationMinute],
    [minute2, 5, 5 * durationMinute],
    [minute2, 15, 15 * durationMinute],
    [minute2, 30, 30 * durationMinute],
    [hour2, 1, durationHour],
    [hour2, 3, 3 * durationHour],
    [hour2, 6, 6 * durationHour],
    [hour2, 12, 12 * durationHour],
    [day2, 1, durationDay],
    [day2, 2, 2 * durationDay],
    [week2, 1, durationWeek],
    [month2, 1, durationMonth],
    [month2, 3, 3 * durationMonth],
    [year2, 1, durationYear]
  ];
  function ticks2(start2, stop, count5) {
    const reverse2 = stop < start2;
    if (reverse2)
      [start2, stop] = [stop, start2];
    const interval10 = count5 && typeof count5.range === "function" ? count5 : tickInterval(start2, stop, count5);
    const ticks3 = interval10 ? interval10.range(start2, +stop + 1) : [];
    return reverse2 ? ticks3.reverse() : ticks3;
  }
  function tickInterval(start2, stop, count5) {
    const target = Math.abs(stop - start2) / count5;
    const i = bisector(([, , step2]) => step2).right(tickIntervals, target);
    if (i === tickIntervals.length)
      return year2.every(tickStep(start2 / durationYear, stop / durationYear, count5));
    if (i === 0)
      return millisecond.every(Math.max(tickStep(start2, stop, count5), 1));
    const [t, step] = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
    return t.every(step);
  }
  return [ticks2, tickInterval];
};
var [utcTicks, utcTickInterval] = ticker(utcYear, utcMonth, utcSunday, unixDay, utcHour, utcMinute);
var [timeTicks, timeTickInterval] = ticker(timeYear, timeMonth, timeSunday, timeDay, timeHour, timeMinute);
// node_modules/d3-time-format/src/locale.js
var localDate = function(d) {
  if (0 <= d.y && d.y < 100) {
    var date2 = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
    date2.setFullYear(d.y);
    return date2;
  }
  return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
};
var utcDate = function(d) {
  if (0 <= d.y && d.y < 100) {
    var date2 = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
    date2.setUTCFullYear(d.y);
    return date2;
  }
  return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
};
var newDate = function(y, m, d) {
  return { y, m, d, H: 0, M: 0, S: 0, L: 0 };
};
var pad3 = function(value5, fill, width) {
  var sign2 = value5 < 0 ? "-" : "", string3 = (sign2 ? -value5 : value5) + "", length2 = string3.length;
  return sign2 + (length2 < width ? new Array(width - length2 + 1).join(fill) + string3 : string3);
};
var requote = function(s) {
  return s.replace(requoteRe, "\\$&");
};
var formatRe = function(names) {
  return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
};
var formatLookup = function(names) {
  return new Map(names.map((name, i) => [name.toLowerCase(), i]));
};
var parseWeekdayNumberSunday = function(d, string3, i) {
  var n = numberRe.exec(string3.slice(i, i + 1));
  return n ? (d.w = +n[0], i + n[0].length) : -1;
};
var parseWeekdayNumberMonday = function(d, string3, i) {
  var n = numberRe.exec(string3.slice(i, i + 1));
  return n ? (d.u = +n[0], i + n[0].length) : -1;
};
var parseWeekNumberSunday = function(d, string3, i) {
  var n = numberRe.exec(string3.slice(i, i + 2));
  return n ? (d.U = +n[0], i + n[0].length) : -1;
};
var parseWeekNumberISO = function(d, string3, i) {
  var n = numberRe.exec(string3.slice(i, i + 2));
  return n ? (d.V = +n[0], i + n[0].length) : -1;
};
var parseWeekNumberMonday = function(d, string3, i) {
  var n = numberRe.exec(string3.slice(i, i + 2));
  return n ? (d.W = +n[0], i + n[0].length) : -1;
};
var parseFullYear = function(d, string3, i) {
  var n = numberRe.exec(string3.slice(i, i + 4));
  return n ? (d.y = +n[0], i + n[0].length) : -1;
};
var parseYear = function(d, string3, i) {
  var n = numberRe.exec(string3.slice(i, i + 2));
  return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
};
var parseZone = function(d, string3, i) {
  var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string3.slice(i, i + 6));
  return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
};
var parseQuarter = function(d, string3, i) {
  var n = numberRe.exec(string3.slice(i, i + 1));
  return n ? (d.q = n[0] * 3 - 3, i + n[0].length) : -1;
};
var parseMonthNumber = function(d, string3, i) {
  var n = numberRe.exec(string3.slice(i, i + 2));
  return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
};
var parseDayOfMonth = function(d, string3, i) {
  var n = numberRe.exec(string3.slice(i, i + 2));
  return n ? (d.d = +n[0], i + n[0].length) : -1;
};
var parseDayOfYear = function(d, string3, i) {
  var n = numberRe.exec(string3.slice(i, i + 3));
  return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
};
var parseHour24 = function(d, string3, i) {
  var n = numberRe.exec(string3.slice(i, i + 2));
  return n ? (d.H = +n[0], i + n[0].length) : -1;
};
var parseMinutes = function(d, string3, i) {
  var n = numberRe.exec(string3.slice(i, i + 2));
  return n ? (d.M = +n[0], i + n[0].length) : -1;
};
var parseSeconds = function(d, string3, i) {
  var n = numberRe.exec(string3.slice(i, i + 2));
  return n ? (d.S = +n[0], i + n[0].length) : -1;
};
var parseMilliseconds = function(d, string3, i) {
  var n = numberRe.exec(string3.slice(i, i + 3));
  return n ? (d.L = +n[0], i + n[0].length) : -1;
};
var parseMicroseconds = function(d, string3, i) {
  var n = numberRe.exec(string3.slice(i, i + 6));
  return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
};
var parseLiteralPercent = function(d, string3, i) {
  var n = percentRe.exec(string3.slice(i, i + 1));
  return n ? i + n[0].length : -1;
};
var parseUnixTimestamp = function(d, string3, i) {
  var n = numberRe.exec(string3.slice(i));
  return n ? (d.Q = +n[0], i + n[0].length) : -1;
};
var parseUnixTimestampSeconds = function(d, string3, i) {
  var n = numberRe.exec(string3.slice(i));
  return n ? (d.s = +n[0], i + n[0].length) : -1;
};
var formatDayOfMonth = function(d, p) {
  return pad3(d.getDate(), p, 2);
};
var formatHour24 = function(d, p) {
  return pad3(d.getHours(), p, 2);
};
var formatHour12 = function(d, p) {
  return pad3(d.getHours() % 12 || 12, p, 2);
};
var formatDayOfYear = function(d, p) {
  return pad3(1 + timeDay.count(timeYear(d), d), p, 3);
};
var formatMilliseconds = function(d, p) {
  return pad3(d.getMilliseconds(), p, 3);
};
var formatMicroseconds = function(d, p) {
  return formatMilliseconds(d, p) + "000";
};
var formatMonthNumber = function(d, p) {
  return pad3(d.getMonth() + 1, p, 2);
};
var formatMinutes = function(d, p) {
  return pad3(d.getMinutes(), p, 2);
};
var formatSeconds = function(d, p) {
  return pad3(d.getSeconds(), p, 2);
};
var formatWeekdayNumberMonday = function(d) {
  var day2 = d.getDay();
  return day2 === 0 ? 7 : day2;
};
var formatWeekNumberSunday = function(d, p) {
  return pad3(timeSunday.count(timeYear(d) - 1, d), p, 2);
};
var dISO = function(d) {
  var day2 = d.getDay();
  return day2 >= 4 || day2 === 0 ? timeThursday(d) : timeThursday.ceil(d);
};
var formatWeekNumberISO = function(d, p) {
  d = dISO(d);
  return pad3(timeThursday.count(timeYear(d), d) + (timeYear(d).getDay() === 4), p, 2);
};
var formatWeekdayNumberSunday = function(d) {
  return d.getDay();
};
var formatWeekNumberMonday = function(d, p) {
  return pad3(timeMonday.count(timeYear(d) - 1, d), p, 2);
};
var formatYear = function(d, p) {
  return pad3(d.getFullYear() % 100, p, 2);
};
var formatYearISO = function(d, p) {
  d = dISO(d);
  return pad3(d.getFullYear() % 100, p, 2);
};
var formatFullYear = function(d, p) {
  return pad3(d.getFullYear() % 1e4, p, 4);
};
var formatFullYearISO = function(d, p) {
  var day2 = d.getDay();
  d = day2 >= 4 || day2 === 0 ? timeThursday(d) : timeThursday.ceil(d);
  return pad3(d.getFullYear() % 1e4, p, 4);
};
var formatZone = function(d) {
  var z = d.getTimezoneOffset();
  return (z > 0 ? "-" : (z *= -1, "+")) + pad3(z / 60 | 0, "0", 2) + pad3(z % 60, "0", 2);
};
var formatUTCDayOfMonth = function(d, p) {
  return pad3(d.getUTCDate(), p, 2);
};
var formatUTCHour24 = function(d, p) {
  return pad3(d.getUTCHours(), p, 2);
};
var formatUTCHour12 = function(d, p) {
  return pad3(d.getUTCHours() % 12 || 12, p, 2);
};
var formatUTCDayOfYear = function(d, p) {
  return pad3(1 + utcDay.count(utcYear(d), d), p, 3);
};
var formatUTCMilliseconds = function(d, p) {
  return pad3(d.getUTCMilliseconds(), p, 3);
};
var formatUTCMicroseconds = function(d, p) {
  return formatUTCMilliseconds(d, p) + "000";
};
var formatUTCMonthNumber = function(d, p) {
  return pad3(d.getUTCMonth() + 1, p, 2);
};
var formatUTCMinutes = function(d, p) {
  return pad3(d.getUTCMinutes(), p, 2);
};
var formatUTCSeconds = function(d, p) {
  return pad3(d.getUTCSeconds(), p, 2);
};
var formatUTCWeekdayNumberMonday = function(d) {
  var dow = d.getUTCDay();
  return dow === 0 ? 7 : dow;
};
var formatUTCWeekNumberSunday = function(d, p) {
  return pad3(utcSunday.count(utcYear(d) - 1, d), p, 2);
};
var UTCdISO = function(d) {
  var day2 = d.getUTCDay();
  return day2 >= 4 || day2 === 0 ? utcThursday(d) : utcThursday.ceil(d);
};
var formatUTCWeekNumberISO = function(d, p) {
  d = UTCdISO(d);
  return pad3(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
};
var formatUTCWeekdayNumberSunday = function(d) {
  return d.getUTCDay();
};
var formatUTCWeekNumberMonday = function(d, p) {
  return pad3(utcMonday.count(utcYear(d) - 1, d), p, 2);
};
var formatUTCYear = function(d, p) {
  return pad3(d.getUTCFullYear() % 100, p, 2);
};
var formatUTCYearISO = function(d, p) {
  d = UTCdISO(d);
  return pad3(d.getUTCFullYear() % 100, p, 2);
};
var formatUTCFullYear = function(d, p) {
  return pad3(d.getUTCFullYear() % 1e4, p, 4);
};
var formatUTCFullYearISO = function(d, p) {
  var day2 = d.getUTCDay();
  d = day2 >= 4 || day2 === 0 ? utcThursday(d) : utcThursday.ceil(d);
  return pad3(d.getUTCFullYear() % 1e4, p, 4);
};
var formatUTCZone = function() {
  return "+0000";
};
var formatLiteralPercent = function() {
  return "%";
};
var formatUnixTimestamp = function(d) {
  return +d;
};
var formatUnixTimestampSeconds = function(d) {
  return Math.floor(+d / 1000);
};
function formatLocale(locale3) {
  var { dateTime: locale_dateTime, date: locale_date, time: locale_time, periods: locale_periods, days: locale_weekdays, shortDays: locale_shortWeekdays, months: locale_months, shortMonths: locale_shortMonths } = locale3;
  var periodRe = formatRe(locale_periods), periodLookup = formatLookup(locale_periods), weekdayRe = formatRe(locale_weekdays), weekdayLookup = formatLookup(locale_weekdays), shortWeekdayRe = formatRe(locale_shortWeekdays), shortWeekdayLookup = formatLookup(locale_shortWeekdays), monthRe = formatRe(locale_months), monthLookup = formatLookup(locale_months), shortMonthRe = formatRe(locale_shortMonths), shortMonthLookup = formatLookup(locale_shortMonths);
  var formats = {
    a: formatShortWeekday,
    A: formatWeekday,
    b: formatShortMonth,
    B: formatMonth,
    c: null,
    d: formatDayOfMonth,
    e: formatDayOfMonth,
    f: formatMicroseconds,
    g: formatYearISO,
    G: formatFullYearISO,
    H: formatHour24,
    I: formatHour12,
    j: formatDayOfYear,
    L: formatMilliseconds,
    m: formatMonthNumber,
    M: formatMinutes,
    p: formatPeriod,
    q: formatQuarter,
    Q: formatUnixTimestamp,
    s: formatUnixTimestampSeconds,
    S: formatSeconds,
    u: formatWeekdayNumberMonday,
    U: formatWeekNumberSunday,
    V: formatWeekNumberISO,
    w: formatWeekdayNumberSunday,
    W: formatWeekNumberMonday,
    x: null,
    X: null,
    y: formatYear,
    Y: formatFullYear,
    Z: formatZone,
    "%": formatLiteralPercent
  };
  var utcFormats = {
    a: formatUTCShortWeekday,
    A: formatUTCWeekday,
    b: formatUTCShortMonth,
    B: formatUTCMonth,
    c: null,
    d: formatUTCDayOfMonth,
    e: formatUTCDayOfMonth,
    f: formatUTCMicroseconds,
    g: formatUTCYearISO,
    G: formatUTCFullYearISO,
    H: formatUTCHour24,
    I: formatUTCHour12,
    j: formatUTCDayOfYear,
    L: formatUTCMilliseconds,
    m: formatUTCMonthNumber,
    M: formatUTCMinutes,
    p: formatUTCPeriod,
    q: formatUTCQuarter,
    Q: formatUnixTimestamp,
    s: formatUnixTimestampSeconds,
    S: formatUTCSeconds,
    u: formatUTCWeekdayNumberMonday,
    U: formatUTCWeekNumberSunday,
    V: formatUTCWeekNumberISO,
    w: formatUTCWeekdayNumberSunday,
    W: formatUTCWeekNumberMonday,
    x: null,
    X: null,
    y: formatUTCYear,
    Y: formatUTCFullYear,
    Z: formatUTCZone,
    "%": formatLiteralPercent
  };
  var parses = {
    a: parseShortWeekday,
    A: parseWeekday,
    b: parseShortMonth,
    B: parseMonth,
    c: parseLocaleDateTime,
    d: parseDayOfMonth,
    e: parseDayOfMonth,
    f: parseMicroseconds,
    g: parseYear,
    G: parseFullYear,
    H: parseHour24,
    I: parseHour24,
    j: parseDayOfYear,
    L: parseMilliseconds,
    m: parseMonthNumber,
    M: parseMinutes,
    p: parsePeriod,
    q: parseQuarter,
    Q: parseUnixTimestamp,
    s: parseUnixTimestampSeconds,
    S: parseSeconds,
    u: parseWeekdayNumberMonday,
    U: parseWeekNumberSunday,
    V: parseWeekNumberISO,
    w: parseWeekdayNumberSunday,
    W: parseWeekNumberMonday,
    x: parseLocaleDate,
    X: parseLocaleTime,
    y: parseYear,
    Y: parseFullYear,
    Z: parseZone,
    "%": parseLiteralPercent
  };
  formats.x = newFormat(locale_date, formats);
  formats.X = newFormat(locale_time, formats);
  formats.c = newFormat(locale_dateTime, formats);
  utcFormats.x = newFormat(locale_date, utcFormats);
  utcFormats.X = newFormat(locale_time, utcFormats);
  utcFormats.c = newFormat(locale_dateTime, utcFormats);
  function newFormat(specifier, formats2) {
    return function(date2) {
      var string3 = [], i = -1, j = 0, n = specifier.length, c, pad4, format2;
      if (!(date2 instanceof Date))
        date2 = new Date(+date2);
      while (++i < n) {
        if (specifier.charCodeAt(i) === 37) {
          string3.push(specifier.slice(j, i));
          if ((pad4 = pads[c = specifier.charAt(++i)]) != null)
            c = specifier.charAt(++i);
          else
            pad4 = c === "e" ? " " : "0";
          if (format2 = formats2[c])
            c = format2(date2, pad4);
          string3.push(c);
          j = i + 1;
        }
      }
      string3.push(specifier.slice(j, i));
      return string3.join("");
    };
  }
  function newParse(specifier, Z) {
    return function(string3) {
      var d = newDate(1900, undefined, 1), i = parseSpecifier(d, specifier, string3 += "", 0), week2, day2;
      if (i != string3.length)
        return null;
      if ("Q" in d)
        return new Date(d.Q);
      if ("s" in d)
        return new Date(d.s * 1000 + ("L" in d ? d.L : 0));
      if (Z && !("Z" in d))
        d.Z = 0;
      if ("p" in d)
        d.H = d.H % 12 + d.p * 12;
      if (d.m === undefined)
        d.m = ("q" in d) ? d.q : 0;
      if ("V" in d) {
        if (d.V < 1 || d.V > 53)
          return null;
        if (!("w" in d))
          d.w = 1;
        if ("Z" in d) {
          week2 = utcDate(newDate(d.y, 0, 1)), day2 = week2.getUTCDay();
          week2 = day2 > 4 || day2 === 0 ? utcMonday.ceil(week2) : utcMonday(week2);
          week2 = utcDay.offset(week2, (d.V - 1) * 7);
          d.y = week2.getUTCFullYear();
          d.m = week2.getUTCMonth();
          d.d = week2.getUTCDate() + (d.w + 6) % 7;
        } else {
          week2 = localDate(newDate(d.y, 0, 1)), day2 = week2.getDay();
          week2 = day2 > 4 || day2 === 0 ? timeMonday.ceil(week2) : timeMonday(week2);
          week2 = timeDay.offset(week2, (d.V - 1) * 7);
          d.y = week2.getFullYear();
          d.m = week2.getMonth();
          d.d = week2.getDate() + (d.w + 6) % 7;
        }
      } else if (("W" in d) || ("U" in d)) {
        if (!("w" in d))
          d.w = ("u" in d) ? d.u % 7 : ("W" in d) ? 1 : 0;
        day2 = ("Z" in d) ? utcDate(newDate(d.y, 0, 1)).getUTCDay() : localDate(newDate(d.y, 0, 1)).getDay();
        d.m = 0;
        d.d = ("W" in d) ? (d.w + 6) % 7 + d.W * 7 - (day2 + 5) % 7 : d.w + d.U * 7 - (day2 + 6) % 7;
      }
      if ("Z" in d) {
        d.H += d.Z / 100 | 0;
        d.M += d.Z % 100;
        return utcDate(d);
      }
      return localDate(d);
    };
  }
  function parseSpecifier(d, specifier, string3, j) {
    var i = 0, n = specifier.length, m = string3.length, c, parse3;
    while (i < n) {
      if (j >= m)
        return -1;
      c = specifier.charCodeAt(i++);
      if (c === 37) {
        c = specifier.charAt(i++);
        parse3 = parses[c in pads ? specifier.charAt(i++) : c];
        if (!parse3 || (j = parse3(d, string3, j)) < 0)
          return -1;
      } else if (c != string3.charCodeAt(j++)) {
        return -1;
      }
    }
    return j;
  }
  function parsePeriod(d, string3, i) {
    var n = periodRe.exec(string3.slice(i));
    return n ? (d.p = periodLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
  }
  function parseShortWeekday(d, string3, i) {
    var n = shortWeekdayRe.exec(string3.slice(i));
    return n ? (d.w = shortWeekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
  }
  function parseWeekday(d, string3, i) {
    var n = weekdayRe.exec(string3.slice(i));
    return n ? (d.w = weekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
  }
  function parseShortMonth(d, string3, i) {
    var n = shortMonthRe.exec(string3.slice(i));
    return n ? (d.m = shortMonthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
  }
  function parseMonth(d, string3, i) {
    var n = monthRe.exec(string3.slice(i));
    return n ? (d.m = monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
  }
  function parseLocaleDateTime(d, string3, i) {
    return parseSpecifier(d, locale_dateTime, string3, i);
  }
  function parseLocaleDate(d, string3, i) {
    return parseSpecifier(d, locale_date, string3, i);
  }
  function parseLocaleTime(d, string3, i) {
    return parseSpecifier(d, locale_time, string3, i);
  }
  function formatShortWeekday(d) {
    return locale_shortWeekdays[d.getDay()];
  }
  function formatWeekday(d) {
    return locale_weekdays[d.getDay()];
  }
  function formatShortMonth(d) {
    return locale_shortMonths[d.getMonth()];
  }
  function formatMonth(d) {
    return locale_months[d.getMonth()];
  }
  function formatPeriod(d) {
    return locale_periods[+(d.getHours() >= 12)];
  }
  function formatQuarter(d) {
    return 1 + ~~(d.getMonth() / 3);
  }
  function formatUTCShortWeekday(d) {
    return locale_shortWeekdays[d.getUTCDay()];
  }
  function formatUTCWeekday(d) {
    return locale_weekdays[d.getUTCDay()];
  }
  function formatUTCShortMonth(d) {
    return locale_shortMonths[d.getUTCMonth()];
  }
  function formatUTCMonth(d) {
    return locale_months[d.getUTCMonth()];
  }
  function formatUTCPeriod(d) {
    return locale_periods[+(d.getUTCHours() >= 12)];
  }
  function formatUTCQuarter(d) {
    return 1 + ~~(d.getUTCMonth() / 3);
  }
  return {
    format: function(specifier) {
      var f = newFormat(specifier += "", formats);
      f.toString = function() {
        return specifier;
      };
      return f;
    },
    parse: function(specifier) {
      var p = newParse(specifier += "", false);
      p.toString = function() {
        return specifier;
      };
      return p;
    },
    utcFormat: function(specifier) {
      var f = newFormat(specifier += "", utcFormats);
      f.toString = function() {
        return specifier;
      };
      return f;
    },
    utcParse: function(specifier) {
      var p = newParse(specifier += "", true);
      p.toString = function() {
        return specifier;
      };
      return p;
    }
  };
}
var pads = { "-": "", _: " ", "0": "0" };
var numberRe = /^\s*\d+/;
var percentRe = /^%/;
var requoteRe = /[\\^$*+?|[\]().{}]/g;

// node_modules/d3-time-format/src/defaultLocale.js
var locale4;
var timeFormat;
var timeParse;
var utcFormat;
var utcParse;
defaultLocale2({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});
function defaultLocale2(definition) {
  locale4 = formatLocale(definition);
  timeFormat = locale4.format;
  timeParse = locale4.parse;
  utcFormat = locale4.utcFormat;
  utcParse = locale4.utcParse;
  return locale4;
}
// node_modules/d3-scale/src/time.js
var date2 = function(t) {
  return new Date(t);
};
var number11 = function(t) {
  return t instanceof Date ? +t : +new Date(+t);
};
function calendar(ticks2, tickInterval, year2, month2, week2, day2, hour2, minute2, second3, format2) {
  var scale = continuous(), invert = scale.invert, domain = scale.domain;
  var formatMillisecond = format2(".%L"), formatSecond = format2(":%S"), formatMinute = format2("%I:%M"), formatHour = format2("%I %p"), formatDay = format2("%a %d"), formatWeek = format2("%b %d"), formatMonth = format2("%B"), formatYear2 = format2("%Y");
  function tickFormat3(date3) {
    return (second3(date3) < date3 ? formatMillisecond : minute2(date3) < date3 ? formatSecond : hour2(date3) < date3 ? formatMinute : day2(date3) < date3 ? formatHour : month2(date3) < date3 ? week2(date3) < date3 ? formatDay : formatWeek : year2(date3) < date3 ? formatMonth : formatYear2)(date3);
  }
  scale.invert = function(y) {
    return new Date(invert(y));
  };
  scale.domain = function(_) {
    return arguments.length ? domain(Array.from(_, number11)) : domain().map(date2);
  };
  scale.ticks = function(interval10) {
    var d = domain();
    return ticks2(d[0], d[d.length - 1], interval10 == null ? 10 : interval10);
  };
  scale.tickFormat = function(count5, specifier) {
    return specifier == null ? tickFormat3 : format2(specifier);
  };
  scale.nice = function(interval10) {
    var d = domain();
    if (!interval10 || typeof interval10.range !== "function")
      interval10 = tickInterval(d[0], d[d.length - 1], interval10 == null ? 10 : interval10);
    return interval10 ? domain(nice(d, interval10)) : scale;
  };
  scale.copy = function() {
    return copy(scale, calendar(ticks2, tickInterval, year2, month2, week2, day2, hour2, minute2, second3, format2));
  };
  return scale;
}
function time() {
  return initRange.apply(calendar(timeTicks, timeTickInterval, timeYear, timeMonth, timeSunday, timeDay, timeHour, timeMinute, second, timeFormat).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]), arguments);
}
// node_modules/d3-scale/src/utcTime.js
function utcTime() {
  return initRange.apply(calendar(utcTicks, utcTickInterval, utcYear, utcMonth, utcSunday, utcDay, utcHour, utcMinute, second, utcFormat).domain([Date.UTC(2000, 0, 1), Date.UTC(2000, 0, 2)]), arguments);
}
// node_modules/d3-scale/src/sequential.js
function copy2(source, target) {
  return target.domain(source.domain()).interpolator(source.interpolator()).clamp(source.clamp()).unknown(source.unknown());
}

// node_modules/d3-scale/src/diverging.js
var transformer3 = function() {
  var x05 = 0, x12 = 0.5, x2 = 1, s = 1, t03, t13, t22, k10, k21, interpolator = identity10, transform3, clamp = false, unknown;
  function scale(x) {
    return isNaN(x = +x) ? unknown : (x = 0.5 + ((x = +transform3(x)) - t13) * (s * x < s * t13 ? k10 : k21), interpolator(clamp ? Math.max(0, Math.min(1, x)) : x));
  }
  scale.domain = function(_) {
    return arguments.length ? ([x05, x12, x2] = _, t03 = transform3(x05 = +x05), t13 = transform3(x12 = +x12), t22 = transform3(x2 = +x2), k10 = t03 === t13 ? 0 : 0.5 / (t13 - t03), k21 = t13 === t22 ? 0 : 0.5 / (t22 - t13), s = t13 < t03 ? -1 : 1, scale) : [x05, x12, x2];
  };
  scale.clamp = function(_) {
    return arguments.length ? (clamp = !!_, scale) : clamp;
  };
  scale.interpolator = function(_) {
    return arguments.length ? (interpolator = _, scale) : interpolator;
  };
  function range4(interpolate3) {
    return function(_) {
      var r0, r1, r2;
      return arguments.length ? ([r0, r1, r2] = _, interpolator = piecewise(interpolate3, [r0, r1, r2]), scale) : [interpolator(0), interpolator(0.5), interpolator(1)];
    };
  }
  scale.range = range4(value_default);
  scale.rangeRound = range4(round_default);
  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };
  return function(t) {
    transform3 = t, t03 = t(x05), t13 = t(x12), t22 = t(x2), k10 = t03 === t13 ? 0 : 0.5 / (t13 - t03), k21 = t13 === t22 ? 0 : 0.5 / (t22 - t13), s = t13 < t03 ? -1 : 1;
    return scale;
  };
};
function divergingLog() {
  var scale = loggish(transformer3()).domain([0.1, 1, 10]);
  scale.copy = function() {
    return copy2(scale, divergingLog()).base(scale.base());
  };
  return initInterpolator.apply(scale, arguments);
}
function divergingSymlog() {
  var scale = symlogish(transformer3());
  scale.copy = function() {
    return copy2(scale, divergingSymlog()).constant(scale.constant());
  };
  return initInterpolator.apply(scale, arguments);
}
function divergingPow() {
  var scale = powish(transformer3());
  scale.copy = function() {
    return copy2(scale, divergingPow()).exponent(scale.exponent());
  };
  return initInterpolator.apply(scale, arguments);
}
function diverging() {
  var scale = linearish(transformer3()(identity10));
  scale.copy = function() {
    return copy2(scale, diverging());
  };
  return initInterpolator.apply(scale, arguments);
}
// node_modules/d3-scale-chromatic/src/colors.js
function colors_default(specifier) {
  var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
  while (i < n)
    colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
  return colors;
}

// node_modules/d3-scale-chromatic/src/categorical/category10.js
var category10_default = colors_default("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");
// node_modules/d3-scale-chromatic/src/categorical/Accent.js
var Accent_default = colors_default("7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666");
// node_modules/d3-scale-chromatic/src/categorical/Dark2.js
var Dark2_default = colors_default("1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666");
// node_modules/d3-scale-chromatic/src/categorical/Paired.js
var Paired_default = colors_default("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928");
// node_modules/d3-scale-chromatic/src/categorical/Pastel1.js
var Pastel1_default = colors_default("fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2");
// node_modules/d3-scale-chromatic/src/categorical/Pastel2.js
var Pastel2_default = colors_default("b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc");
// node_modules/d3-scale-chromatic/src/categorical/Set1.js
var Set1_default = colors_default("e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999");
// node_modules/d3-scale-chromatic/src/categorical/Set2.js
var Set2_default = colors_default("66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3");
// node_modules/d3-scale-chromatic/src/categorical/Set3.js
var Set3_default = colors_default("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f");
// node_modules/d3-scale-chromatic/src/categorical/Tableau10.js
var Tableau10_default = colors_default("4e79a7f28e2ce1575976b7b259a14fedc949af7aa1ff9da79c755fbab0ab");
// node_modules/d3-scale-chromatic/src/ramp.js
var ramp_default = (scheme) => rgbBasis(scheme[scheme.length - 1]);

// node_modules/d3-scale-chromatic/src/diverging/BrBG.js
var scheme = new Array(3).concat("d8b365f5f5f55ab4ac", "a6611adfc27d80cdc1018571", "a6611adfc27df5f5f580cdc1018571", "8c510ad8b365f6e8c3c7eae55ab4ac01665e", "8c510ad8b365f6e8c3f5f5f5c7eae55ab4ac01665e", "8c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e", "8c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e", "5430058c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e003c30", "5430058c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e003c30").map(colors_default);
var BrBG_default = ramp_default(scheme);
// node_modules/d3-scale-chromatic/src/diverging/PRGn.js
var scheme2 = new Array(3).concat("af8dc3f7f7f77fbf7b", "7b3294c2a5cfa6dba0008837", "7b3294c2a5cff7f7f7a6dba0008837", "762a83af8dc3e7d4e8d9f0d37fbf7b1b7837", "762a83af8dc3e7d4e8f7f7f7d9f0d37fbf7b1b7837", "762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b7837", "762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b7837", "40004b762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b783700441b", "40004b762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b783700441b").map(colors_default);
var PRGn_default = ramp_default(scheme2);
// node_modules/d3-scale-chromatic/src/diverging/PiYG.js
var scheme3 = new Array(3).concat("e9a3c9f7f7f7a1d76a", "d01c8bf1b6dab8e1864dac26", "d01c8bf1b6daf7f7f7b8e1864dac26", "c51b7de9a3c9fde0efe6f5d0a1d76a4d9221", "c51b7de9a3c9fde0eff7f7f7e6f5d0a1d76a4d9221", "c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221", "c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221", "8e0152c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221276419", "8e0152c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221276419").map(colors_default);
var PiYG_default = ramp_default(scheme3);
// node_modules/d3-scale-chromatic/src/diverging/PuOr.js
var scheme4 = new Array(3).concat("998ec3f7f7f7f1a340", "5e3c99b2abd2fdb863e66101", "5e3c99b2abd2f7f7f7fdb863e66101", "542788998ec3d8daebfee0b6f1a340b35806", "542788998ec3d8daebf7f7f7fee0b6f1a340b35806", "5427888073acb2abd2d8daebfee0b6fdb863e08214b35806", "5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b35806", "2d004b5427888073acb2abd2d8daebfee0b6fdb863e08214b358067f3b08", "2d004b5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b358067f3b08").map(colors_default);
var PuOr_default = ramp_default(scheme4);
// node_modules/d3-scale-chromatic/src/diverging/RdBu.js
var scheme5 = new Array(3).concat("ef8a62f7f7f767a9cf", "ca0020f4a58292c5de0571b0", "ca0020f4a582f7f7f792c5de0571b0", "b2182bef8a62fddbc7d1e5f067a9cf2166ac", "b2182bef8a62fddbc7f7f7f7d1e5f067a9cf2166ac", "b2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac", "b2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac", "67001fb2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac053061", "67001fb2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac053061").map(colors_default);
var RdBu_default = ramp_default(scheme5);
// node_modules/d3-scale-chromatic/src/diverging/RdGy.js
var scheme6 = new Array(3).concat("ef8a62ffffff999999", "ca0020f4a582bababa404040", "ca0020f4a582ffffffbababa404040", "b2182bef8a62fddbc7e0e0e09999994d4d4d", "b2182bef8a62fddbc7ffffffe0e0e09999994d4d4d", "b2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d", "b2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d", "67001fb2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d1a1a1a", "67001fb2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d1a1a1a").map(colors_default);
var RdGy_default = ramp_default(scheme6);
// node_modules/d3-scale-chromatic/src/diverging/RdYlBu.js
var scheme7 = new Array(3).concat("fc8d59ffffbf91bfdb", "d7191cfdae61abd9e92c7bb6", "d7191cfdae61ffffbfabd9e92c7bb6", "d73027fc8d59fee090e0f3f891bfdb4575b4", "d73027fc8d59fee090ffffbfe0f3f891bfdb4575b4", "d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4", "d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4", "a50026d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4313695", "a50026d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4313695").map(colors_default);
var RdYlBu_default = ramp_default(scheme7);
// node_modules/d3-scale-chromatic/src/diverging/RdYlGn.js
var scheme8 = new Array(3).concat("fc8d59ffffbf91cf60", "d7191cfdae61a6d96a1a9641", "d7191cfdae61ffffbfa6d96a1a9641", "d73027fc8d59fee08bd9ef8b91cf601a9850", "d73027fc8d59fee08bffffbfd9ef8b91cf601a9850", "d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850", "d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850", "a50026d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850006837", "a50026d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850006837").map(colors_default);
var RdYlGn_default = ramp_default(scheme8);
// node_modules/d3-scale-chromatic/src/diverging/Spectral.js
var scheme9 = new Array(3).concat("fc8d59ffffbf99d594", "d7191cfdae61abdda42b83ba", "d7191cfdae61ffffbfabdda42b83ba", "d53e4ffc8d59fee08be6f59899d5943288bd", "d53e4ffc8d59fee08bffffbfe6f59899d5943288bd", "d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd", "d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd", "9e0142d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd5e4fa2", "9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2").map(colors_default);
var Spectral_default = ramp_default(scheme9);
// node_modules/d3-scale-chromatic/src/sequential-multi/BuGn.js
var scheme10 = new Array(3).concat("e5f5f999d8c92ca25f", "edf8fbb2e2e266c2a4238b45", "edf8fbb2e2e266c2a42ca25f006d2c", "edf8fbccece699d8c966c2a42ca25f006d2c", "edf8fbccece699d8c966c2a441ae76238b45005824", "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45005824", "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b").map(colors_default);
var BuGn_default = ramp_default(scheme10);
// node_modules/d3-scale-chromatic/src/sequential-multi/BuPu.js
var scheme11 = new Array(3).concat("e0ecf49ebcda8856a7", "edf8fbb3cde38c96c688419d", "edf8fbb3cde38c96c68856a7810f7c", "edf8fbbfd3e69ebcda8c96c68856a7810f7c", "edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b", "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b", "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b").map(colors_default);
var BuPu_default = ramp_default(scheme11);
// node_modules/d3-scale-chromatic/src/sequential-multi/GnBu.js
var scheme12 = new Array(3).concat("e0f3dba8ddb543a2ca", "f0f9e8bae4bc7bccc42b8cbe", "f0f9e8bae4bc7bccc443a2ca0868ac", "f0f9e8ccebc5a8ddb57bccc443a2ca0868ac", "f0f9e8ccebc5a8ddb57bccc44eb3d32b8cbe08589e", "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe08589e", "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081").map(colors_default);
var GnBu_default = ramp_default(scheme12);
// node_modules/d3-scale-chromatic/src/sequential-multi/OrRd.js
var scheme13 = new Array(3).concat("fee8c8fdbb84e34a33", "fef0d9fdcc8afc8d59d7301f", "fef0d9fdcc8afc8d59e34a33b30000", "fef0d9fdd49efdbb84fc8d59e34a33b30000", "fef0d9fdd49efdbb84fc8d59ef6548d7301f990000", "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301f990000", "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000").map(colors_default);
var OrRd_default = ramp_default(scheme13);
// node_modules/d3-scale-chromatic/src/sequential-multi/PuBuGn.js
var scheme14 = new Array(3).concat("ece2f0a6bddb1c9099", "f6eff7bdc9e167a9cf02818a", "f6eff7bdc9e167a9cf1c9099016c59", "f6eff7d0d1e6a6bddb67a9cf1c9099016c59", "f6eff7d0d1e6a6bddb67a9cf3690c002818a016450", "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016450", "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636").map(colors_default);
var PuBuGn_default = ramp_default(scheme14);
// node_modules/d3-scale-chromatic/src/sequential-multi/PuBu.js
var scheme15 = new Array(3).concat("ece7f2a6bddb2b8cbe", "f1eef6bdc9e174a9cf0570b0", "f1eef6bdc9e174a9cf2b8cbe045a8d", "f1eef6d0d1e6a6bddb74a9cf2b8cbe045a8d", "f1eef6d0d1e6a6bddb74a9cf3690c00570b0034e7b", "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0034e7b", "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858").map(colors_default);
var PuBu_default = ramp_default(scheme15);
// node_modules/d3-scale-chromatic/src/sequential-multi/PuRd.js
var scheme16 = new Array(3).concat("e7e1efc994c7dd1c77", "f1eef6d7b5d8df65b0ce1256", "f1eef6d7b5d8df65b0dd1c77980043", "f1eef6d4b9dac994c7df65b0dd1c77980043", "f1eef6d4b9dac994c7df65b0e7298ace125691003f", "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125691003f", "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f").map(colors_default);
var PuRd_default = ramp_default(scheme16);
// node_modules/d3-scale-chromatic/src/sequential-multi/RdPu.js
var scheme17 = new Array(3).concat("fde0ddfa9fb5c51b8a", "feebe2fbb4b9f768a1ae017e", "feebe2fbb4b9f768a1c51b8a7a0177", "feebe2fcc5c0fa9fb5f768a1c51b8a7a0177", "feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177", "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177", "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a").map(colors_default);
var RdPu_default = ramp_default(scheme17);
// node_modules/d3-scale-chromatic/src/sequential-multi/YlGnBu.js
var scheme18 = new Array(3).concat("edf8b17fcdbb2c7fb8", "ffffcca1dab441b6c4225ea8", "ffffcca1dab441b6c42c7fb8253494", "ffffccc7e9b47fcdbb41b6c42c7fb8253494", "ffffccc7e9b47fcdbb41b6c41d91c0225ea80c2c84", "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea80c2c84", "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58").map(colors_default);
var YlGnBu_default = ramp_default(scheme18);
// node_modules/d3-scale-chromatic/src/sequential-multi/YlGn.js
var scheme19 = new Array(3).concat("f7fcb9addd8e31a354", "ffffccc2e69978c679238443", "ffffccc2e69978c67931a354006837", "ffffccd9f0a3addd8e78c67931a354006837", "ffffccd9f0a3addd8e78c67941ab5d238443005a32", "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443005a32", "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529").map(colors_default);
var YlGn_default = ramp_default(scheme19);
// node_modules/d3-scale-chromatic/src/sequential-multi/YlOrBr.js
var scheme20 = new Array(3).concat("fff7bcfec44fd95f0e", "ffffd4fed98efe9929cc4c02", "ffffd4fed98efe9929d95f0e993404", "ffffd4fee391fec44ffe9929d95f0e993404", "ffffd4fee391fec44ffe9929ec7014cc4c028c2d04", "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c028c2d04", "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506").map(colors_default);
var YlOrBr_default = ramp_default(scheme20);
// node_modules/d3-scale-chromatic/src/sequential-multi/YlOrRd.js
var scheme21 = new Array(3).concat("ffeda0feb24cf03b20", "ffffb2fecc5cfd8d3ce31a1c", "ffffb2fecc5cfd8d3cf03b20bd0026", "ffffb2fed976feb24cfd8d3cf03b20bd0026", "ffffb2fed976feb24cfd8d3cfc4e2ae31a1cb10026", "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cb10026", "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026").map(colors_default);
var YlOrRd_default = ramp_default(scheme21);
// node_modules/d3-scale-chromatic/src/sequential-single/Blues.js
var scheme22 = new Array(3).concat("deebf79ecae13182bd", "eff3ffbdd7e76baed62171b5", "eff3ffbdd7e76baed63182bd08519c", "eff3ffc6dbef9ecae16baed63182bd08519c", "eff3ffc6dbef9ecae16baed64292c62171b5084594", "f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594", "f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b").map(colors_default);
var Blues_default = ramp_default(scheme22);
// node_modules/d3-scale-chromatic/src/sequential-single/Greens.js
var scheme23 = new Array(3).concat("e5f5e0a1d99b31a354", "edf8e9bae4b374c476238b45", "edf8e9bae4b374c47631a354006d2c", "edf8e9c7e9c0a1d99b74c47631a354006d2c", "edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32", "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32", "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b").map(colors_default);
var Greens_default = ramp_default(scheme23);
// node_modules/d3-scale-chromatic/src/sequential-single/Greys.js
var scheme24 = new Array(3).concat("f0f0f0bdbdbd636363", "f7f7f7cccccc969696525252", "f7f7f7cccccc969696636363252525", "f7f7f7d9d9d9bdbdbd969696636363252525", "f7f7f7d9d9d9bdbdbd969696737373525252252525", "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525", "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000").map(colors_default);
var Greys_default = ramp_default(scheme24);
// node_modules/d3-scale-chromatic/src/sequential-single/Purples.js
var scheme25 = new Array(3).concat("efedf5bcbddc756bb1", "f2f0f7cbc9e29e9ac86a51a3", "f2f0f7cbc9e29e9ac8756bb154278f", "f2f0f7dadaebbcbddc9e9ac8756bb154278f", "f2f0f7dadaebbcbddc9e9ac8807dba6a51a34a1486", "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a34a1486", "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d").map(colors_default);
var Purples_default = ramp_default(scheme25);
// node_modules/d3-scale-chromatic/src/sequential-single/Reds.js
var scheme26 = new Array(3).concat("fee0d2fc9272de2d26", "fee5d9fcae91fb6a4acb181d", "fee5d9fcae91fb6a4ade2d26a50f15", "fee5d9fcbba1fc9272fb6a4ade2d26a50f15", "fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d", "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d", "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d").map(colors_default);
var Reds_default = ramp_default(scheme26);
// node_modules/d3-scale-chromatic/src/sequential-single/Oranges.js
var scheme27 = new Array(3).concat("fee6cefdae6be6550d", "feeddefdbe85fd8d3cd94701", "feeddefdbe85fd8d3ce6550da63603", "feeddefdd0a2fdae6bfd8d3ce6550da63603", "feeddefdd0a2fdae6bfd8d3cf16913d948018c2d04", "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d948018c2d04", "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704").map(colors_default);
var Oranges_default = ramp_default(scheme27);
// node_modules/d3-scale-chromatic/src/sequential-multi/cividis.js
function cividis_default(t) {
  t = Math.max(0, Math.min(1, t));
  return "rgb(" + Math.max(0, Math.min(255, Math.round(-4.54 - t * (35.34 - t * (2381.73 - t * (6402.7 - t * (7024.72 - t * 2710.57))))))) + ", " + Math.max(0, Math.min(255, Math.round(32.49 + t * (170.73 + t * (52.82 - t * (131.46 - t * (176.58 - t * 67.37))))))) + ", " + Math.max(0, Math.min(255, Math.round(81.24 + t * (442.36 - t * (2482.43 - t * (6167.24 - t * (6614.94 - t * 2475.67))))))) + ")";
}
// node_modules/d3-scale-chromatic/src/sequential-multi/cubehelix.js
var cubehelix_default2 = cubehelixLong(cubehelix(300, 0.5, 0), cubehelix(-240, 0.5, 1));
// node_modules/d3-scale-chromatic/src/sequential-multi/rainbow.js
var warm = cubehelixLong(cubehelix(-100, 0.75, 0.35), cubehelix(80, 1.5, 0.8));
var cool = cubehelixLong(cubehelix(260, 0.75, 0.35), cubehelix(80, 1.5, 0.8));
var c = cubehelix();
function rainbow_default(t) {
  if (t < 0 || t > 1)
    t -= Math.floor(t);
  var ts = Math.abs(t - 0.5);
  c.h = 360 * t - 100;
  c.s = 1.5 - 1.5 * ts;
  c.l = 0.8 - 0.9 * ts;
  return c + "";
}
// node_modules/d3-scale-chromatic/src/sequential-multi/sinebow.js
var c2 = rgb();
var pi_1_3 = Math.PI / 3;
var pi_2_3 = Math.PI * 2 / 3;
function sinebow_default(t) {
  var x;
  t = (0.5 - t) * Math.PI;
  c2.r = 255 * (x = Math.sin(t)) * x;
  c2.g = 255 * (x = Math.sin(t + pi_1_3)) * x;
  c2.b = 255 * (x = Math.sin(t + pi_2_3)) * x;
  return c2 + "";
}
// node_modules/d3-scale-chromatic/src/sequential-multi/turbo.js
function turbo_default(t) {
  t = Math.max(0, Math.min(1, t));
  return "rgb(" + Math.max(0, Math.min(255, Math.round(34.61 + t * (1172.33 - t * (10793.56 - t * (33300.12 - t * (38394.49 - t * 14825.05))))))) + ", " + Math.max(0, Math.min(255, Math.round(23.31 + t * (557.33 + t * (1225.33 - t * (3574.96 - t * (1073.77 + t * 707.56))))))) + ", " + Math.max(0, Math.min(255, Math.round(27.2 + t * (3211.1 - t * (15327.97 - t * (27814 - t * (22569.18 - t * 6838.66))))))) + ")";
}
// node_modules/d3-scale-chromatic/src/sequential-multi/viridis.js
var ramp28 = function(range4) {
  var n = range4.length;
  return function(t) {
    return range4[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
  };
};
var viridis_default = ramp28(colors_default("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));
var magma = ramp28(colors_default("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));
var inferno = ramp28(colors_default("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));
var plasma = ramp28(colors_default("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));
// node_modules/d3-shape/src/constant.js
function constant_default4(x) {
  return function constant() {
    return x;
  };
}

// node_modules/d3-shape/src/math.js
var cos2 = Math.cos;
var min3 = Math.min;
var sin2 = Math.sin;
var sqrt3 = Math.sqrt;
var epsilon4 = 0.000000000001;
var pi3 = Math.PI;
var halfPi2 = pi3 / 2;
var tau3 = 2 * pi3;

// node_modules/d3-shape/src/path.js
function withPath(shape) {
  let digits = 3;
  shape.digits = function(_) {
    if (!arguments.length)
      return digits;
    if (_ == null) {
      digits = null;
    } else {
      const d = Math.floor(_);
      if (!(d >= 0))
        throw new RangeError(`invalid digits: ${_}`);
      digits = d;
    }
    return shape;
  };
  return () => new Path(digits);
}

// node_modules/d3-shape/src/array.js
var slice = Array.prototype.slice;
function array_default(x) {
  return typeof x === "object" && ("length" in x) ? x : Array.from(x);
}

// node_modules/d3-shape/src/curve/linear.js
var Linear = function(context2) {
  this._context = context2;
};
Linear.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || this._line !== 0 && this._point === 1)
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
        break;
      case 1:
        this._point = 2;
      default:
        this._context.lineTo(x, y);
        break;
    }
  }
};
function linear_default(context2) {
  return new Linear(context2);
}

// node_modules/d3-shape/src/point.js
function x(p) {
  return p[0];
}
function y(p) {
  return p[1];
}

// node_modules/d3-shape/src/line.js
function line_default2(x2, y2) {
  var defined = constant_default4(true), context2 = null, curve = linear_default, output = null, path3 = withPath(line2);
  x2 = typeof x2 === "function" ? x2 : x2 === undefined ? x : constant_default4(x2);
  y2 = typeof y2 === "function" ? y2 : y2 === undefined ? y : constant_default4(y2);
  function line2(data2) {
    var i, n = (data2 = array_default(data2)).length, d, defined0 = false, buffer3;
    if (context2 == null)
      output = curve(buffer3 = path3());
    for (i = 0;i <= n; ++i) {
      if (!(i < n && defined(d = data2[i], i, data2)) === defined0) {
        if (defined0 = !defined0)
          output.lineStart();
        else
          output.lineEnd();
      }
      if (defined0)
        output.point(+x2(d, i, data2), +y2(d, i, data2));
    }
    if (buffer3)
      return output = null, buffer3 + "" || null;
  }
  line2.x = function(_) {
    return arguments.length ? (x2 = typeof _ === "function" ? _ : constant_default4(+_), line2) : x2;
  };
  line2.y = function(_) {
    return arguments.length ? (y2 = typeof _ === "function" ? _ : constant_default4(+_), line2) : y2;
  };
  line2.defined = function(_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : constant_default4(!!_), line2) : defined;
  };
  line2.curve = function(_) {
    return arguments.length ? (curve = _, context2 != null && (output = curve(context2)), line2) : curve;
  };
  line2.context = function(_) {
    return arguments.length ? (_ == null ? context2 = output = null : output = curve(context2 = _), line2) : context2;
  };
  return line2;
}
// node_modules/d3-shape/src/curve/bump.js
function bumpX(context2) {
  return new Bump(context2, true);
}
function bumpY(context2) {
  return new Bump(context2, false);
}
class Bump {
  constructor(context2, x2) {
    this._context = context2;
    this._x = x2;
  }
  areaStart() {
    this._line = 0;
  }
  areaEnd() {
    this._line = NaN;
  }
  lineStart() {
    this._point = 0;
  }
  lineEnd() {
    if (this._line || this._line !== 0 && this._point === 1)
      this._context.closePath();
    this._line = 1 - this._line;
  }
  point(x2, y2) {
    x2 = +x2, y2 = +y2;
    switch (this._point) {
      case 0: {
        this._point = 1;
        if (this._line)
          this._context.lineTo(x2, y2);
        else
          this._context.moveTo(x2, y2);
        break;
      }
      case 1:
        this._point = 2;
      default: {
        if (this._x)
          this._context.bezierCurveTo(this._x0 = (this._x0 + x2) / 2, this._y0, this._x0, y2, x2, y2);
        else
          this._context.bezierCurveTo(this._x0, this._y0 = (this._y0 + y2) / 2, x2, this._y0, x2, y2);
        break;
      }
    }
    this._x0 = x2, this._y0 = y2;
  }
}

// node_modules/d3-shape/src/symbol/asterisk.js
var sqrt32 = sqrt3(3);
var asterisk_default = {
  draw(context2, size2) {
    const r = sqrt3(size2 + min3(size2 / 28, 0.75)) * 0.59436;
    const t = r / 2;
    const u = t * sqrt32;
    context2.moveTo(0, r);
    context2.lineTo(0, -r);
    context2.moveTo(-u, -t);
    context2.lineTo(u, t);
    context2.moveTo(-u, t);
    context2.lineTo(u, -t);
  }
};

// node_modules/d3-shape/src/symbol/circle.js
var circle_default2 = {
  draw(context2, size2) {
    const r = sqrt3(size2 / pi3);
    context2.moveTo(r, 0);
    context2.arc(0, 0, r, 0, tau3);
  }
};

// node_modules/d3-shape/src/symbol/cross.js
var cross_default = {
  draw(context2, size2) {
    const r = sqrt3(size2 / 5) / 2;
    context2.moveTo(-3 * r, -r);
    context2.lineTo(-r, -r);
    context2.lineTo(-r, -3 * r);
    context2.lineTo(r, -3 * r);
    context2.lineTo(r, -r);
    context2.lineTo(3 * r, -r);
    context2.lineTo(3 * r, r);
    context2.lineTo(r, r);
    context2.lineTo(r, 3 * r);
    context2.lineTo(-r, 3 * r);
    context2.lineTo(-r, r);
    context2.lineTo(-3 * r, r);
    context2.closePath();
  }
};

// node_modules/d3-shape/src/symbol/diamond.js
var tan30 = sqrt3(1 / 3);
var tan30_2 = tan30 * 2;
var diamond_default = {
  draw(context2, size2) {
    const y2 = sqrt3(size2 / tan30_2);
    const x2 = y2 * tan30;
    context2.moveTo(0, -y2);
    context2.lineTo(x2, 0);
    context2.lineTo(0, y2);
    context2.lineTo(-x2, 0);
    context2.closePath();
  }
};

// node_modules/d3-shape/src/symbol/diamond2.js
var diamond2_default = {
  draw(context2, size2) {
    const r = sqrt3(size2) * 0.62625;
    context2.moveTo(0, -r);
    context2.lineTo(r, 0);
    context2.lineTo(0, r);
    context2.lineTo(-r, 0);
    context2.closePath();
  }
};

// node_modules/d3-shape/src/symbol/plus.js
var plus_default = {
  draw(context2, size2) {
    const r = sqrt3(size2 - min3(size2 / 7, 2)) * 0.87559;
    context2.moveTo(-r, 0);
    context2.lineTo(r, 0);
    context2.moveTo(0, r);
    context2.lineTo(0, -r);
  }
};

// node_modules/d3-shape/src/symbol/square.js
var square_default = {
  draw(context2, size2) {
    const w = sqrt3(size2);
    const x2 = -w / 2;
    context2.rect(x2, x2, w, w);
  }
};

// node_modules/d3-shape/src/symbol/square2.js
var square2_default = {
  draw(context2, size2) {
    const r = sqrt3(size2) * 0.4431;
    context2.moveTo(r, r);
    context2.lineTo(r, -r);
    context2.lineTo(-r, -r);
    context2.lineTo(-r, r);
    context2.closePath();
  }
};

// node_modules/d3-shape/src/symbol/star.js
var ka = 0.8908130915292852;
var kr = sin2(pi3 / 10) / sin2(7 * pi3 / 10);
var kx = sin2(tau3 / 10) * kr;
var ky = -cos2(tau3 / 10) * kr;
var star_default = {
  draw(context2, size2) {
    const r = sqrt3(size2 * ka);
    const x2 = kx * r;
    const y2 = ky * r;
    context2.moveTo(0, -r);
    context2.lineTo(x2, y2);
    for (let i = 1;i < 5; ++i) {
      const a = tau3 * i / 5;
      const c3 = cos2(a);
      const s = sin2(a);
      context2.lineTo(s * r, -c3 * r);
      context2.lineTo(c3 * x2 - s * y2, s * x2 + c3 * y2);
    }
    context2.closePath();
  }
};

// node_modules/d3-shape/src/symbol/triangle.js
var sqrt33 = sqrt3(3);
var triangle_default = {
  draw(context2, size2) {
    const y2 = -sqrt3(size2 / (sqrt33 * 3));
    context2.moveTo(0, y2 * 2);
    context2.lineTo(-sqrt33 * y2, -y2);
    context2.lineTo(sqrt33 * y2, -y2);
    context2.closePath();
  }
};

// node_modules/d3-shape/src/symbol/triangle2.js
var sqrt34 = sqrt3(3);
var triangle2_default = {
  draw(context2, size2) {
    const s = sqrt3(size2) * 0.6824;
    const t = s / 2;
    const u = s * sqrt34 / 2;
    context2.moveTo(0, -s);
    context2.lineTo(u, t);
    context2.lineTo(-u, t);
    context2.closePath();
  }
};

// node_modules/d3-shape/src/symbol/wye.js
var c3 = -0.5;
var s = sqrt3(3) / 2;
var k = 1 / sqrt3(12);
var a = (k / 2 + 1) * 3;
var wye_default = {
  draw(context2, size2) {
    const r = sqrt3(size2 / a);
    const x05 = r / 2, y05 = r * k;
    const x12 = x05, y12 = r * k + r;
    const x2 = -x12, y2 = y12;
    context2.moveTo(x05, y05);
    context2.lineTo(x12, y12);
    context2.lineTo(x2, y2);
    context2.lineTo(c3 * x05 - s * y05, s * x05 + c3 * y05);
    context2.lineTo(c3 * x12 - s * y12, s * x12 + c3 * y12);
    context2.lineTo(c3 * x2 - s * y2, s * x2 + c3 * y2);
    context2.lineTo(c3 * x05 + s * y05, c3 * y05 - s * x05);
    context2.lineTo(c3 * x12 + s * y12, c3 * y12 - s * x12);
    context2.lineTo(c3 * x2 + s * y2, c3 * y2 - s * x2);
    context2.closePath();
  }
};

// node_modules/d3-shape/src/symbol/times.js
var times_default = {
  draw(context2, size2) {
    const r = sqrt3(size2 - min3(size2 / 6, 1.7)) * 0.6189;
    context2.moveTo(-r, -r);
    context2.lineTo(r, r);
    context2.moveTo(-r, r);
    context2.lineTo(r, -r);
  }
};

// node_modules/d3-shape/src/symbol.js
var symbolsFill = [
  circle_default2,
  cross_default,
  diamond_default,
  square_default,
  star_default,
  triangle_default,
  wye_default
];
var symbolsStroke = [
  circle_default2,
  plus_default,
  times_default,
  triangle2_default,
  asterisk_default,
  square2_default,
  diamond2_default
];
// node_modules/d3-shape/src/noop.js
function noop_default() {
}

// node_modules/d3-shape/src/curve/basis.js
function point3(that, x2, y2) {
  that._context.bezierCurveTo((2 * that._x0 + that._x1) / 3, (2 * that._y0 + that._y1) / 3, (that._x0 + 2 * that._x1) / 3, (that._y0 + 2 * that._y1) / 3, (that._x0 + 4 * that._x1 + x2) / 6, (that._y0 + 4 * that._y1 + y2) / 6);
}
function Basis(context2) {
  this._context = context2;
}
Basis.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 3:
        point3(this, this._x1, this._y1);
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
    }
    if (this._line || this._line !== 0 && this._point === 1)
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x2, y2) : this._context.moveTo(x2, y2);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
      default:
        point3(this, x2, y2);
        break;
    }
    this._x0 = this._x1, this._x1 = x2;
    this._y0 = this._y1, this._y1 = y2;
  }
};
function basis_default2(context2) {
  return new Basis(context2);
}

// node_modules/d3-shape/src/curve/basisClosed.js
var BasisClosed = function(context2) {
  this._context = context2;
};
BasisClosed.prototype = {
  areaStart: noop_default,
  areaEnd: noop_default,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x2, this._y2);
        this._context.closePath();
        break;
      }
      case 2: {
        this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3);
        this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3);
        this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x2, this._y2);
        this.point(this._x3, this._y3);
        this.point(this._x4, this._y4);
        break;
      }
    }
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._x2 = x2, this._y2 = y2;
        break;
      case 1:
        this._point = 2;
        this._x3 = x2, this._y3 = y2;
        break;
      case 2:
        this._point = 3;
        this._x4 = x2, this._y4 = y2;
        this._context.moveTo((this._x0 + 4 * this._x1 + x2) / 6, (this._y0 + 4 * this._y1 + y2) / 6);
        break;
      default:
        point3(this, x2, y2);
        break;
    }
    this._x0 = this._x1, this._x1 = x2;
    this._y0 = this._y1, this._y1 = y2;
  }
};
function basisClosed_default2(context2) {
  return new BasisClosed(context2);
}
// node_modules/d3-shape/src/curve/basisOpen.js
var BasisOpen = function(context2) {
  this._context = context2;
};
BasisOpen.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || this._line !== 0 && this._point === 3)
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    switch (this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        var x05 = (this._x0 + 4 * this._x1 + x2) / 6, y05 = (this._y0 + 4 * this._y1 + y2) / 6;
        this._line ? this._context.lineTo(x05, y05) : this._context.moveTo(x05, y05);
        break;
      case 3:
        this._point = 4;
      default:
        point3(this, x2, y2);
        break;
    }
    this._x0 = this._x1, this._x1 = x2;
    this._y0 = this._y1, this._y1 = y2;
  }
};
function basisOpen_default(context2) {
  return new BasisOpen(context2);
}
// node_modules/d3-shape/src/curve/bundle.js
var Bundle = function(context2, beta) {
  this._basis = new Basis(context2);
  this._beta = beta;
};
Bundle.prototype = {
  lineStart: function() {
    this._x = [];
    this._y = [];
    this._basis.lineStart();
  },
  lineEnd: function() {
    var x2 = this._x, y2 = this._y, j = x2.length - 1;
    if (j > 0) {
      var x05 = x2[0], y05 = y2[0], dx = x2[j] - x05, dy = y2[j] - y05, i = -1, t;
      while (++i <= j) {
        t = i / j;
        this._basis.point(this._beta * x2[i] + (1 - this._beta) * (x05 + t * dx), this._beta * y2[i] + (1 - this._beta) * (y05 + t * dy));
      }
    }
    this._x = this._y = null;
    this._basis.lineEnd();
  },
  point: function(x2, y2) {
    this._x.push(+x2);
    this._y.push(+y2);
  }
};
var bundle_default = function custom(beta) {
  function bundle(context2) {
    return beta === 1 ? new Basis(context2) : new Bundle(context2, beta);
  }
  bundle.beta = function(beta2) {
    return custom(+beta2);
  };
  return bundle;
}(0.85);
// node_modules/d3-shape/src/curve/cardinal.js
function point4(that, x2, y2) {
  that._context.bezierCurveTo(that._x1 + that._k * (that._x2 - that._x0), that._y1 + that._k * (that._y2 - that._y0), that._x2 + that._k * (that._x1 - x2), that._y2 + that._k * (that._y1 - y2), that._x2, that._y2);
}
function Cardinal(context2, tension) {
  this._context = context2;
  this._k = (1 - tension) / 6;
}
Cardinal.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);
        break;
      case 3:
        point4(this, this._x1, this._y1);
        break;
    }
    if (this._line || this._line !== 0 && this._point === 1)
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x2, y2) : this._context.moveTo(x2, y2);
        break;
      case 1:
        this._point = 2;
        this._x1 = x2, this._y1 = y2;
        break;
      case 2:
        this._point = 3;
      default:
        point4(this, x2, y2);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x2;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y2;
  }
};
var cardinal_default = function custom2(tension) {
  function cardinal(context2) {
    return new Cardinal(context2, tension);
  }
  cardinal.tension = function(tension2) {
    return custom2(+tension2);
  };
  return cardinal;
}(0);

// node_modules/d3-shape/src/curve/cardinalClosed.js
function CardinalClosed(context2, tension) {
  this._context = context2;
  this._k = (1 - tension) / 6;
}
CardinalClosed.prototype = {
  areaStart: noop_default,
  areaEnd: noop_default,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x3, this._y3);
        this._context.closePath();
        break;
      }
      case 2: {
        this._context.lineTo(this._x3, this._y3);
        this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x3, this._y3);
        this.point(this._x4, this._y4);
        this.point(this._x5, this._y5);
        break;
      }
    }
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._x3 = x2, this._y3 = y2;
        break;
      case 1:
        this._point = 2;
        this._context.moveTo(this._x4 = x2, this._y4 = y2);
        break;
      case 2:
        this._point = 3;
        this._x5 = x2, this._y5 = y2;
        break;
      default:
        point4(this, x2, y2);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x2;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y2;
  }
};
var cardinalClosed_default = function custom3(tension) {
  function cardinal2(context2) {
    return new CardinalClosed(context2, tension);
  }
  cardinal2.tension = function(tension2) {
    return custom3(+tension2);
  };
  return cardinal2;
}(0);
// node_modules/d3-shape/src/curve/cardinalOpen.js
function CardinalOpen(context2, tension) {
  this._context = context2;
  this._k = (1 - tension) / 6;
}
CardinalOpen.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || this._line !== 0 && this._point === 3)
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    switch (this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
        break;
      case 3:
        this._point = 4;
      default:
        point4(this, x2, y2);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x2;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y2;
  }
};
var cardinalOpen_default = function custom4(tension) {
  function cardinal3(context2) {
    return new CardinalOpen(context2, tension);
  }
  cardinal3.tension = function(tension2) {
    return custom4(+tension2);
  };
  return cardinal3;
}(0);
// node_modules/d3-shape/src/curve/catmullRom.js
function point5(that, x2, y2) {
  var { _x1: x12, _y1: y12, _x2: x22, _y2: y22 } = that;
  if (that._l01_a > epsilon4) {
    var a2 = 2 * that._l01_2a + 3 * that._l01_a * that._l12_a + that._l12_2a, n = 3 * that._l01_a * (that._l01_a + that._l12_a);
    x12 = (x12 * a2 - that._x0 * that._l12_2a + that._x2 * that._l01_2a) / n;
    y12 = (y12 * a2 - that._y0 * that._l12_2a + that._y2 * that._l01_2a) / n;
  }
  if (that._l23_a > epsilon4) {
    var b = 2 * that._l23_2a + 3 * that._l23_a * that._l12_a + that._l12_2a, m = 3 * that._l23_a * (that._l23_a + that._l12_a);
    x22 = (x22 * b + that._x1 * that._l23_2a - x2 * that._l12_2a) / m;
    y22 = (y22 * b + that._y1 * that._l23_2a - y2 * that._l12_2a) / m;
  }
  that._context.bezierCurveTo(x12, y12, x22, y22, that._x2, that._y2);
}
var CatmullRom = function(context2, alpha) {
  this._context = context2;
  this._alpha = alpha;
};
CatmullRom.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);
        break;
      case 3:
        this.point(this._x2, this._y2);
        break;
    }
    if (this._line || this._line !== 0 && this._point === 1)
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    if (this._point) {
      var x23 = this._x2 - x2, y23 = this._y2 - y2;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x2, y2) : this._context.moveTo(x2, y2);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
      default:
        point5(this, x2, y2);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x2;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y2;
  }
};
var catmullRom_default = function custom5(alpha) {
  function catmullRom(context2) {
    return alpha ? new CatmullRom(context2, alpha) : new Cardinal(context2, 0);
  }
  catmullRom.alpha = function(alpha2) {
    return custom5(+alpha2);
  };
  return catmullRom;
}(0.5);

// node_modules/d3-shape/src/curve/catmullRomClosed.js
var CatmullRomClosed = function(context2, alpha) {
  this._context = context2;
  this._alpha = alpha;
};
CatmullRomClosed.prototype = {
  areaStart: noop_default,
  areaEnd: noop_default,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
    this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x3, this._y3);
        this._context.closePath();
        break;
      }
      case 2: {
        this._context.lineTo(this._x3, this._y3);
        this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x3, this._y3);
        this.point(this._x4, this._y4);
        this.point(this._x5, this._y5);
        break;
      }
    }
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    if (this._point) {
      var x23 = this._x2 - x2, y23 = this._y2 - y2;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }
    switch (this._point) {
      case 0:
        this._point = 1;
        this._x3 = x2, this._y3 = y2;
        break;
      case 1:
        this._point = 2;
        this._context.moveTo(this._x4 = x2, this._y4 = y2);
        break;
      case 2:
        this._point = 3;
        this._x5 = x2, this._y5 = y2;
        break;
      default:
        point5(this, x2, y2);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x2;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y2;
  }
};
var catmullRomClosed_default = function custom6(alpha) {
  function catmullRom2(context2) {
    return alpha ? new CatmullRomClosed(context2, alpha) : new CardinalClosed(context2, 0);
  }
  catmullRom2.alpha = function(alpha2) {
    return custom6(+alpha2);
  };
  return catmullRom2;
}(0.5);
// node_modules/d3-shape/src/curve/catmullRomOpen.js
var CatmullRomOpen = function(context2, alpha) {
  this._context = context2;
  this._alpha = alpha;
};
CatmullRomOpen.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function() {
    if (this._line || this._line !== 0 && this._point === 3)
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    if (this._point) {
      var x23 = this._x2 - x2, y23 = this._y2 - y2;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }
    switch (this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
        break;
      case 3:
        this._point = 4;
      default:
        point5(this, x2, y2);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x2;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y2;
  }
};
var catmullRomOpen_default = function custom7(alpha) {
  function catmullRom3(context2) {
    return alpha ? new CatmullRomOpen(context2, alpha) : new CardinalOpen(context2, 0);
  }
  catmullRom3.alpha = function(alpha2) {
    return custom7(+alpha2);
  };
  return catmullRom3;
}(0.5);
// node_modules/d3-shape/src/curve/linearClosed.js
var LinearClosed = function(context2) {
  this._context = context2;
};
LinearClosed.prototype = {
  areaStart: noop_default,
  areaEnd: noop_default,
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._point)
      this._context.closePath();
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    if (this._point)
      this._context.lineTo(x2, y2);
    else
      this._point = 1, this._context.moveTo(x2, y2);
  }
};
function linearClosed_default(context2) {
  return new LinearClosed(context2);
}
// node_modules/d3-shape/src/curve/monotone.js
var sign2 = function(x2) {
  return x2 < 0 ? -1 : 1;
};
var slope3 = function(that, x2, y2) {
  var h0 = that._x1 - that._x0, h1 = x2 - that._x1, s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0), s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0), p = (s0 * h1 + s1 * h0) / (h0 + h1);
  return (sign2(s0) + sign2(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
};
var slope2 = function(that, t) {
  var h = that._x1 - that._x0;
  return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
};
var point6 = function(that, t03, t13) {
  var { _x0: x05, _y0: y05, _x1: x12, _y1: y12 } = that, dx = (x12 - x05) / 3;
  that._context.bezierCurveTo(x05 + dx, y05 + dx * t03, x12 - dx, y12 - dx * t13, x12, y12);
};
var MonotoneX = function(context2) {
  this._context = context2;
};
var MonotoneY = function(context2) {
  this._context = new ReflectContext(context2);
};
var ReflectContext = function(context2) {
  this._context = context2;
};
function monotoneX(context2) {
  return new MonotoneX(context2);
}
function monotoneY(context2) {
  return new MonotoneY(context2);
}
MonotoneX.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
      case 3:
        point6(this, this._t0, slope2(this, this._t0));
        break;
    }
    if (this._line || this._line !== 0 && this._point === 1)
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x2, y2) {
    var t13 = NaN;
    x2 = +x2, y2 = +y2;
    if (x2 === this._x1 && y2 === this._y1)
      return;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x2, y2) : this._context.moveTo(x2, y2);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        point6(this, slope2(this, t13 = slope3(this, x2, y2)), t13);
        break;
      default:
        point6(this, this._t0, t13 = slope3(this, x2, y2));
        break;
    }
    this._x0 = this._x1, this._x1 = x2;
    this._y0 = this._y1, this._y1 = y2;
    this._t0 = t13;
  }
};
(MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x2, y2) {
  MonotoneX.prototype.point.call(this, y2, x2);
};
ReflectContext.prototype = {
  moveTo: function(x2, y2) {
    this._context.moveTo(y2, x2);
  },
  closePath: function() {
    this._context.closePath();
  },
  lineTo: function(x2, y2) {
    this._context.lineTo(y2, x2);
  },
  bezierCurveTo: function(x12, y12, x2, y2, x3, y3) {
    this._context.bezierCurveTo(y12, x12, y2, x2, y3, x3);
  }
};
// node_modules/d3-shape/src/curve/natural.js
var Natural = function(context2) {
  this._context = context2;
};
var controlPoints = function(x2) {
  var i, n = x2.length - 1, m, a2 = new Array(n), b = new Array(n), r = new Array(n);
  a2[0] = 0, b[0] = 2, r[0] = x2[0] + 2 * x2[1];
  for (i = 1;i < n - 1; ++i)
    a2[i] = 1, b[i] = 4, r[i] = 4 * x2[i] + 2 * x2[i + 1];
  a2[n - 1] = 2, b[n - 1] = 7, r[n - 1] = 8 * x2[n - 1] + x2[n];
  for (i = 1;i < n; ++i)
    m = a2[i] / b[i - 1], b[i] -= m, r[i] -= m * r[i - 1];
  a2[n - 1] = r[n - 1] / b[n - 1];
  for (i = n - 2;i >= 0; --i)
    a2[i] = (r[i] - a2[i + 1]) / b[i];
  b[n - 1] = (x2[n] + a2[n - 1]) / 2;
  for (i = 0;i < n - 1; ++i)
    b[i] = 2 * x2[i + 1] - a2[i + 1];
  return [a2, b];
};
Natural.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = [];
    this._y = [];
  },
  lineEnd: function() {
    var x2 = this._x, y2 = this._y, n = x2.length;
    if (n) {
      this._line ? this._context.lineTo(x2[0], y2[0]) : this._context.moveTo(x2[0], y2[0]);
      if (n === 2) {
        this._context.lineTo(x2[1], y2[1]);
      } else {
        var px = controlPoints(x2), py = controlPoints(y2);
        for (var i0 = 0, i1 = 1;i1 < n; ++i0, ++i1) {
          this._context.bezierCurveTo(px[0][i0], py[0][i0], px[1][i0], py[1][i0], x2[i1], y2[i1]);
        }
      }
    }
    if (this._line || this._line !== 0 && n === 1)
      this._context.closePath();
    this._line = 1 - this._line;
    this._x = this._y = null;
  },
  point: function(x2, y2) {
    this._x.push(+x2);
    this._y.push(+y2);
  }
};
function natural_default(context2) {
  return new Natural(context2);
}
// node_modules/d3-shape/src/curve/step.js
var Step = function(context2, t) {
  this._context = context2;
  this._t = t;
};
function stepBefore(context2) {
  return new Step(context2, 0);
}
function stepAfter(context2) {
  return new Step(context2, 1);
}
Step.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = this._y = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    if (0 < this._t && this._t < 1 && this._point === 2)
      this._context.lineTo(this._x, this._y);
    if (this._line || this._line !== 0 && this._point === 1)
      this._context.closePath();
    if (this._line >= 0)
      this._t = 1 - this._t, this._line = 1 - this._line;
  },
  point: function(x2, y2) {
    x2 = +x2, y2 = +y2;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x2, y2) : this._context.moveTo(x2, y2);
        break;
      case 1:
        this._point = 2;
      default: {
        if (this._t <= 0) {
          this._context.lineTo(this._x, y2);
          this._context.lineTo(x2, y2);
        } else {
          var x12 = this._x * (1 - this._t) + x2 * this._t;
          this._context.lineTo(x12, this._y);
          this._context.lineTo(x12, y2);
        }
        break;
      }
    }
    this._x = x2, this._y = y2;
  }
};
function step_default(context2) {
  return new Step(context2, 0.5);
}
// node_modules/d3-zoom/src/transform.js
function Transform(k2, x2, y2) {
  this.k = k2;
  this.x = x2;
  this.y = y2;
}
Transform.prototype = {
  constructor: Transform,
  scale: function(k2) {
    return k2 === 1 ? this : new Transform(this.k * k2, this.x, this.y);
  },
  translate: function(x2, y2) {
    return x2 === 0 & y2 === 0 ? this : new Transform(this.k, this.x + this.k * x2, this.y + this.k * y2);
  },
  apply: function(point7) {
    return [point7[0] * this.k + this.x, point7[1] * this.k + this.y];
  },
  applyX: function(x2) {
    return x2 * this.k + this.x;
  },
  applyY: function(y2) {
    return y2 * this.k + this.y;
  },
  invert: function(location) {
    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
  },
  invertX: function(x2) {
    return (x2 - this.x) / this.k;
  },
  invertY: function(y2) {
    return (y2 - this.y) / this.k;
  },
  rescaleX: function(x2) {
    return x2.copy().domain(x2.range().map(this.invertX, this).map(x2.invert, x2));
  },
  rescaleY: function(y2) {
    return y2.copy().domain(y2.range().map(this.invertY, this).map(y2.invert, y2));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var identity12 = new Transform(1, 0, 0);
transform3.prototype = Transform.prototype;
function transform3(node2) {
  while (!node2.__zoom)
    if (!(node2 = node2.parentNode))
      return identity12;
  return node2.__zoom;
}
// node_modules/@observablehq/plot/src/defined.js
function defined(x2) {
  return x2 != null && !Number.isNaN(x2);
}
function ascendingDefined2(a2, b) {
  return +defined(b) - +defined(a2) || ascending(a2, b);
}
function descendingDefined(a2, b) {
  return +defined(b) - +defined(a2) || descending(a2, b);
}
function nonempty(x2) {
  return x2 != null && `${x2}` !== "";
}
function finite(x2) {
  return isFinite(x2) ? x2 : NaN;
}
function positive(x2) {
  return x2 > 0 && isFinite(x2) ? x2 : NaN;
}
function negative(x2) {
  return x2 < 0 && isFinite(x2) ? x2 : NaN;
}

// node_modules/isoformat/src/format.js
var formatYear2 = function(year2) {
  return year2 < 0 ? `-${pad4(-year2, 6)}` : year2 > 9999 ? `+${pad4(year2, 6)}` : pad4(year2, 4);
};
var pad4 = function(value5, width) {
  return `${value5}`.padStart(width, "0");
};
function format2(date3, fallback) {
  if (!(date3 instanceof Date))
    date3 = new Date(+date3);
  if (isNaN(date3))
    return typeof fallback === "function" ? fallback(date3) : fallback;
  const hours = date3.getUTCHours();
  const minutes = date3.getUTCMinutes();
  const seconds2 = date3.getUTCSeconds();
  const milliseconds2 = date3.getUTCMilliseconds();
  return `${formatYear2(date3.getUTCFullYear(), 4)}-${pad4(date3.getUTCMonth() + 1, 2)}-${pad4(date3.getUTCDate(), 2)}${hours || minutes || seconds2 || milliseconds2 ? `T${pad4(hours, 2)}:${pad4(minutes, 2)}${seconds2 || milliseconds2 ? `:${pad4(seconds2, 2)}${milliseconds2 ? `.${pad4(milliseconds2, 3)}` : ``}` : ``}Z` : ``}`;
}
// node_modules/isoformat/src/parse.js
var re2 = /^(?:[-+]\d{2})?\d{4}(?:-\d{2}(?:-\d{2})?)?(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{3})?)?(?:Z|[-+]\d{2}:?\d{2})?)?$/;
function parse3(string3, fallback) {
  if (!re2.test(string3 += ""))
    return typeof fallback === "function" ? fallback(string3) : fallback;
  return new Date(string3);
}
// node_modules/@observablehq/plot/src/time.js
var parseInterval = function(input, intervals) {
  let name = `${input}`.toLowerCase();
  if (name.endsWith("s"))
    name = name.slice(0, -1);
  let period = 1;
  const match = /^(?:(\d+)\s+)/.exec(name);
  if (match) {
    name = name.slice(match[0].length);
    period = +match[1];
  }
  switch (name) {
    case "quarter":
      name = "month";
      period *= 3;
      break;
    case "half":
      name = "month";
      period *= 6;
      break;
  }
  let interval10 = intervals.get(name);
  if (!interval10)
    throw new Error(`unknown interval: ${input}`);
  if (!(period > 1))
    return interval10;
  if (!interval10.every)
    throw new Error(`non-periodic interval: ${name}`);
  return interval10.every(period);
};
function maybeTimeInterval(interval10) {
  return parseInterval(interval10, timeIntervals);
}
function maybeUtcInterval(interval10) {
  return parseInterval(interval10, utcIntervals);
}
function isUtcYear(i) {
  if (!i)
    return false;
  const date3 = i.floor(new Date(Date.UTC(2000, 11, 31)));
  return utcYear(date3) >= date3;
}
function isTimeYear(i) {
  if (!i)
    return false;
  const date3 = i.floor(new Date(2000, 11, 31));
  return timeYear(date3) >= date3;
}
function formatTimeTicks(scale, data2, ticks2, anchor) {
  const format3 = scale.type === "time" ? timeFormat : utcFormat;
  const template = anchor === "left" || anchor === "right" ? (f1, f2) => `\n${f1}\n${f2}` : anchor === "top" ? (f1, f2) => `${f2}\n${f1}` : (f1, f2) => `${f1}\n${f2}`;
  switch (getTimeTicksInterval(scale, data2, ticks2)) {
    case "millisecond":
      return formatConditional(format3(".%L"), format3(":%M:%S"), template);
    case "second":
      return formatConditional(format3(":%S"), format3("%-I:%M"), template);
    case "minute":
      return formatConditional(format3("%-I:%M"), format3("%p"), template);
    case "hour":
      return formatConditional(format3("%-I %p"), format3("%b %-d"), template);
    case "day":
      return formatConditional(format3("%-d"), format3("%b"), template);
    case "week":
      return formatConditional(format3("%-d"), format3("%b"), template);
    case "month":
      return formatConditional(format3("%b"), format3("%Y"), template);
    case "year":
      return format3("%Y");
  }
  throw new Error("unable to format time ticks");
}
var getTimeTicksInterval = function(scale, data2, ticks2) {
  const medianStep = median3(pairs(data2, (a2, b) => Math.abs(b - a2) || NaN));
  if (medianStep > 0)
    return formats[bisector(([, step2]) => step2).right(formats, medianStep, 1, formats.length) - 1][0];
  const [start2, stop] = extent(scale.domain());
  const count5 = typeof ticks2 === "number" ? ticks2 : 10;
  const step = Math.abs(stop - start2) / count5;
  return formats[bisector(([, step2]) => Math.log(step2)).center(formats, Math.log(step))][0];
};
var formatConditional = function(format1, format22, template) {
  return (x2, i, X3) => {
    const f1 = format1(x2, i);
    const f2 = format22(x2, i);
    const j = i - orderof(X3);
    return i !== j && X3[j] !== undefined && f2 === format22(X3[j], j) ? f1 : template(f1, f2);
  };
};
var durationSecond2 = 1000;
var durationMinute2 = durationSecond2 * 60;
var durationHour2 = durationMinute2 * 60;
var durationDay2 = durationHour2 * 24;
var durationWeek2 = durationDay2 * 7;
var durationMonth2 = durationDay2 * 30;
var durationYear2 = durationDay2 * 365;
var formats = [
  ["millisecond", 0.5 * durationSecond2],
  ["second", durationSecond2],
  ["second", 30 * durationSecond2],
  ["minute", durationMinute2],
  ["minute", 30 * durationMinute2],
  ["hour", durationHour2],
  ["hour", 12 * durationHour2],
  ["day", durationDay2],
  ["day", 2 * durationDay2],
  ["week", durationWeek2],
  ["month", durationMonth2],
  ["month", 3 * durationMonth2],
  ["year", durationYear2]
];
var timeIntervals = new Map([
  ["second", second],
  ["minute", timeMinute],
  ["hour", timeHour],
  ["day", timeDay],
  ["week", timeSunday],
  ["month", timeMonth],
  ["year", timeYear],
  ["monday", timeMonday],
  ["tuesday", timeTuesday],
  ["wednesday", timeWednesday],
  ["thursday", timeThursday],
  ["friday", timeFriday],
  ["saturday", timeSaturday],
  ["sunday", timeSunday]
]);
var utcIntervals = new Map([
  ["second", second],
  ["minute", utcMinute],
  ["hour", utcHour],
  ["day", unixDay],
  ["week", utcSunday],
  ["month", utcMonth],
  ["year", utcYear],
  ["monday", utcMonday],
  ["tuesday", utcTuesday],
  ["wednesday", utcWednesday],
  ["thursday", utcThursday],
  ["friday", utcFriday],
  ["saturday", utcSaturday],
  ["sunday", utcSunday]
]);

// node_modules/@observablehq/plot/src/options.js
function valueof(data2, value5, type6) {
  const valueType = typeof value5;
  return valueType === "string" ? maybeTypedMap(data2, field(value5), type6) : valueType === "function" ? maybeTypedMap(data2, value5, type6) : valueType === "number" || value5 instanceof Date || valueType === "boolean" ? map7(data2, constant8(value5), type6) : typeof value5?.transform === "function" ? maybeTypedArrayify(value5.transform(data2), type6) : maybeTypedArrayify(value5, type6);
}
var maybeTypedMap = function(data2, f, type6) {
  return map7(data2, type6?.prototype instanceof TypedArray ? floater(f) : f, type6);
};
var maybeTypedArrayify = function(data2, type6) {
  return type6 === undefined ? arrayify2(data2) : data2 instanceof type6 ? data2 : type6.prototype instanceof TypedArray && !(data2 instanceof TypedArray) ? type6.from(data2, coerceNumber) : type6.from(data2);
};
var floater = function(f) {
  return (d, i) => coerceNumber(f(d, i));
};
function percentile(reduce3) {
  const p = +`${reduce3}`.slice(1) / 100;
  return (I, f) => quantile(I, p, f);
}
function coerceNumbers(values3) {
  return values3 instanceof TypedArray ? values3 : map7(values3, coerceNumber, Float64Array);
}
var coerceNumber = function(x2) {
  return x2 == null ? NaN : Number(x2);
};
function coerceDates(values3) {
  return map7(values3, coerceDate);
}
function coerceDate(x2) {
  return x2 instanceof Date && !isNaN(x2) ? x2 : typeof x2 === "string" ? parse3(x2) : x2 == null || isNaN(x2 = +x2) ? undefined : new Date(x2);
}
function maybeColorChannel(value5, defaultValue) {
  if (value5 === undefined)
    value5 = defaultValue;
  return value5 === null ? [undefined, "none"] : isColor(value5) ? [undefined, value5] : [value5, undefined];
}
function maybeNumberChannel(value5, defaultValue) {
  if (value5 === undefined)
    value5 = defaultValue;
  return value5 === null || typeof value5 === "number" ? [undefined, value5] : [value5, undefined];
}
function maybeKeyword(input, name, allowed) {
  if (input != null)
    return keyword(input, name, allowed);
}
function keyword(input, name, allowed) {
  const i = `${input}`.toLowerCase();
  if (!allowed.includes(i))
    throw new Error(`invalid ${name}: ${input}`);
  return i;
}
function arrayify2(data2) {
  return data2 == null || data2 instanceof Array || data2 instanceof TypedArray ? data2 : Array.from(data2);
}
function map7(values3, f, type6 = Array) {
  return values3 == null ? values3 : values3 instanceof type6 ? values3.map(f) : type6.from(values3, f);
}
function slice2(values3, type6 = Array) {
  return values3 instanceof type6 ? values3.slice() : type6.from(values3);
}
function hasX({ x: x2, x1: x12, x2: x22 }) {
  return x2 !== undefined || x12 !== undefined || x22 !== undefined;
}
function hasY({ y: y2, y1: y12, y2: y22 }) {
  return y2 !== undefined || y12 !== undefined || y22 !== undefined;
}
function hasXY(options2) {
  return hasX(options2) || hasY(options2) || options2.interval !== undefined;
}
function isObject(option) {
  return option?.toString === objectToString;
}
function isScaleOptions(option) {
  return isObject(option) && (option.type !== undefined || option.domain !== undefined);
}
function isOptions(option) {
  return isObject(option) && typeof option.transform !== "function";
}
function isDomainSort(sort5) {
  return isOptions(sort5) && sort5.value === undefined && sort5.channel === undefined;
}
function maybeZero(x2, x12, x22, x3 = identity13) {
  if (x12 === undefined && x22 === undefined) {
    x12 = 0, x22 = x2 === undefined ? x3 : x2;
  } else if (x12 === undefined) {
    x12 = x2 === undefined ? 0 : x2;
  } else if (x22 === undefined) {
    x22 = x2 === undefined ? 0 : x2;
  }
  return [x12, x22];
}
function maybeTuple(x2, y2) {
  return x2 === undefined && y2 === undefined ? [first, second3] : [x2, y2];
}
function maybeZ({ z, fill, stroke } = {}) {
  if (z === undefined)
    [z] = maybeColorChannel(fill);
  if (z === undefined)
    [z] = maybeColorChannel(stroke);
  return z;
}
function range4(data2) {
  const n = data2.length;
  const r = new Uint32Array(n);
  for (let i = 0;i < n; ++i)
    r[i] = i;
  return r;
}
function take(values3, index2) {
  return map7(index2, (i) => values3[i]);
}
function subarray(I, i, j) {
  return I.subarray ? I.subarray(i, j) : I.slice(i, j);
}
function keyof2(value5) {
  return value5 !== null && typeof value5 === "object" ? value5.valueOf() : value5;
}
function maybeInput(key, options2) {
  if (options2[key] !== undefined)
    return options2[key];
  switch (key) {
    case "x1":
    case "x2":
      key = "x";
      break;
    case "y1":
    case "y2":
      key = "y";
      break;
  }
  return options2[key];
}
function column(source) {
  let value5;
  return [
    {
      transform: () => value5,
      label: labelof(source)
    },
    (v) => value5 = v
  ];
}
function maybeColumn(source) {
  return source == null ? [source] : column(source);
}
function labelof(value5, defaultValue) {
  return typeof value5 === "string" ? value5 : value5 && value5.label !== undefined ? value5.label : defaultValue;
}
function mid(x12, x2) {
  return {
    transform(data2) {
      const X12 = x12.transform(data2);
      const X22 = x2.transform(data2);
      return isTemporal(X12) || isTemporal(X22) ? map7(X12, (_, i) => new Date((+X12[i] + +X22[i]) / 2)) : map7(X12, (_, i) => (+X12[i] + +X22[i]) / 2, Float64Array);
    },
    label: x12.label
  };
}
function maybeApplyInterval(V, scale) {
  const t = maybeIntervalTransform(scale?.interval, scale?.type);
  return t ? map7(V, t) : V;
}
function maybeIntervalTransform(interval10, type6) {
  const i = maybeInterval(interval10, type6);
  return i && ((v) => defined(v) ? i.floor(v) : v);
}
function maybeInterval(interval10, type6) {
  if (interval10 == null)
    return;
  if (typeof interval10 === "number") {
    if (0 < interval10 && interval10 < 1 && Number.isInteger(1 / interval10))
      interval10 = -1 / interval10;
    const n = Math.abs(interval10);
    return interval10 < 0 ? {
      floor: (d) => Math.floor(d * n) / n,
      offset: (d) => (d * n + 1) / n,
      range: (lo, hi) => range3(Math.ceil(lo * n), hi * n).map((x2) => x2 / n)
    } : {
      floor: (d) => Math.floor(d / n) * n,
      offset: (d) => d + n,
      range: (lo, hi) => range3(Math.ceil(lo / n), hi / n).map((x2) => x2 * n)
    };
  }
  if (typeof interval10 === "string")
    return (type6 === "time" ? maybeTimeInterval : maybeUtcInterval)(interval10);
  if (typeof interval10.floor !== "function")
    throw new Error("invalid interval; missing floor method");
  if (typeof interval10.offset !== "function")
    throw new Error("invalid interval; missing offset method");
  return interval10;
}
function maybeRangeInterval(interval10, type6) {
  interval10 = maybeInterval(interval10, type6);
  if (interval10 && typeof interval10.range !== "function")
    throw new Error("invalid interval: missing range method");
  return interval10;
}
function maybeNiceInterval(interval10, type6) {
  interval10 = maybeRangeInterval(interval10, type6);
  if (interval10 && typeof interval10.ceil !== "function")
    throw new Error("invalid interval: missing ceil method");
  return interval10;
}
function maybeValue(value5) {
  return value5 === undefined || isOptions(value5) ? value5 : { value: value5 };
}
function numberChannel(source) {
  return source == null ? null : {
    transform: (data2) => valueof(data2, source, Float64Array),
    label: labelof(source)
  };
}
function isIterable(value5) {
  return value5 && typeof value5[Symbol.iterator] === "function";
}
function isTextual(values3) {
  for (const value5 of values3) {
    if (value5 == null)
      continue;
    return typeof value5 !== "object" || value5 instanceof Date;
  }
}
function isOrdinal(values3) {
  for (const value5 of values3) {
    if (value5 == null)
      continue;
    const type6 = typeof value5;
    return type6 === "string" || type6 === "boolean";
  }
}
function isTemporal(values3) {
  for (const value5 of values3) {
    if (value5 == null)
      continue;
    return value5 instanceof Date;
  }
}
function isTemporalString(values3) {
  for (const value5 of values3) {
    if (value5 == null)
      continue;
    return typeof value5 === "string" && isNaN(value5) && parse3(value5);
  }
}
function isNumericString(values3) {
  for (const value5 of values3) {
    if (value5 == null)
      continue;
    if (typeof value5 !== "string")
      return false;
    if (!value5.trim())
      continue;
    return !isNaN(value5);
  }
}
function isNumeric(values3) {
  for (const value5 of values3) {
    if (value5 == null)
      continue;
    return typeof value5 === "number";
  }
}
function isEvery(values3, is) {
  let every;
  for (const value5 of values3) {
    if (value5 == null)
      continue;
    if (!is(value5))
      return false;
    every = true;
  }
  return every;
}
function isColor(value5) {
  if (typeof value5 !== "string")
    return false;
  value5 = value5.toLowerCase().trim();
  return value5 === "none" || value5 === "currentcolor" || value5.startsWith("url(") && value5.endsWith(")") || value5.startsWith("var(") && value5.endsWith(")") || color(value5) !== null;
}
function isOpacity(value5) {
  return typeof value5 === "number" && (0 <= value5 && value5 <= 1 || isNaN(value5));
}
function isNoneish(value5) {
  return value5 == null || isNone(value5);
}
function isNone(value5) {
  return /^\s*none\s*$/i.test(value5);
}
function isRound(value5) {
  return /^\s*round\s*$/i.test(value5);
}
function maybeAnchor(value5, name) {
  return maybeKeyword(value5, name, [
    "middle",
    "top-left",
    "top",
    "top-right",
    "right",
    "bottom-right",
    "bottom",
    "bottom-left",
    "left"
  ]);
}
function maybeFrameAnchor(value5 = "middle") {
  return maybeAnchor(value5, "frameAnchor");
}
function orderof(values3) {
  if (values3 == null)
    return;
  const first = values3[0];
  const last2 = values3[values3.length - 1];
  return descending(first, last2);
}
function inherit2(options2 = {}, ...rest) {
  let o = options2;
  for (const defaults of rest) {
    for (const key in defaults) {
      if (o[key] === undefined) {
        const value5 = defaults[key];
        if (o === options2)
          o = { ...o, [key]: value5 };
        else
          o[key] = value5;
      }
    }
  }
  return o;
}
function named2(things) {
  console.warn("named iterables are deprecated; please use an object instead");
  const names = new Set;
  return Object.fromEntries(Array.from(things, (thing) => {
    const { name } = thing;
    if (name == null)
      throw new Error("missing name");
    const key = `${name}`;
    if (key === "__proto__")
      throw new Error(`illegal name: ${key}`);
    if (names.has(key))
      throw new Error(`duplicate name: ${key}`);
    names.add(key);
    return [name, thing];
  }));
}
function maybeNamed(things) {
  return isIterable(things) ? named2(things) : things;
}
var TypedArray = Object.getPrototypeOf(Uint8Array);
var objectToString = Object.prototype.toString;
var singleton = [null];
var field = (name) => (d) => d[name];
var indexOf = { transform: range4 };
var identity13 = { transform: (d) => d };
var one2 = () => 1;
var yes = () => true;
var string3 = (x2) => x2 == null ? x2 : `${x2}`;
var number12 = (x2) => x2 == null ? x2 : +x2;
var first = (x2) => x2 ? x2[0] : undefined;
var second3 = (x2) => x2 ? x2[1] : undefined;
var constant8 = (x2) => () => x2;

// node_modules/@observablehq/plot/src/scales/index.js
function isPosition(kind) {
  return kind === position || kind === projection2;
}
var position = Symbol("position");
var color9 = Symbol("color");
var radius = Symbol("radius");
var length2 = Symbol("length");
var opacity = Symbol("opacity");
var symbol = Symbol("symbol");
var projection2 = Symbol("projection");
var registry = new Map([
  ["x", position],
  ["y", position],
  ["fx", position],
  ["fy", position],
  ["r", radius],
  ["color", color9],
  ["opacity", opacity],
  ["symbol", symbol],
  ["length", length2],
  ["projection", projection2]
]);

// node_modules/@observablehq/plot/src/symbol.js
var isSymbolObject = function(value5) {
  return value5 && typeof value5.draw === "function";
};
function isSymbol(value5) {
  if (isSymbolObject(value5))
    return true;
  if (typeof value5 !== "string")
    return false;
  return symbols.has(value5.toLowerCase());
}
function maybeSymbol(symbol2) {
  if (symbol2 == null || isSymbolObject(symbol2))
    return symbol2;
  const value5 = symbols.get(`${symbol2}`.toLowerCase());
  if (value5)
    return value5;
  throw new Error(`invalid symbol: ${symbol2}`);
}
function maybeSymbolChannel(symbol2) {
  if (symbol2 == null || isSymbolObject(symbol2))
    return [undefined, symbol2];
  if (typeof symbol2 === "string") {
    const value5 = symbols.get(`${symbol2}`.toLowerCase());
    if (value5)
      return [undefined, value5];
  }
  return [symbol2, undefined];
}
var sqrt35 = Math.sqrt(3);
var sqrt4_3 = 2 / sqrt35;
var symbolHexagon = {
  draw(context2, size2) {
    const rx = Math.sqrt(size2 / Math.PI), ry = rx * sqrt4_3, hy = ry / 2;
    context2.moveTo(0, ry);
    context2.lineTo(rx, hy);
    context2.lineTo(rx, -hy);
    context2.lineTo(0, -ry);
    context2.lineTo(-rx, -hy);
    context2.lineTo(-rx, hy);
    context2.closePath();
  }
};
var symbols = new Map([
  ["asterisk", asterisk_default],
  ["circle", circle_default2],
  ["cross", cross_default],
  ["diamond", diamond_default],
  ["diamond2", diamond2_default],
  ["hexagon", symbolHexagon],
  ["plus", plus_default],
  ["square", square_default],
  ["square2", square2_default],
  ["star", star_default],
  ["times", times_default],
  ["triangle", triangle_default],
  ["triangle2", triangle2_default],
  ["wye", wye_default]
]);

// node_modules/@observablehq/plot/src/transforms/basic.js
function basic({ filter: f1, sort: s1, reverse: r1, transform: t13, initializer: i1, ...options3 } = {}, transform5) {
  if (t13 === undefined) {
    if (f1 != null)
      t13 = filterTransform(f1);
    if (s1 != null && !isDomainSort(s1))
      t13 = composeTransform(t13, sortTransform(s1));
    if (r1)
      t13 = composeTransform(t13, reverseTransform);
  }
  if (transform5 != null && i1 != null)
    throw new Error("transforms cannot be applied after initializers");
  return {
    ...options3,
    ...(s1 === null || isDomainSort(s1)) && { sort: s1 },
    transform: composeTransform(t13, transform5)
  };
}
function initializer({ filter: f1, sort: s1, reverse: r1, initializer: i1, ...options3 } = {}, initializer2) {
  if (i1 === undefined) {
    if (f1 != null)
      i1 = filterTransform(f1);
    if (s1 != null && !isDomainSort(s1))
      i1 = composeInitializer(i1, sortTransform(s1));
    if (r1)
      i1 = composeInitializer(i1, reverseTransform);
  }
  return {
    ...options3,
    ...(s1 === null || isDomainSort(s1)) && { sort: s1 },
    initializer: composeInitializer(i1, initializer2)
  };
}
var composeTransform = function(t13, t22) {
  if (t13 == null)
    return t22 === null ? undefined : t22;
  if (t22 == null)
    return t13 === null ? undefined : t13;
  return function(data2, facets, plotOptions) {
    ({ data: data2, facets } = t13.call(this, data2, facets, plotOptions));
    return t22.call(this, arrayify2(data2), facets, plotOptions);
  };
};
var composeInitializer = function(i1, i2) {
  if (i1 == null)
    return i2 === null ? undefined : i2;
  if (i2 == null)
    return i1 === null ? undefined : i1;
  return function(data2, facets, channels, ...args) {
    let c1, d1, f1, c22, d2, f2;
    ({ data: d1 = data2, facets: f1 = facets, channels: c1 } = i1.call(this, data2, facets, channels, ...args));
    ({ data: d2 = d1, facets: f2 = f1, channels: c22 } = i2.call(this, d1, f1, { ...channels, ...c1 }, ...args));
    return { data: d2, facets: f2, channels: { ...c1, ...c22 } };
  };
};
var apply = function(options3, t) {
  return (options3.initializer != null ? initializer : basic)(options3, t);
};
var filterTransform = function(value5) {
  return (data2, facets) => {
    const V = valueof(data2, value5);
    return { data: data2, facets: facets.map((I) => I.filter((i) => V[i])) };
  };
};
var reverseTransform = function(data2, facets) {
  return { data: data2, facets: facets.map((I) => I.slice().reverse()) };
};
function sort5(order2, { sort: sort6, ...options3 } = {}) {
  return {
    ...(isOptions(order2) && order2.channel !== undefined ? initializer : apply)(options3, sortTransform(order2)),
    sort: isDomainSort(sort6) ? sort6 : null
  };
}
var sortTransform = function(value5) {
  return (typeof value5 === "function" && value5.length !== 1 ? sortData : sortValue)(value5);
};
var sortData = function(compare) {
  return (data2, facets) => {
    const compareData = (i, j) => compare(data2[i], data2[j]);
    return { data: data2, facets: facets.map((I) => I.slice().sort(compareData)) };
  };
};
var sortValue = function(value5) {
  let channel, order2;
  ({ channel, value: value5, order: order2 } = { ...maybeValue(value5) });
  const negate = channel?.startsWith("-");
  if (negate)
    channel = channel.slice(1);
  if (order2 === undefined)
    order2 = negate ? descendingDefined : ascendingDefined2;
  if (typeof order2 !== "function") {
    switch (`${order2}`.toLowerCase()) {
      case "ascending":
        order2 = ascendingDefined2;
        break;
      case "descending":
        order2 = descendingDefined;
        break;
      default:
        throw new Error(`invalid order: ${order2}`);
    }
  }
  return (data2, facets, channels) => {
    let V;
    if (channel === undefined) {
      V = valueof(data2, value5);
    } else {
      if (channels === undefined)
        throw new Error("channel sort requires an initializer");
      V = channels[channel];
      if (!V)
        return {};
      V = V.value;
    }
    const compareValue = (i, j) => order2(V[i], V[j]);
    return { data: data2, facets: facets.map((I) => I.slice().sort(compareValue)) };
  };
};

// node_modules/@observablehq/plot/src/transforms/group.js
function hasOutput(outputs, ...names) {
  for (const { name } of outputs) {
    if (names.includes(name)) {
      return true;
    }
  }
  return false;
}
function maybeOutputs(outputs, inputs, asOutput = maybeOutput) {
  const entries = Object.entries(outputs);
  if (inputs.title != null && outputs.title === undefined)
    entries.push(["title", reduceTitle]);
  if (inputs.href != null && outputs.href === undefined)
    entries.push(["href", reduceFirst]);
  return entries.filter(([, reduce3]) => reduce3 !== undefined).map(([name, reduce3]) => reduce3 === null ? nullOutput(name) : asOutput(name, reduce3, inputs));
}
function maybeOutput(name, reduce3, inputs, asEvaluator = maybeEvaluator) {
  let scale;
  if (isObject(reduce3) && ("reduce" in reduce3))
    scale = reduce3.scale, reduce3 = reduce3.reduce;
  const evaluator = asEvaluator(name, reduce3, inputs);
  const [output, setOutput] = column(evaluator.label);
  let O;
  return {
    name,
    output: scale === undefined ? output : { value: output, scale },
    initialize(data2) {
      evaluator.initialize(data2);
      O = setOutput([]);
    },
    scope(scope, I) {
      evaluator.scope(scope, I);
    },
    reduce(I, extent2) {
      O.push(evaluator.reduce(I, extent2));
    }
  };
}
var nullOutput = function(name) {
  return { name, initialize() {
  }, scope() {
  }, reduce() {
  } };
};
function maybeEvaluator(name, reduce3, inputs, asReduce = maybeReduce) {
  const input = maybeInput(name, inputs);
  const reducer2 = asReduce(reduce3, input);
  let V, context2;
  return {
    label: labelof(reducer2 === reduceCount ? null : input, reducer2.label),
    initialize(data2) {
      V = input === undefined ? data2 : valueof(data2, input);
      if (reducer2.scope === "data") {
        context2 = reducer2.reduceIndex(range4(data2), V);
      }
    },
    scope(scope, I) {
      if (reducer2.scope === scope) {
        context2 = reducer2.reduceIndex(I, V);
      }
    },
    reduce(I, extent2) {
      return reducer2.scope == null ? reducer2.reduceIndex(I, V, extent2) : reducer2.reduceIndex(I, V, context2, extent2);
    }
  };
}
function maybeGroup(I, X3) {
  return X3 ? sort(group(I, (i) => X3[i]), first) : [[, I]];
}
function maybeReduce(reduce3, value5, fallback = invalidReduce) {
  if (reduce3 == null)
    return fallback(reduce3);
  if (typeof reduce3.reduceIndex === "function")
    return reduce3;
  if (typeof reduce3.reduce === "function" && isObject(reduce3))
    return reduceReduce(reduce3);
  if (typeof reduce3 === "function")
    return reduceFunction(reduce3);
  if (/^p\d{2}$/i.test(reduce3))
    return reduceAccessor(percentile(reduce3));
  switch (`${reduce3}`.toLowerCase()) {
    case "first":
      return reduceFirst;
    case "last":
      return reduceLast;
    case "identity":
      return reduceIdentity;
    case "count":
      return reduceCount;
    case "distinct":
      return reduceDistinct;
    case "sum":
      return value5 == null ? reduceCount : reduceSum;
    case "proportion":
      return reduceProportion(value5, "data");
    case "proportion-facet":
      return reduceProportion(value5, "facet");
    case "deviation":
      return reduceAccessor(deviation);
    case "min":
      return reduceAccessor(min);
    case "min-index":
      return reduceAccessor(minIndex);
    case "max":
      return reduceAccessor(max3);
    case "max-index":
      return reduceAccessor(maxIndex);
    case "mean":
      return reduceMaybeTemporalAccessor(mean4);
    case "median":
      return reduceMaybeTemporalAccessor(median3);
    case "variance":
      return reduceAccessor(variance);
    case "mode":
      return reduceAccessor(mode);
  }
  return fallback(reduce3);
}
var invalidReduce = function(reduce3) {
  throw new Error(`invalid reduce: ${reduce3}`);
};
function maybeSubgroup(outputs, inputs) {
  for (const name in inputs) {
    const value5 = inputs[name];
    if (value5 !== undefined && !outputs.some((o) => o.name === name)) {
      return value5;
    }
  }
}
function maybeSort(facets, sort6, reverse2) {
  if (sort6) {
    const S = sort6.output.transform();
    const compare = (i, j) => ascendingDefined2(S[i], S[j]);
    facets.forEach((f) => f.sort(compare));
  }
  if (reverse2) {
    facets.forEach((f) => f.reverse());
  }
}
var reduceReduce = function(reduce3) {
  console.warn("deprecated reduce interface; implement reduceIndex instead.");
  return { ...reduce3, reduceIndex: reduce3.reduce.bind(reduce3) };
};
var reduceFunction = function(f) {
  return {
    reduceIndex(I, X3, extent2) {
      return f(take(X3, I), extent2);
    }
  };
};
var reduceAccessor = function(f) {
  return {
    reduceIndex(I, X3) {
      return f(I, (i) => X3[i]);
    }
  };
};
var reduceMaybeTemporalAccessor = function(f) {
  return {
    reduceIndex(I, X3) {
      const x2 = f(I, (i) => X3[i]);
      return isTemporal(X3) ? new Date(x2) : x2;
    }
  };
};
var reduceProportion = function(value5, scope) {
  return value5 == null ? { scope, label: "Frequency", reduceIndex: (I, V, basis7 = 1) => I.length / basis7 } : { scope, reduceIndex: (I, V, basis7 = 1) => sum3(I, (i) => V[i]) / basis7 };
};
var reduceIdentity = {
  reduceIndex(I, X3) {
    return take(X3, I);
  }
};
var reduceFirst = {
  reduceIndex(I, X3) {
    return X3[I[0]];
  }
};
var reduceTitle = {
  reduceIndex(I, X3) {
    const n = 5;
    const groups2 = sort(rollup(I, (V) => V.length, (i) => X3[i]), second3);
    const top2 = groups2.slice(-n).reverse();
    if (top2.length < groups2.length) {
      const bottom2 = groups2.slice(0, 1 - n);
      top2[n - 1] = [`\u2026 ${bottom2.length.toLocaleString("en-US")} more`, sum3(bottom2, second3)];
    }
    return top2.map(([key, value5]) => `${key} (${value5.toLocaleString("en-US")})`).join("\n");
  }
};
var reduceLast = {
  reduceIndex(I, X3) {
    return X3[I[I.length - 1]];
  }
};
var reduceCount = {
  label: "Frequency",
  reduceIndex(I) {
    return I.length;
  }
};
var reduceDistinct = {
  label: "Distinct",
  reduceIndex(I, X3) {
    const s2 = new InternSet;
    for (const i of I)
      s2.add(X3[i]);
    return s2.size;
  }
};
var reduceSum = reduceAccessor(sum3);

// node_modules/@observablehq/plot/src/channel.js
function createChannel(data2, { scale, type: type6, value: value5, filter: filter6, hint }, name) {
  if (hint === undefined && typeof value5?.transform === "function")
    hint = value5.hint;
  return inferChannelScale(name, {
    scale,
    type: type6,
    value: valueof(data2, value5),
    label: labelof(value5),
    filter: filter6,
    hint
  });
}
function createChannels(channels, data2) {
  return Object.fromEntries(Object.entries(channels).map(([name, channel]) => [name, createChannel(data2, channel, name)]));
}
function valueObject(channels, scales2) {
  const values3 = Object.fromEntries(Object.entries(channels).map(([name, { scale: scaleName, value: value5 }]) => {
    const scale = scaleName == null ? null : scales2[scaleName];
    return [name, scale == null ? value5 : map7(value5, scale)];
  }));
  values3.channels = channels;
  return values3;
}
function inferChannelScale(name, channel) {
  const { scale, value: value5 } = channel;
  if (scale === true || scale === "auto") {
    switch (name) {
      case "fill":
      case "stroke":
      case "color":
        channel.scale = scale !== true && isEvery(value5, isColor) ? null : "color";
        break;
      case "fillOpacity":
      case "strokeOpacity":
      case "opacity":
        channel.scale = scale !== true && isEvery(value5, isOpacity) ? null : "opacity";
        break;
      case "symbol":
        if (scale !== true && isEvery(value5, isSymbol)) {
          channel.scale = null;
          channel.value = map7(value5, maybeSymbol);
        } else {
          channel.scale = "symbol";
        }
        break;
      default:
        channel.scale = registry.has(name) ? name : null;
        break;
    }
  } else if (scale === false) {
    channel.scale = null;
  } else if (scale != null && !registry.has(scale)) {
    throw new Error(`unknown scale: ${scale}`);
  }
  return channel;
}
function channelDomain(data2, facets, channels, facetChannels, options5) {
  const { order: defaultOrder, reverse: defaultReverse, reduce: defaultReduce = true, limit: defaultLimit } = options5;
  for (const x2 in options5) {
    if (!registry.has(x2))
      continue;
    let { value: y2, order: order2 = defaultOrder, reverse: reverse2 = defaultReverse, reduce: reduce3 = defaultReduce, limit = defaultLimit } = maybeValue(options5[x2]);
    const negate = y2?.startsWith("-");
    if (negate)
      y2 = y2.slice(1);
    order2 = order2 === undefined ? negate !== (y2 === "width" || y2 === "height") ? descendingGroup : ascendingGroup : maybeOrder(order2);
    if (reduce3 == null || reduce3 === false)
      continue;
    const X3 = x2 === "fx" || x2 === "fy" ? reindexFacetChannel(facets, facetChannels[x2]) : findScaleChannel(channels, x2);
    if (!X3)
      throw new Error(`missing channel for scale: ${x2}`);
    const XV = X3.value;
    const [lo = 0, hi = Infinity] = isIterable(limit) ? limit : limit < 0 ? [limit] : [0, limit];
    if (y2 == null) {
      X3.domain = () => {
        let domain = Array.from(new InternSet(XV));
        if (reverse2)
          domain = domain.reverse();
        if (lo !== 0 || hi !== Infinity)
          domain = domain.slice(lo, hi);
        return domain;
      };
    } else {
      const YV = y2 === "data" ? data2 : y2 === "height" ? difference(channels, "y1", "y2") : y2 === "width" ? difference(channels, "x1", "x2") : values3(channels, y2, y2 === "y" ? "y2" : y2 === "x" ? "x2" : undefined);
      const reducer2 = maybeReduce(reduce3 === true ? "max" : reduce3, YV);
      X3.domain = () => {
        let domain = rollups(range4(XV), (I) => reducer2.reduceIndex(I, YV), (i) => XV[i]);
        if (order2)
          domain.sort(order2);
        if (reverse2)
          domain.reverse();
        if (lo !== 0 || hi !== Infinity)
          domain = domain.slice(lo, hi);
        return domain.map(first);
      };
    }
  }
}
var findScaleChannel = function(channels, scale) {
  for (const name in channels) {
    const channel = channels[name];
    if (channel.scale === scale)
      return channel;
  }
};
var reindexFacetChannel = function(facets, channel) {
  const originalFacets = facets.original;
  if (originalFacets === facets)
    return channel;
  const V1 = channel.value;
  const V2 = channel.value = [];
  for (let i = 0;i < originalFacets.length; ++i) {
    const vi = V1[originalFacets[i][0]];
    for (const j of facets[i])
      V2[j] = vi;
  }
  return channel;
};
var difference = function(channels, k1, k2) {
  const X12 = values3(channels, k1);
  const X22 = values3(channels, k2);
  return map7(X22, (x2, i) => Math.abs(x2 - X12[i]), Float64Array);
};
var values3 = function(channels, name, alias) {
  let channel = channels[name];
  if (!channel && alias !== undefined)
    channel = channels[alias];
  if (channel)
    return channel.value;
  throw new Error(`missing channel: ${name}`);
};
var maybeOrder = function(order2) {
  if (order2 == null || typeof order2 === "function")
    return order2;
  switch (`${order2}`.toLowerCase()) {
    case "ascending":
      return ascendingGroup;
    case "descending":
      return descendingGroup;
  }
  throw new Error(`invalid order: ${order2}`);
};
var ascendingGroup = function([ak, av], [bk, bv]) {
  return ascendingDefined2(av, bv) || ascendingDefined2(ak, bk);
};
var descendingGroup = function([ak, av], [bk, bv]) {
  return descendingDefined(av, bv) || ascendingDefined2(ak, bk);
};
function getSource(channels, key) {
  let channel = channels[key];
  if (!channel)
    return;
  while (channel.source)
    channel = channel.source;
  return channel.source === null ? null : channel;
}

// node_modules/@observablehq/plot/src/memoize.js
function memoize1(compute2) {
  let cacheValue, cacheKeys;
  return (...keys9) => {
    if (cacheKeys?.length !== keys9.length || cacheKeys.some((k2, i) => k2 !== keys9[i])) {
      cacheKeys = keys9;
      cacheValue = compute2(...keys9);
    }
    return cacheValue;
  };
}

// node_modules/@observablehq/plot/src/format.js
function formatNumber(locale5 = "en-US") {
  const format3 = numberFormat(locale5);
  return (i) => i != null && !isNaN(i) ? format3.format(i) : undefined;
}
function formatIsoDate(date3) {
  return format2(date3, "Invalid Date");
}
function formatAuto(locale5 = "en-US") {
  const number13 = formatNumber(locale5);
  return (v) => (v instanceof Date ? formatIsoDate : typeof v === "number" ? number13 : string3)(v);
}
var numberFormat = memoize1((locale5) => {
  return new Intl.NumberFormat(locale5);
});
var monthFormat = memoize1((locale5, month2) => {
  return new Intl.DateTimeFormat(locale5, { timeZone: "UTC", ...month2 && { month: month2 } });
});
var weekdayFormat = memoize1((locale5, weekday) => {
  return new Intl.DateTimeFormat(locale5, { timeZone: "UTC", ...weekday && { weekday } });
});
var formatDefault = formatAuto();

// node_modules/@observablehq/plot/src/warnings.js
function consumeWarnings() {
  const w = warnings;
  warnings = 0;
  return w;
}
function warn(message) {
  console.warn(message);
  ++warnings;
}
var warnings = 0;

// node_modules/@observablehq/plot/src/style.js
var getClipId = function() {
  return `plot-clip-${++nextClipId}`;
};
function styles(mark, {
  title,
  href,
  ariaLabel: variaLabel,
  ariaDescription,
  ariaHidden,
  target,
  fill,
  fillOpacity,
  stroke,
  strokeWidth,
  strokeOpacity,
  strokeLinejoin,
  strokeLinecap,
  strokeMiterlimit,
  strokeDasharray,
  strokeDashoffset,
  opacity: opacity2,
  mixBlendMode,
  imageFilter,
  paintOrder,
  pointerEvents,
  shapeRendering,
  channels
}, {
  ariaLabel: cariaLabel,
  fill: defaultFill = "currentColor",
  fillOpacity: defaultFillOpacity,
  stroke: defaultStroke = "none",
  strokeOpacity: defaultStrokeOpacity,
  strokeWidth: defaultStrokeWidth,
  strokeLinecap: defaultStrokeLinecap,
  strokeLinejoin: defaultStrokeLinejoin,
  strokeMiterlimit: defaultStrokeMiterlimit,
  paintOrder: defaultPaintOrder
}) {
  if (defaultFill === null) {
    fill = null;
    fillOpacity = null;
  }
  if (defaultStroke === null) {
    stroke = null;
    strokeOpacity = null;
  }
  if (isNoneish(defaultFill)) {
    if (!isNoneish(defaultStroke) && (!isNoneish(fill) || channels?.fill))
      defaultStroke = "none";
  } else {
    if (isNoneish(defaultStroke) && (!isNoneish(stroke) || channels?.stroke))
      defaultFill = "none";
  }
  const [vfill, cfill] = maybeColorChannel(fill, defaultFill);
  const [vfillOpacity, cfillOpacity] = maybeNumberChannel(fillOpacity, defaultFillOpacity);
  const [vstroke, cstroke] = maybeColorChannel(stroke, defaultStroke);
  const [vstrokeOpacity, cstrokeOpacity] = maybeNumberChannel(strokeOpacity, defaultStrokeOpacity);
  const [vopacity, copacity] = maybeNumberChannel(opacity2);
  if (!isNone(cstroke)) {
    if (strokeWidth === undefined)
      strokeWidth = defaultStrokeWidth;
    if (strokeLinecap === undefined)
      strokeLinecap = defaultStrokeLinecap;
    if (strokeLinejoin === undefined)
      strokeLinejoin = defaultStrokeLinejoin;
    if (strokeMiterlimit === undefined && !isRound(strokeLinejoin))
      strokeMiterlimit = defaultStrokeMiterlimit;
    if (!isNone(cfill) && paintOrder === undefined)
      paintOrder = defaultPaintOrder;
  }
  const [vstrokeWidth, cstrokeWidth] = maybeNumberChannel(strokeWidth);
  if (defaultFill !== null) {
    mark.fill = impliedString(cfill, "currentColor");
    mark.fillOpacity = impliedNumber(cfillOpacity, 1);
  }
  if (defaultStroke !== null) {
    mark.stroke = impliedString(cstroke, "none");
    mark.strokeWidth = impliedNumber(cstrokeWidth, 1);
    mark.strokeOpacity = impliedNumber(cstrokeOpacity, 1);
    mark.strokeLinejoin = impliedString(strokeLinejoin, "miter");
    mark.strokeLinecap = impliedString(strokeLinecap, "butt");
    mark.strokeMiterlimit = impliedNumber(strokeMiterlimit, 4);
    mark.strokeDasharray = impliedString(strokeDasharray, "none");
    mark.strokeDashoffset = impliedString(strokeDashoffset, "0");
  }
  mark.target = string3(target);
  mark.ariaLabel = string3(cariaLabel);
  mark.ariaDescription = string3(ariaDescription);
  mark.ariaHidden = string3(ariaHidden);
  mark.opacity = impliedNumber(copacity, 1);
  mark.mixBlendMode = impliedString(mixBlendMode, "normal");
  mark.imageFilter = impliedString(imageFilter, "none");
  mark.paintOrder = impliedString(paintOrder, "normal");
  mark.pointerEvents = impliedString(pointerEvents, "auto");
  mark.shapeRendering = impliedString(shapeRendering, "auto");
  return {
    title: { value: title, optional: true, filter: null },
    href: { value: href, optional: true, filter: null },
    ariaLabel: { value: variaLabel, optional: true, filter: null },
    fill: { value: vfill, scale: "auto", optional: true },
    fillOpacity: { value: vfillOpacity, scale: "auto", optional: true },
    stroke: { value: vstroke, scale: "auto", optional: true },
    strokeOpacity: { value: vstrokeOpacity, scale: "auto", optional: true },
    strokeWidth: { value: vstrokeWidth, optional: true },
    opacity: { value: vopacity, scale: "auto", optional: true }
  };
}
function applyTitle(selection5, L) {
  if (L)
    selection5.filter((i) => nonempty(L[i])).append("title").call(applyText, L);
}
function applyTitleGroup(selection5, L) {
  if (L)
    selection5.filter(([i]) => nonempty(L[i])).append("title").call(applyTextGroup, L);
}
function applyText(selection5, T) {
  if (T)
    selection5.text((i) => formatDefault(T[i]));
}
function applyTextGroup(selection5, T) {
  if (T)
    selection5.text(([i]) => formatDefault(T[i]));
}
function applyChannelStyles(selection5, { target, tip }, {
  ariaLabel: AL,
  title: T,
  fill: F,
  fillOpacity: FO,
  stroke: S,
  strokeOpacity: SO,
  strokeWidth: SW,
  opacity: O,
  href: H
}) {
  if (AL)
    applyAttr(selection5, "aria-label", (i) => AL[i]);
  if (F)
    applyAttr(selection5, "fill", (i) => F[i]);
  if (FO)
    applyAttr(selection5, "fill-opacity", (i) => FO[i]);
  if (S)
    applyAttr(selection5, "stroke", (i) => S[i]);
  if (SO)
    applyAttr(selection5, "stroke-opacity", (i) => SO[i]);
  if (SW)
    applyAttr(selection5, "stroke-width", (i) => SW[i]);
  if (O)
    applyAttr(selection5, "opacity", (i) => O[i]);
  if (H)
    applyHref(selection5, (i) => H[i], target);
  if (!tip)
    applyTitle(selection5, T);
}
function applyGroupedChannelStyles(selection5, { target, tip }, {
  ariaLabel: AL,
  title: T,
  fill: F,
  fillOpacity: FO,
  stroke: S,
  strokeOpacity: SO,
  strokeWidth: SW,
  opacity: O,
  href: H
}) {
  if (AL)
    applyAttr(selection5, "aria-label", ([i]) => AL[i]);
  if (F)
    applyAttr(selection5, "fill", ([i]) => F[i]);
  if (FO)
    applyAttr(selection5, "fill-opacity", ([i]) => FO[i]);
  if (S)
    applyAttr(selection5, "stroke", ([i]) => S[i]);
  if (SO)
    applyAttr(selection5, "stroke-opacity", ([i]) => SO[i]);
  if (SW)
    applyAttr(selection5, "stroke-width", ([i]) => SW[i]);
  if (O)
    applyAttr(selection5, "opacity", ([i]) => O[i]);
  if (H)
    applyHref(selection5, ([i]) => H[i], target);
  if (!tip)
    applyTitleGroup(selection5, T);
}
var groupAesthetics = function({
  ariaLabel: AL,
  title: T,
  fill: F,
  fillOpacity: FO,
  stroke: S,
  strokeOpacity: SO,
  strokeWidth: SW,
  opacity: O,
  href: H
}, { tip }) {
  return [AL, tip ? undefined : T, F, FO, S, SO, SW, O, H].filter((c4) => c4 !== undefined);
};
function groupZ(I, Z, z) {
  const G = group(I, (i) => Z[i]);
  if (z === undefined && G.size > 1 + I.length >> 1) {
    warn(`Warning: the implicit z channel has high cardinality. This may occur when the fill or stroke channel is associated with quantitative data rather than ordinal or categorical data. You can suppress this warning by setting the z option explicitly; if this data represents a single series, set z to null.`);
  }
  return G.values();
}
function* groupIndex(I, position2, mark, channels) {
  const { z } = mark;
  const { z: Z } = channels;
  const A5 = groupAesthetics(channels, mark);
  const C2 = [...position2, ...A5];
  for (const G of Z ? groupZ(I, Z, z) : [I]) {
    let Ag;
    let Gg;
    out:
      for (const i of G) {
        for (const c4 of C2) {
          if (!defined(c4[i])) {
            if (Gg)
              Gg.push(-1);
            continue out;
          }
        }
        if (Ag === undefined) {
          if (Gg)
            yield Gg;
          Ag = A5.map((c4) => keyof2(c4[i])), Gg = [i];
          continue;
        }
        Gg.push(i);
        for (let j = 0;j < A5.length; ++j) {
          const k2 = keyof2(A5[j][i]);
          if (k2 !== Ag[j]) {
            yield Gg;
            Ag = A5.map((c4) => keyof2(c4[i])), Gg = [i];
            continue out;
          }
        }
      }
    if (Gg)
      yield Gg;
  }
}
function maybeClip(clip) {
  if (clip === true)
    clip = "frame";
  else if (clip === false)
    clip = null;
  else if (clip != null)
    clip = keyword(clip, "clip", ["frame", "sphere"]);
  return clip;
}
var applyClip = function(selection5, mark, dimensions, context3) {
  let clipUrl;
  const { clip = context3.clip } = mark;
  switch (clip) {
    case "frame": {
      const { width, height, marginLeft, marginRight, marginTop, marginBottom } = dimensions;
      const id2 = getClipId();
      clipUrl = `url(#${id2})`;
      selection5 = create2("svg:g", context3).call((g) => g.append("svg:clipPath").attr("id", id2).append("rect").attr("x", marginLeft).attr("y", marginTop).attr("width", width - marginRight - marginLeft).attr("height", height - marginTop - marginBottom)).each(function() {
        this.appendChild(selection5.node());
        selection5.node = () => this;
      });
      break;
    }
    case "sphere": {
      const { projection: projection3 } = context3;
      if (!projection3)
        throw new Error(`the "sphere" clip option requires a projection`);
      const id2 = getClipId();
      clipUrl = `url(#${id2})`;
      selection5.append("clipPath").attr("id", id2).append("path").attr("d", path_default(projection3)({ type: "Sphere" }));
      break;
    }
  }
  applyAttr(selection5, "aria-label", mark.ariaLabel);
  applyAttr(selection5, "aria-description", mark.ariaDescription);
  applyAttr(selection5, "aria-hidden", mark.ariaHidden);
  applyAttr(selection5, "clip-path", clipUrl);
};
function applyIndirectStyles(selection5, mark, dimensions, context3) {
  applyClip(selection5, mark, dimensions, context3);
  applyAttr(selection5, "fill", mark.fill);
  applyAttr(selection5, "fill-opacity", mark.fillOpacity);
  applyAttr(selection5, "stroke", mark.stroke);
  applyAttr(selection5, "stroke-width", mark.strokeWidth);
  applyAttr(selection5, "stroke-opacity", mark.strokeOpacity);
  applyAttr(selection5, "stroke-linejoin", mark.strokeLinejoin);
  applyAttr(selection5, "stroke-linecap", mark.strokeLinecap);
  applyAttr(selection5, "stroke-miterlimit", mark.strokeMiterlimit);
  applyAttr(selection5, "stroke-dasharray", mark.strokeDasharray);
  applyAttr(selection5, "stroke-dashoffset", mark.strokeDashoffset);
  applyAttr(selection5, "shape-rendering", mark.shapeRendering);
  applyAttr(selection5, "filter", mark.imageFilter);
  applyAttr(selection5, "paint-order", mark.paintOrder);
  const { pointerEvents = context3.pointerSticky === false ? "none" : undefined } = mark;
  applyAttr(selection5, "pointer-events", pointerEvents);
}
function applyDirectStyles(selection5, mark) {
  applyStyle(selection5, "mix-blend-mode", mark.mixBlendMode);
  applyAttr(selection5, "opacity", mark.opacity);
}
var applyHref = function(selection5, href, target) {
  selection5.each(function(i) {
    const h = href(i);
    if (h != null) {
      const a2 = this.ownerDocument.createElementNS(namespaces_default.svg, "a");
      a2.setAttribute("fill", "inherit");
      a2.setAttributeNS(namespaces_default.xlink, "href", h);
      if (target != null)
        a2.setAttribute("target", target);
      this.parentNode.insertBefore(a2, this).appendChild(this);
    }
  });
};
function applyAttr(selection5, name, value5) {
  if (value5 != null)
    selection5.attr(name, value5);
}
function applyStyle(selection5, name, value5) {
  if (value5 != null)
    selection5.style(name, value5);
}
function applyTransform(selection5, mark, { x: x2, y: y2 }, tx = offset, ty = offset) {
  tx += mark.dx;
  ty += mark.dy;
  if (x2?.bandwidth)
    tx += x2.bandwidth() / 2;
  if (y2?.bandwidth)
    ty += y2.bandwidth() / 2;
  if (tx || ty)
    selection5.attr("transform", `translate(${tx},${ty})`);
}
function impliedString(value5, impliedValue) {
  if ((value5 = string3(value5)) !== impliedValue)
    return value5;
}
function impliedNumber(value5, impliedValue) {
  if ((value5 = number12(value5)) !== impliedValue)
    return value5;
}
function maybeClassName(name) {
  if (name === undefined)
    return "plot-d6a7b5";
  name = `${name}`;
  if (!validClassName.test(name))
    throw new Error(`invalid class name: ${name}`);
  return name;
}
function applyInlineStyles(selection5, style3) {
  if (typeof style3 === "string") {
    selection5.property("style", style3);
  } else if (style3 != null) {
    for (const element of selection5) {
      Object.assign(element.style, style3);
    }
  }
}
function applyFrameAnchor({ frameAnchor }, { width, height, marginTop, marginRight, marginBottom, marginLeft }) {
  return [
    /left$/.test(frameAnchor) ? marginLeft : /right$/.test(frameAnchor) ? width - marginRight : (marginLeft + width - marginRight) / 2,
    /^top/.test(frameAnchor) ? marginTop : /^bottom/.test(frameAnchor) ? height - marginBottom : (marginTop + height - marginBottom) / 2
  ];
}
var offset = (typeof window !== "undefined" ? window.devicePixelRatio > 1 : typeof it === "undefined") ? 0 : 0.5;
var nextClipId = 0;
var validClassName = /^-?([_a-z]|[\240-\377]|\\[0-9a-f]{1,6}(\r\n|[ \t\r\n\f])?|\\[^\r\n\f0-9a-f])([_a-z0-9-]|[\240-\377]|\\[0-9a-f]{1,6}(\r\n|[ \t\r\n\f])?|\\[^\r\n\f0-9a-f])*$/i;

// node_modules/@observablehq/plot/src/context.js
function createContext(options8 = {}) {
  const { document: document2 = typeof window !== "undefined" ? window.document : undefined, clip } = options8;
  return { document: document2, clip: maybeClip(clip) };
}
function create2(name, { document: document2 }) {
  return select_default2(creator_default(name).call(document2.documentElement));
}

// node_modules/@observablehq/plot/src/projection.js
function createProjection({
  projection: projection3,
  inset: globalInset = 0,
  insetTop = globalInset,
  insetRight = globalInset,
  insetBottom = globalInset,
  insetLeft = globalInset
} = {}, dimensions) {
  if (projection3 == null)
    return;
  if (typeof projection3.stream === "function")
    return projection3;
  let options9;
  let domain;
  let clip = "frame";
  if (isObject(projection3)) {
    let inset;
    ({
      type: projection3,
      domain,
      inset,
      insetTop = inset !== undefined ? inset : insetTop,
      insetRight = inset !== undefined ? inset : insetRight,
      insetBottom = inset !== undefined ? inset : insetBottom,
      insetLeft = inset !== undefined ? inset : insetLeft,
      clip = clip,
      ...options9
    } = projection3);
    if (projection3 == null)
      return;
  }
  if (typeof projection3 !== "function")
    ({ type: projection3 } = namedProjection(projection3));
  const { width, height, marginLeft, marginRight, marginTop, marginBottom } = dimensions;
  const dx = width - marginLeft - marginRight - insetLeft - insetRight;
  const dy = height - marginTop - marginBottom - insetTop - insetBottom;
  projection3 = projection3?.({ width: dx, height: dy, clip, ...options9 });
  if (projection3 == null)
    return;
  clip = maybePostClip(clip, marginLeft, marginTop, width - marginRight, height - marginBottom);
  let tx = marginLeft + insetLeft;
  let ty = marginTop + insetTop;
  let transform5;
  if (domain != null) {
    const [[x05, y05], [x12, y12]] = path_default(projection3).bounds(domain);
    const k2 = Math.min(dx / (x12 - x05), dy / (y12 - y05));
    if (k2 > 0) {
      tx -= (k2 * (x05 + x12) - dx) / 2;
      ty -= (k2 * (y05 + y12) - dy) / 2;
      transform5 = transform_default({
        point(x2, y2) {
          this.stream.point(x2 * k2 + tx, y2 * k2 + ty);
        }
      });
    } else {
      warn(`Warning: the projection could not be fit to the specified domain; using the default scale.`);
    }
  }
  transform5 ??= tx === 0 && ty === 0 ? identity14() : transform_default({
    point(x2, y2) {
      this.stream.point(x2 + tx, y2 + ty);
    }
  });
  return { stream: (s2) => projection3.stream(transform5.stream(clip(s2))) };
}
var namedProjection = function(projection3) {
  switch (`${projection3}`.toLowerCase()) {
    case "albers-usa":
      return scaleProjection(albersUsa_default, 0.7463, 0.4673);
    case "albers":
      return conicProjection2(albers_default, 0.7463, 0.4673);
    case "azimuthal-equal-area":
      return scaleProjection(azimuthalEqualArea_default, 4, 4);
    case "azimuthal-equidistant":
      return scaleProjection(azimuthalEquidistant_default, tau4, tau4);
    case "conic-conformal":
      return conicProjection2(conicConformal_default, tau4, tau4);
    case "conic-equal-area":
      return conicProjection2(conicEqualArea_default, 6.1702, 2.9781);
    case "conic-equidistant":
      return conicProjection2(conicEquidistant_default, 7.312, 3.6282);
    case "equal-earth":
      return scaleProjection(equalEarth_default, 5.4133, 2.6347);
    case "equirectangular":
      return scaleProjection(equirectangular_default, tau4, pi4);
    case "gnomonic":
      return scaleProjection(gnomonic_default, 3.4641, 3.4641);
    case "identity":
      return { type: identity14 };
    case "reflect-y":
      return { type: reflectY };
    case "mercator":
      return scaleProjection(mercator_default, tau4, tau4);
    case "orthographic":
      return scaleProjection(orthographic_default, 2, 2);
    case "stereographic":
      return scaleProjection(stereographic_default, 2, 2);
    case "transverse-mercator":
      return scaleProjection(transverseMercator_default, tau4, tau4);
    default:
      throw new Error(`unknown projection type: ${projection3}`);
  }
};
var maybePostClip = function(clip, x12, y12, x2, y2) {
  if (clip === false || clip == null || typeof clip === "number")
    return (s2) => s2;
  if (clip === true)
    clip = "frame";
  switch (`${clip}`.toLowerCase()) {
    case "frame":
      return clipRectangle(x12, y12, x2, y2);
    default:
      throw new Error(`unknown projection clip type: ${clip}`);
  }
};
var scaleProjection = function(createProjection2, kx2, ky2) {
  return {
    type: ({ width, height, rotate, precision = 0.15, clip }) => {
      const projection3 = createProjection2();
      if (precision != null)
        projection3.precision?.(precision);
      if (rotate != null)
        projection3.rotate?.(rotate);
      if (typeof clip === "number")
        projection3.clipAngle?.(clip);
      projection3.scale(Math.min(width / kx2, height / ky2));
      projection3.translate([width / 2, height / 2]);
      return projection3;
    },
    aspectRatio: ky2 / kx2
  };
};
var conicProjection2 = function(createProjection2, kx2, ky2) {
  const { type: type6, aspectRatio } = scaleProjection(createProjection2, kx2, ky2);
  return {
    type: (options9) => {
      const { parallels, domain, width, height } = options9;
      const projection3 = type6(options9);
      if (parallels != null) {
        projection3.parallels(parallels);
        if (domain === undefined) {
          projection3.fitSize([width, height], { type: "Sphere" });
        }
      }
      return projection3;
    },
    aspectRatio
  };
};
function project(cx, cy, values4, projection3) {
  const x2 = values4[cx];
  const y2 = values4[cy];
  const n = x2.length;
  const X3 = values4[cx] = new Float64Array(n).fill(NaN);
  const Y3 = values4[cy] = new Float64Array(n).fill(NaN);
  let i;
  const stream3 = projection3.stream({
    point(x3, y3) {
      X3[i] = x3;
      Y3[i] = y3;
    }
  });
  for (i = 0;i < n; ++i) {
    stream3.point(x2[i], y2[i]);
  }
}
function hasProjection({ projection: projection3 } = {}) {
  if (projection3 == null)
    return false;
  if (typeof projection3.stream === "function")
    return true;
  if (isObject(projection3))
    projection3 = projection3.type;
  return projection3 != null;
}
function projectionAspectRatio(projection3) {
  if (typeof projection3?.stream === "function")
    return defaultAspectRatio;
  if (isObject(projection3))
    projection3 = projection3.type;
  if (projection3 == null)
    return;
  if (typeof projection3 !== "function") {
    const { aspectRatio } = namedProjection(projection3);
    if (aspectRatio)
      return aspectRatio;
  }
  return defaultAspectRatio;
}
function getGeometryChannels(channel) {
  const X3 = [];
  const Y3 = [];
  const x2 = { scale: "x", value: X3 };
  const y2 = { scale: "y", value: Y3 };
  const sink = {
    point(x3, y3) {
      X3.push(x3);
      Y3.push(y3);
    },
    lineStart() {
    },
    lineEnd() {
    },
    polygonStart() {
    },
    polygonEnd() {
    },
    sphere() {
    }
  };
  for (const object2 of channel.value)
    stream_default(object2, sink);
  return [x2, y2];
}
var pi4 = Math.PI;
var tau4 = 2 * pi4;
var defaultAspectRatio = 0.618;
var identity14 = constant8({ stream: (stream3) => stream3 });
var reflectY = constant8(transform_default({
  point(x2, y2) {
    this.stream.point(x2, -y2);
  }
}));

// node_modules/@observablehq/plot/src/scales/schemes.js
function isCategoricalScheme(scheme28) {
  return scheme28 != null && categoricalSchemes.has(`${scheme28}`.toLowerCase());
}
var scheme92 = function(scheme28, interpolate3) {
  return ({ length: n }) => {
    if (n === 1)
      return [scheme28[3][1]];
    if (n === 2)
      return [scheme28[3][1], scheme28[3][2]];
    n = Math.max(3, Math.floor(n));
    return n > 9 ? quantize_default(interpolate3, n) : scheme28[n];
  };
};
var scheme112 = function(scheme28, interpolate3) {
  return ({ length: n }) => {
    if (n === 2)
      return [scheme28[3][0], scheme28[3][2]];
    n = Math.max(3, Math.floor(n));
    return n > 11 ? quantize_default(interpolate3, n) : scheme28[n];
  };
};
var scheme11r = function(scheme28, interpolate3) {
  return ({ length: n }) => {
    if (n === 2)
      return [scheme28[3][2], scheme28[3][0]];
    n = Math.max(3, Math.floor(n));
    return n > 11 ? quantize_default((t) => interpolate3(1 - t), n) : scheme28[n].slice().reverse();
  };
};
var schemei = function(interpolate3) {
  return ({ length: n }) => quantize_default(interpolate3, Math.max(2, Math.floor(n)));
};
var schemeicyclical = function(interpolate3) {
  return ({ length: n }) => quantize_default(interpolate3, Math.floor(n) + 1).slice(0, -1);
};
function ordinalScheme(scheme28) {
  const s2 = `${scheme28}`.toLowerCase();
  if (!ordinalSchemes.has(s2))
    throw new Error(`unknown ordinal scheme: ${s2}`);
  return ordinalSchemes.get(s2);
}
function ordinalRange(scheme28, length3) {
  const s2 = ordinalScheme(scheme28);
  const r = typeof s2 === "function" ? s2({ length: length3 }) : s2;
  return r.length !== length3 ? r.slice(0, length3) : r;
}
function maybeBooleanRange(domain, scheme28 = "greys") {
  const range5 = new Set;
  const [f, t] = ordinalRange(scheme28, 2);
  for (const value5 of domain) {
    if (value5 == null)
      continue;
    if (value5 === true)
      range5.add(t);
    else if (value5 === false)
      range5.add(f);
    else
      return;
  }
  return [...range5];
}
function quantitativeScheme(scheme28) {
  const s2 = `${scheme28}`.toLowerCase();
  if (!quantitativeSchemes.has(s2))
    throw new Error(`unknown quantitative scheme: ${s2}`);
  return quantitativeSchemes.get(s2);
}
function isDivergingScheme(scheme28) {
  return scheme28 != null && divergingSchemes.has(`${scheme28}`.toLowerCase());
}
var categoricalSchemes = new Map([
  ["accent", Accent_default],
  ["category10", category10_default],
  ["dark2", Dark2_default],
  ["paired", Paired_default],
  ["pastel1", Pastel1_default],
  ["pastel2", Pastel2_default],
  ["set1", Set1_default],
  ["set2", Set2_default],
  ["set3", Set3_default],
  ["tableau10", Tableau10_default]
]);
var ordinalSchemes = new Map([
  ...categoricalSchemes,
  ["brbg", scheme112(scheme, BrBG_default)],
  ["prgn", scheme112(scheme2, PRGn_default)],
  ["piyg", scheme112(scheme3, PiYG_default)],
  ["puor", scheme112(scheme4, PuOr_default)],
  ["rdbu", scheme112(scheme5, RdBu_default)],
  ["rdgy", scheme112(scheme6, RdGy_default)],
  ["rdylbu", scheme112(scheme7, RdYlBu_default)],
  ["rdylgn", scheme112(scheme8, RdYlGn_default)],
  ["spectral", scheme112(scheme9, Spectral_default)],
  ["burd", scheme11r(scheme5, RdBu_default)],
  ["buylrd", scheme11r(scheme7, RdYlBu_default)],
  ["blues", scheme92(scheme22, Blues_default)],
  ["greens", scheme92(scheme23, Greens_default)],
  ["greys", scheme92(scheme24, Greys_default)],
  ["oranges", scheme92(scheme27, Oranges_default)],
  ["purples", scheme92(scheme25, Purples_default)],
  ["reds", scheme92(scheme26, Reds_default)],
  ["turbo", schemei(turbo_default)],
  ["viridis", schemei(viridis_default)],
  ["magma", schemei(magma)],
  ["inferno", schemei(inferno)],
  ["plasma", schemei(plasma)],
  ["cividis", schemei(cividis_default)],
  ["cubehelix", schemei(cubehelix_default2)],
  ["warm", schemei(warm)],
  ["cool", schemei(cool)],
  ["bugn", scheme92(scheme10, BuGn_default)],
  ["bupu", scheme92(scheme11, BuPu_default)],
  ["gnbu", scheme92(scheme12, GnBu_default)],
  ["orrd", scheme92(scheme13, OrRd_default)],
  ["pubu", scheme92(scheme15, PuBu_default)],
  ["pubugn", scheme92(scheme14, PuBuGn_default)],
  ["purd", scheme92(scheme16, PuRd_default)],
  ["rdpu", scheme92(scheme17, RdPu_default)],
  ["ylgn", scheme92(scheme19, YlGn_default)],
  ["ylgnbu", scheme92(scheme18, YlGnBu_default)],
  ["ylorbr", scheme92(scheme20, YlOrBr_default)],
  ["ylorrd", scheme92(scheme21, YlOrRd_default)],
  ["rainbow", schemeicyclical(rainbow_default)],
  ["sinebow", schemeicyclical(sinebow_default)]
]);
var quantitativeSchemes = new Map([
  ["brbg", BrBG_default],
  ["prgn", PRGn_default],
  ["piyg", PiYG_default],
  ["puor", PuOr_default],
  ["rdbu", RdBu_default],
  ["rdgy", RdGy_default],
  ["rdylbu", RdYlBu_default],
  ["rdylgn", RdYlGn_default],
  ["spectral", Spectral_default],
  ["burd", (t) => RdBu_default(1 - t)],
  ["buylrd", (t) => RdYlBu_default(1 - t)],
  ["blues", Blues_default],
  ["greens", Greens_default],
  ["greys", Greys_default],
  ["purples", Purples_default],
  ["reds", Reds_default],
  ["oranges", Oranges_default],
  ["turbo", turbo_default],
  ["viridis", viridis_default],
  ["magma", magma],
  ["inferno", inferno],
  ["plasma", plasma],
  ["cividis", cividis_default],
  ["cubehelix", cubehelix_default2],
  ["warm", warm],
  ["cool", cool],
  ["bugn", BuGn_default],
  ["bupu", BuPu_default],
  ["gnbu", GnBu_default],
  ["orrd", OrRd_default],
  ["pubugn", PuBuGn_default],
  ["pubu", PuBu_default],
  ["purd", PuRd_default],
  ["rdpu", RdPu_default],
  ["ylgnbu", YlGnBu_default],
  ["ylgn", YlGn_default],
  ["ylorbr", YlOrBr_default],
  ["ylorrd", YlOrRd_default],
  ["rainbow", rainbow_default],
  ["sinebow", sinebow_default]
]);
var divergingSchemes = new Set([
  "brbg",
  "prgn",
  "piyg",
  "puor",
  "rdbu",
  "rdgy",
  "rdylbu",
  "rdylgn",
  "spectral",
  "burd",
  "buylrd"
]);

// node_modules/@observablehq/plot/src/scales/quantitative.js
function maybeInterpolator(interpolate3) {
  const i = `${interpolate3}`.toLowerCase();
  if (!interpolators.has(i))
    throw new Error(`unknown interpolator: ${i}`);
  return interpolators.get(i);
}
function createScaleQ(key, scale, channels, {
  type: type6,
  nice: nice4,
  clamp,
  zero: zero3,
  domain = inferAutoDomain(key, channels),
  unknown,
  round,
  scheme: scheme28,
  interval: interval10,
  range: range5 = registry.get(key) === radius ? inferRadialRange(channels, domain) : registry.get(key) === length2 ? inferLengthRange(channels, domain) : registry.get(key) === opacity ? unit2 : undefined,
  interpolate: interpolate3 = registry.get(key) === color9 ? scheme28 == null && range5 !== undefined ? rgb_default : quantitativeScheme(scheme28 !== undefined ? scheme28 : type6 === "cyclical" ? "rainbow" : "turbo") : round ? round_default : number_default,
  reverse: reverse2
}) {
  interval10 = maybeRangeInterval(interval10, type6);
  if (type6 === "cyclical" || type6 === "sequential")
    type6 = "linear";
  if (typeof interpolate3 !== "function")
    interpolate3 = maybeInterpolator(interpolate3);
  reverse2 = !!reverse2;
  if (range5 !== undefined) {
    const n = (domain = arrayify2(domain)).length;
    const m = (range5 = arrayify2(range5)).length;
    if (n !== m) {
      if (interpolate3.length === 1)
        throw new Error("invalid piecewise interpolator");
      interpolate3 = piecewise(interpolate3, range5);
      range5 = undefined;
    }
  }
  if (interpolate3.length === 1) {
    if (reverse2) {
      interpolate3 = flip(interpolate3);
      reverse2 = false;
    }
    if (range5 === undefined) {
      range5 = Float64Array.from(domain, (_, i) => i / (domain.length - 1));
      if (range5.length === 2)
        range5 = unit2;
    }
    scale.interpolate((range5 === unit2 ? constant8 : interpolatePiecewise)(interpolate3));
  } else {
    scale.interpolate(interpolate3);
  }
  if (zero3) {
    const [min4, max5] = extent(domain);
    if (min4 > 0 || max5 < 0) {
      domain = slice2(domain);
      if (orderof(domain) !== Math.sign(min4))
        domain[domain.length - 1] = 0;
      else
        domain[0] = 0;
    }
  }
  if (reverse2)
    domain = reverse(domain);
  scale.domain(domain).unknown(unknown);
  if (nice4)
    scale.nice(maybeNice(nice4, type6)), domain = scale.domain();
  if (range5 !== undefined)
    scale.range(range5);
  if (clamp)
    scale.clamp(clamp);
  return { type: type6, domain, range: range5, scale, interpolate: interpolate3, interval: interval10 };
}
var maybeNice = function(nice4, type6) {
  return nice4 === true ? undefined : typeof nice4 === "number" ? nice4 : maybeNiceInterval(nice4, type6);
};
function createScaleLinear(key, channels, options10) {
  return createScaleQ(key, linear2(), channels, options10);
}
function createScaleSqrt(key, channels, options10) {
  return createScalePow(key, channels, { ...options10, exponent: 0.5 });
}
function createScalePow(key, channels, { exponent: exponent5 = 1, ...options10 }) {
  return createScaleQ(key, pow2().exponent(exponent5), channels, { ...options10, type: "pow" });
}
function createScaleLog(key, channels, { base = 10, domain = inferLogDomain(channels), ...options10 }) {
  return createScaleQ(key, log3().base(base), channels, { ...options10, domain });
}
function createScaleSymlog(key, channels, { constant: constant9 = 1, ...options10 }) {
  return createScaleQ(key, symlog().constant(constant9), channels, options10);
}
function createScaleQuantile(key, channels, {
  range: range5,
  quantiles = range5 === undefined ? 5 : (range5 = [...range5]).length,
  n = quantiles,
  scheme: scheme28 = "rdylbu",
  domain = inferQuantileDomain(channels),
  unknown,
  interpolate: interpolate3,
  reverse: reverse2
}) {
  if (range5 === undefined) {
    range5 = interpolate3 !== undefined ? quantize_default(interpolate3, n) : registry.get(key) === color9 ? ordinalRange(scheme28, n) : undefined;
  }
  if (domain.length > 0) {
    domain = quantile4(domain, range5 === undefined ? { length: n } : range5).quantiles();
  }
  return createScaleThreshold(key, channels, { domain, range: range5, reverse: reverse2, unknown });
}
function createScaleQuantize(key, channels, {
  range: range5,
  n = range5 === undefined ? 5 : (range5 = [...range5]).length,
  scheme: scheme28 = "rdylbu",
  domain = inferAutoDomain(key, channels),
  unknown,
  interpolate: interpolate3,
  reverse: reverse2
}) {
  const [min4, max5] = extent(domain);
  let thresholds;
  if (range5 === undefined) {
    thresholds = ticks(min4, max5, n);
    if (thresholds[0] <= min4)
      thresholds.splice(0, 1);
    if (thresholds[thresholds.length - 1] >= max5)
      thresholds.pop();
    n = thresholds.length + 1;
    range5 = interpolate3 !== undefined ? quantize_default(interpolate3, n) : registry.get(key) === color9 ? ordinalRange(scheme28, n) : undefined;
  } else {
    thresholds = quantize_default(number_default(min4, max5), n + 1).slice(1, -1);
    if (min4 instanceof Date)
      thresholds = thresholds.map((x2) => new Date(x2));
  }
  if (orderof(arrayify2(domain)) < 0)
    thresholds.reverse();
  return createScaleThreshold(key, channels, { domain: thresholds, range: range5, reverse: reverse2, unknown });
}
function createScaleThreshold(key, channels, {
  domain = [0],
  unknown,
  scheme: scheme28 = "rdylbu",
  interpolate: interpolate3,
  range: range5 = interpolate3 !== undefined ? quantize_default(interpolate3, domain.length + 1) : registry.get(key) === color9 ? ordinalRange(scheme28, domain.length + 1) : undefined,
  reverse: reverse2
}) {
  domain = arrayify2(domain);
  const sign3 = orderof(domain);
  if (!isNaN(sign3) && !isOrdered(domain, sign3))
    throw new Error(`the ${key} scale has a non-monotonic domain`);
  if (reverse2)
    range5 = reverse(range5);
  return {
    type: "threshold",
    scale: threshold(sign3 < 0 ? reverse(domain) : domain, range5 === undefined ? [] : range5).unknown(unknown),
    domain,
    range: range5
  };
}
var isOrdered = function(domain, sign3) {
  for (let i = 1, n = domain.length, d = domain[0];i < n; ++i) {
    const s2 = descending(d, d = domain[i]);
    if (s2 !== 0 && s2 !== sign3)
      return false;
  }
  return true;
};
function createScaleIdentity() {
  return { type: "identity", scale: identity11() };
}
function inferDomain(channels, f = finite) {
  return channels.length ? [
    min(channels, ({ value: value5 }) => value5 === undefined ? value5 : min(value5, f)),
    max3(channels, ({ value: value5 }) => value5 === undefined ? value5 : max3(value5, f))
  ] : [0, 1];
}
var inferAutoDomain = function(key, channels) {
  const type6 = registry.get(key);
  return (type6 === radius || type6 === opacity || type6 === length2 ? inferZeroDomain : inferDomain)(channels);
};
var inferZeroDomain = function(channels) {
  return [0, channels.length ? max3(channels, ({ value: value5 }) => value5 === undefined ? value5 : max3(value5, finite)) : 1];
};
var inferRadialRange = function(channels, domain) {
  const hint = channels.find(({ radius: radius2 }) => radius2 !== undefined);
  if (hint !== undefined)
    return [0, hint.radius];
  const h25 = quantile(channels, 0.5, ({ value: value5 }) => value5 === undefined ? NaN : quantile(value5, 0.25, positive));
  const range5 = domain.map((d) => 3 * Math.sqrt(d / h25));
  const k2 = 30 / max3(range5);
  return k2 < 1 ? range5.map((r) => r * k2) : range5;
};
var inferLengthRange = function(channels, domain) {
  const h50 = median3(channels, ({ value: value5 }) => value5 === undefined ? NaN : median3(value5, Math.abs));
  const range5 = domain.map((d) => 12 * d / h50);
  const k2 = 60 / max3(range5);
  return k2 < 1 ? range5.map((r) => r * k2) : range5;
};
var inferLogDomain = function(channels) {
  for (const { value: value5 } of channels) {
    if (value5 !== undefined) {
      for (let v of value5) {
        if (v > 0)
          return inferDomain(channels, positive);
        if (v < 0)
          return inferDomain(channels, negative);
      }
    }
  }
  return [1, 10];
};
var inferQuantileDomain = function(channels) {
  const domain = [];
  for (const { value: value5 } of channels) {
    if (value5 === undefined)
      continue;
    for (const v of value5)
      domain.push(v);
  }
  return domain;
};
function interpolatePiecewise(interpolate3) {
  return (i, j) => (t) => interpolate3(i + t * (j - i));
}
var flip = (i) => (t) => i(1 - t);
var unit2 = [0, 1];
var interpolators = new Map([
  ["number", number_default],
  ["rgb", rgb_default],
  ["hsl", hsl_default],
  ["hcl", hcl_default],
  ["lab", lab2]
]);

// node_modules/@observablehq/plot/src/scales/diverging.js
var createScaleD = function(key, scale, transform5, channels, {
  type: type6,
  nice: nice4,
  clamp,
  domain = inferDomain(channels),
  unknown,
  pivot = 0,
  scheme: scheme28,
  range: range5,
  symmetric = true,
  interpolate: interpolate3 = registry.get(key) === color9 ? scheme28 == null && range5 !== undefined ? rgb_default : quantitativeScheme(scheme28 !== undefined ? scheme28 : "rdbu") : number_default,
  reverse: reverse2
}) {
  pivot = +pivot;
  domain = arrayify2(domain);
  let [min4, max5] = domain;
  if (domain.length > 2)
    warn(`Warning: the diverging ${key} scale domain contains extra elements.`);
  if (descending(min4, max5) < 0)
    [min4, max5] = [max5, min4], reverse2 = !reverse2;
  min4 = Math.min(min4, pivot);
  max5 = Math.max(max5, pivot);
  if (typeof interpolate3 !== "function") {
    interpolate3 = maybeInterpolator(interpolate3);
  }
  if (range5 !== undefined) {
    interpolate3 = interpolate3.length === 1 ? interpolatePiecewise(interpolate3)(...range5) : piecewise(interpolate3, range5);
  }
  if (reverse2)
    interpolate3 = flip(interpolate3);
  if (symmetric) {
    const mid2 = transform5.apply(pivot);
    const mindelta = mid2 - transform5.apply(min4);
    const maxdelta = transform5.apply(max5) - mid2;
    if (mindelta < maxdelta)
      min4 = transform5.invert(mid2 - maxdelta);
    else if (mindelta > maxdelta)
      max5 = transform5.invert(mid2 + mindelta);
  }
  scale.domain([min4, pivot, max5]).unknown(unknown).interpolator(interpolate3);
  if (clamp)
    scale.clamp(clamp);
  if (nice4)
    scale.nice(nice4);
  return { type: type6, domain: [min4, max5], pivot, interpolate: interpolate3, scale };
};
function createScaleDiverging(key, channels, options11) {
  return createScaleD(key, diverging(), transformIdentity, channels, options11);
}
function createScaleDivergingSqrt(key, channels, options11) {
  return createScaleDivergingPow(key, channels, { ...options11, exponent: 0.5 });
}
function createScaleDivergingPow(key, channels, { exponent: exponent5 = 1, ...options11 }) {
  return createScaleD(key, divergingPow().exponent(exponent5 = +exponent5), transformPow2(exponent5), channels, {
    ...options11,
    type: "diverging-pow"
  });
}
function createScaleDivergingLog(key, channels, { base = 10, pivot = 1, domain = inferDomain(channels, pivot < 0 ? negative : positive), ...options11 }) {
  return createScaleD(key, divergingLog().base(base = +base), transformLog2, channels, {
    domain,
    pivot,
    ...options11
  });
}
function createScaleDivergingSymlog(key, channels, { constant: constant9 = 1, ...options11 }) {
  return createScaleD(key, divergingSymlog().constant(constant9 = +constant9), transformSymlog2(constant9), channels, options11);
}
var transformPow2 = function(exponent5) {
  return exponent5 === 0.5 ? transformSqrt2 : {
    apply(x2) {
      return Math.sign(x2) * Math.pow(Math.abs(x2), exponent5);
    },
    invert(x2) {
      return Math.sign(x2) * Math.pow(Math.abs(x2), 1 / exponent5);
    }
  };
};
var transformSymlog2 = function(constant9) {
  return {
    apply(x2) {
      return Math.sign(x2) * Math.log1p(Math.abs(x2 / constant9));
    },
    invert(x2) {
      return Math.sign(x2) * Math.expm1(Math.abs(x2)) * constant9;
    }
  };
};
var transformIdentity = {
  apply(x2) {
    return x2;
  },
  invert(x2) {
    return x2;
  }
};
var transformLog2 = {
  apply: Math.log,
  invert: Math.exp
};
var transformSqrt2 = {
  apply(x2) {
    return Math.sign(x2) * Math.sqrt(Math.abs(x2));
  },
  invert(x2) {
    return Math.sign(x2) * (x2 * x2);
  }
};

// node_modules/@observablehq/plot/src/scales/temporal.js
var createScaleT = function(key, scale, channels, options11) {
  return createScaleQ(key, scale, channels, options11);
};
function createScaleTime(key, channels, options11) {
  return createScaleT(key, time(), channels, options11);
}
function createScaleUtc(key, channels, options11) {
  return createScaleT(key, utcTime(), channels, options11);
}

// node_modules/@observablehq/plot/src/scales/ordinal.js
var createScaleO = function(key, scale, channels, { type: type6, interval: interval10, domain, range: range5, reverse: reverse2, hint }) {
  interval10 = maybeRangeInterval(interval10, type6);
  if (domain === undefined)
    domain = inferDomain2(channels, interval10, key);
  if (type6 === "categorical" || type6 === ordinalImplicit)
    type6 = "ordinal";
  if (reverse2)
    domain = reverse(domain);
  scale.domain(domain);
  if (range5 !== undefined) {
    if (typeof range5 === "function")
      range5 = range5(domain);
    scale.range(range5);
  }
  return { type: type6, domain, range: range5, scale, hint, interval: interval10 };
};
function createScaleOrdinal(key, channels, { type: type6, interval: interval10, domain, range: range5, scheme: scheme28, unknown, ...options12 }) {
  interval10 = maybeRangeInterval(interval10, type6);
  if (domain === undefined)
    domain = inferDomain2(channels, interval10, key);
  let hint;
  if (registry.get(key) === symbol) {
    hint = inferSymbolHint(channels);
    range5 = range5 === undefined ? inferSymbolRange(hint) : map7(range5, maybeSymbol);
  } else if (registry.get(key) === color9) {
    if (range5 === undefined && (type6 === "ordinal" || type6 === ordinalImplicit)) {
      range5 = maybeBooleanRange(domain, scheme28);
      if (range5 !== undefined)
        scheme28 = undefined;
    }
    if (scheme28 === undefined && range5 === undefined) {
      scheme28 = type6 === "ordinal" ? "turbo" : "tableau10";
    }
    if (scheme28 !== undefined) {
      if (range5 !== undefined) {
        const interpolate3 = quantitativeScheme(scheme28);
        const t03 = range5[0], d = range5[1] - range5[0];
        range5 = ({ length: n }) => quantize_default((t) => interpolate3(t03 + d * t), n);
      } else {
        range5 = ordinalScheme(scheme28);
      }
    }
  }
  if (unknown === implicit) {
    throw new Error(`implicit unknown on ${key} scale is not supported`);
  }
  return createScaleO(key, ordinal().unknown(unknown), channels, { ...options12, type: type6, domain, range: range5, hint });
}
function createScalePoint(key, channels, { align = 0.5, padding = 0.5, ...options12 }) {
  return maybeRound(point().align(align).padding(padding), channels, options12, key);
}
function createScaleBand(key, channels, {
  align = 0.5,
  padding = 0.1,
  paddingInner = padding,
  paddingOuter = key === "fx" || key === "fy" ? 0 : padding,
  ...options12
}) {
  return maybeRound(band().align(align).paddingInner(paddingInner).paddingOuter(paddingOuter), channels, options12, key);
}
var maybeRound = function(scale, channels, options12, key) {
  let { round } = options12;
  if (round !== undefined)
    scale.round(round = !!round);
  scale = createScaleO(key, scale, channels, options12);
  scale.round = round;
  return scale;
};
var inferDomain2 = function(channels, interval10, key) {
  const values4 = new InternSet;
  for (const { value: value5, domain } of channels) {
    if (domain !== undefined)
      return domain();
    if (value5 === undefined)
      continue;
    for (const v of value5)
      values4.add(v);
  }
  if (interval10 !== undefined) {
    const [min4, max5] = extent(values4).map(interval10.floor, interval10);
    return interval10.range(min4, interval10.offset(max5));
  }
  if (values4.size > 1e4 && registry.get(key) === position) {
    throw new Error(`implicit ordinal domain of ${key} scale has more than 10,000 values`);
  }
  return sort(values4, ascendingDefined2);
};
var inferHint = function(channels, key) {
  let value5;
  for (const { hint } of channels) {
    const candidate = hint?.[key];
    if (candidate === undefined)
      continue;
    if (value5 === undefined)
      value5 = candidate;
    else if (value5 !== candidate)
      return;
  }
  return value5;
};
var inferSymbolHint = function(channels) {
  return {
    fill: inferHint(channels, "fill"),
    stroke: inferHint(channels, "stroke")
  };
};
var inferSymbolRange = function(hint) {
  return isNoneish(hint.fill) ? symbolsStroke : symbolsFill;
};
var ordinalImplicit = Symbol("ordinal");

// node_modules/@observablehq/plot/src/scales.js
function createScales(channelsByScale, {
  label: globalLabel,
  inset: globalInset = 0,
  insetTop: globalInsetTop = globalInset,
  insetRight: globalInsetRight = globalInset,
  insetBottom: globalInsetBottom = globalInset,
  insetLeft: globalInsetLeft = globalInset,
  round,
  nice: nice4,
  clamp,
  zero: zero3,
  align,
  padding,
  projection: projection3,
  facet: { label: facetLabel = globalLabel } = {},
  ...options13
} = {}) {
  const scales3 = {};
  for (const [key, channels] of channelsByScale) {
    const scaleOptions = options13[key];
    const scale = createScale(key, channels, {
      round: registry.get(key) === position ? round : undefined,
      nice: nice4,
      clamp,
      zero: zero3,
      align,
      padding,
      projection: projection3,
      ...scaleOptions
    });
    if (scale) {
      let {
        label = key === "fx" || key === "fy" ? facetLabel : globalLabel,
        percent,
        transform: transform5,
        inset,
        insetTop = inset !== undefined ? inset : key === "y" ? globalInsetTop : 0,
        insetRight = inset !== undefined ? inset : key === "x" ? globalInsetRight : 0,
        insetBottom = inset !== undefined ? inset : key === "y" ? globalInsetBottom : 0,
        insetLeft = inset !== undefined ? inset : key === "x" ? globalInsetLeft : 0
      } = scaleOptions || {};
      if (transform5 == null)
        transform5 = undefined;
      else if (typeof transform5 !== "function")
        throw new Error("invalid scale transform; not a function");
      scale.percent = !!percent;
      scale.label = label === undefined ? inferScaleLabel(channels, scale) : label;
      scale.transform = transform5;
      if (key === "x" || key === "fx") {
        scale.insetLeft = +insetLeft;
        scale.insetRight = +insetRight;
      } else if (key === "y" || key === "fy") {
        scale.insetTop = +insetTop;
        scale.insetBottom = +insetBottom;
      }
      scales3[key] = scale;
    }
  }
  return scales3;
}
function createScaleFunctions(scales3) {
  return Object.fromEntries(Object.entries(scales3).filter(([, { scale }]) => scale).map(([name, { scale, type: type6, interval: interval10, label }]) => {
    scale.type = type6;
    if (interval10 != null)
      scale.interval = interval10;
    if (label != null)
      scale.label = label;
    return [name, scale];
  }));
}
function autoScaleRange(scales3, dimensions) {
  const { x: x2, y: y2, fx, fy } = scales3;
  const superdimensions = fx || fy ? outerDimensions(dimensions) : dimensions;
  if (fx)
    autoScaleRangeX(fx, superdimensions);
  if (fy)
    autoScaleRangeY(fy, superdimensions);
  const subdimensions = fx || fy ? innerDimensions(scales3, dimensions) : dimensions;
  if (x2)
    autoScaleRangeX(x2, subdimensions);
  if (y2)
    autoScaleRangeY(y2, subdimensions);
}
var inferScaleLabel = function(channels = [], scale) {
  let label;
  for (const { label: l } of channels) {
    if (l === undefined)
      continue;
    if (label === undefined)
      label = l;
    else if (label !== l)
      return;
  }
  if (label === undefined)
    return;
  if (!isOrdinalScale(scale) && scale.percent)
    label = `${label} (%)`;
  return { inferred: true, toString: () => label };
};
function outerDimensions(dimensions) {
  const {
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    width,
    height,
    facet: {
      marginTop: facetMarginTop,
      marginRight: facetMarginRight,
      marginBottom: facetMarginBottom,
      marginLeft: facetMarginLeft
    }
  } = dimensions;
  return {
    marginTop: Math.max(marginTop, facetMarginTop),
    marginRight: Math.max(marginRight, facetMarginRight),
    marginBottom: Math.max(marginBottom, facetMarginBottom),
    marginLeft: Math.max(marginLeft, facetMarginLeft),
    width,
    height
  };
}
function innerDimensions({ fx, fy }, dimensions) {
  const { marginTop, marginRight, marginBottom, marginLeft, width, height } = outerDimensions(dimensions);
  return {
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    width: fx ? fx.scale.bandwidth() + marginLeft + marginRight : width,
    height: fy ? fy.scale.bandwidth() + marginTop + marginBottom : height,
    facet: { width, height }
  };
}
var autoScaleRangeX = function(scale, dimensions) {
  if (scale.range === undefined) {
    const { insetLeft, insetRight } = scale;
    const { width, marginLeft = 0, marginRight = 0 } = dimensions;
    const left2 = marginLeft + insetLeft;
    const right2 = width - marginRight - insetRight;
    scale.range = [left2, Math.max(left2, right2)];
    if (!isOrdinalScale(scale))
      scale.range = piecewiseRange(scale);
    scale.scale.range(scale.range);
  }
  autoScaleRound(scale);
};
var autoScaleRangeY = function(scale, dimensions) {
  if (scale.range === undefined) {
    const { insetTop, insetBottom } = scale;
    const { height, marginTop = 0, marginBottom = 0 } = dimensions;
    const top2 = marginTop + insetTop;
    const bottom2 = height - marginBottom - insetBottom;
    scale.range = [Math.max(top2, bottom2), top2];
    if (!isOrdinalScale(scale))
      scale.range = piecewiseRange(scale);
    else
      scale.range.reverse();
    scale.scale.range(scale.range);
  }
  autoScaleRound(scale);
};
var autoScaleRound = function(scale) {
  if (scale.round === undefined && isBandScale(scale) && roundError(scale) <= 30) {
    scale.scale.round(true);
  }
};
var roundError = function({ scale }) {
  const n = scale.domain().length;
  const [start2, stop] = scale.range();
  const paddingInner = scale.paddingInner ? scale.paddingInner() : 1;
  const paddingOuter = scale.paddingOuter ? scale.paddingOuter() : scale.padding();
  const m = n - paddingInner;
  const step = Math.abs(stop - start2) / Math.max(1, m + paddingOuter * 2);
  return (step - Math.floor(step)) * m;
};
var piecewiseRange = function(scale) {
  const length3 = scale.scale.domain().length + isThresholdScale(scale);
  if (!(length3 > 2))
    return scale.range;
  const [start2, end2] = scale.range;
  return Array.from({ length: length3 }, (_, i) => start2 + i / (length3 - 1) * (end2 - start2));
};
var createScale = function(key, channels = [], options13 = {}) {
  const type6 = inferScaleType(key, channels, options13);
  if (options13.type === undefined && options13.domain === undefined && options13.range === undefined && options13.interval == null && key !== "fx" && key !== "fy" && isOrdinalScale({ type: type6 })) {
    const values4 = channels.map(({ value: value5 }) => value5).filter((value5) => value5 !== undefined);
    if (values4.some(isTemporal))
      warn(`Warning: some data associated with the ${key} scale are dates. Dates are typically associated with a "utc" or "time" scale rather than a "${formatScaleType(type6)}" scale. If you are using a bar mark, you probably want a rect mark with the interval option instead; if you are using a group transform, you probably want a bin transform instead. If you want to treat this data as ordinal, you can specify the interval of the ${key} scale (e.g., d3.utcDay), or you can suppress this warning by setting the type of the ${key} scale to "${formatScaleType(type6)}".`);
    else if (values4.some(isTemporalString))
      warn(`Warning: some data associated with the ${key} scale are strings that appear to be dates (e.g., YYYY-MM-DD). If these strings represent dates, you should parse them to Date objects. Dates are typically associated with a "utc" or "time" scale rather than a "${formatScaleType(type6)}" scale. If you are using a bar mark, you probably want a rect mark with the interval option instead; if you are using a group transform, you probably want a bin transform instead. If you want to treat this data as ordinal, you can suppress this warning by setting the type of the ${key} scale to "${formatScaleType(type6)}".`);
    else if (values4.some(isNumericString))
      warn(`Warning: some data associated with the ${key} scale are strings that appear to be numbers. If these strings represent numbers, you should parse or coerce them to numbers. Numbers are typically associated with a "linear" scale rather than a "${formatScaleType(type6)}" scale. If you want to treat this data as ordinal, you can specify the interval of the ${key} scale (e.g., 1 for integers), or you can suppress this warning by setting the type of the ${key} scale to "${formatScaleType(type6)}".`);
  }
  options13.type = type6;
  switch (type6) {
    case "diverging":
    case "diverging-sqrt":
    case "diverging-pow":
    case "diverging-log":
    case "diverging-symlog":
    case "cyclical":
    case "sequential":
    case "linear":
    case "sqrt":
    case "threshold":
    case "quantile":
    case "pow":
    case "log":
    case "symlog":
      options13 = coerceType(channels, options13, coerceNumbers);
      break;
    case "identity":
      switch (registry.get(key)) {
        case position:
          options13 = coerceType(channels, options13, coerceNumbers);
          break;
        case symbol:
          options13 = coerceType(channels, options13, coerceSymbols);
          break;
      }
      break;
    case "utc":
    case "time":
      options13 = coerceType(channels, options13, coerceDates);
      break;
  }
  switch (type6) {
    case "diverging":
      return createScaleDiverging(key, channels, options13);
    case "diverging-sqrt":
      return createScaleDivergingSqrt(key, channels, options13);
    case "diverging-pow":
      return createScaleDivergingPow(key, channels, options13);
    case "diverging-log":
      return createScaleDivergingLog(key, channels, options13);
    case "diverging-symlog":
      return createScaleDivergingSymlog(key, channels, options13);
    case "categorical":
    case "ordinal":
    case ordinalImplicit:
      return createScaleOrdinal(key, channels, options13);
    case "cyclical":
    case "sequential":
    case "linear":
      return createScaleLinear(key, channels, options13);
    case "sqrt":
      return createScaleSqrt(key, channels, options13);
    case "threshold":
      return createScaleThreshold(key, channels, options13);
    case "quantile":
      return createScaleQuantile(key, channels, options13);
    case "quantize":
      return createScaleQuantize(key, channels, options13);
    case "pow":
      return createScalePow(key, channels, options13);
    case "log":
      return createScaleLog(key, channels, options13);
    case "symlog":
      return createScaleSymlog(key, channels, options13);
    case "utc":
      return createScaleUtc(key, channels, options13);
    case "time":
      return createScaleTime(key, channels, options13);
    case "point":
      return createScalePoint(key, channels, options13);
    case "band":
      return createScaleBand(key, channels, options13);
    case "identity":
      return registry.get(key) === position ? createScaleIdentity() : { type: "identity" };
    case undefined:
      return;
    default:
      throw new Error(`unknown scale type: ${type6}`);
  }
};
var formatScaleType = function(type6) {
  return typeof type6 === "symbol" ? type6.description : type6;
};
var inferScaleType = function(key, channels, { type: type6, domain, range: range5, scheme: scheme28, pivot, projection: projection3 }) {
  if (key === "fx" || key === "fy")
    return "band";
  if ((key === "x" || key === "y") && projection3 != null)
    type6 = typeProjection;
  for (const { type: t } of channels) {
    if (t === undefined)
      continue;
    else if (type6 === undefined)
      type6 = t;
    else if (type6 !== t)
      throw new Error(`scale incompatible with channel: ${type6} !== ${t}`);
  }
  if (type6 === typeProjection)
    return;
  if (type6 !== undefined)
    return type6;
  if (domain === undefined && !channels.some(({ value: value5 }) => value5 !== undefined))
    return;
  const kind = registry.get(key);
  if (kind === radius)
    return "sqrt";
  if (kind === opacity || kind === length2)
    return "linear";
  if (kind === symbol)
    return "ordinal";
  if ((domain || range5 || []).length > 2)
    return asOrdinalType(kind);
  if (domain !== undefined) {
    if (isOrdinal(domain))
      return asOrdinalType(kind);
    if (isTemporal(domain))
      return "utc";
  } else {
    const values4 = channels.map(({ value: value5 }) => value5).filter((value5) => value5 !== undefined);
    if (values4.some(isOrdinal))
      return asOrdinalType(kind);
    if (values4.some(isTemporal))
      return "utc";
  }
  if (kind === color9) {
    if (pivot != null || isDivergingScheme(scheme28))
      return "diverging";
    if (isCategoricalScheme(scheme28))
      return "categorical";
  }
  return "linear";
};
var asOrdinalType = function(kind) {
  switch (kind) {
    case position:
      return "point";
    case color9:
      return ordinalImplicit;
    default:
      return "ordinal";
  }
};
function isTemporalScale({ type: type6 }) {
  return type6 === "time" || type6 === "utc";
}
function isOrdinalScale({ type: type6 }) {
  return type6 === "ordinal" || type6 === "point" || type6 === "band" || type6 === ordinalImplicit;
}
function isThresholdScale({ type: type6 }) {
  return type6 === "threshold";
}
var isBandScale = function({ type: type6 }) {
  return type6 === "point" || type6 === "band";
};
function isCollapsed(scale) {
  if (scale === undefined)
    return true;
  const domain = scale.domain();
  const value5 = scale(domain[0]);
  for (let i = 1, n = domain.length;i < n; ++i) {
    if (scale(domain[i]) - value5) {
      return false;
    }
  }
  return true;
}
var coerceType = function(channels, { domain, ...options13 }, coerceValues) {
  for (const c4 of channels) {
    if (c4.value !== undefined) {
      c4.value = coerceValues(c4.value);
    }
  }
  return {
    domain: domain === undefined ? domain : coerceValues(domain),
    ...options13
  };
};
var coerceSymbols = function(values4) {
  return map7(values4, maybeSymbol);
};
function exposeScales(scaleDescriptors) {
  return (key) => {
    if (!registry.has(key = `${key}`))
      throw new Error(`unknown scale: ${key}`);
    return key in scaleDescriptors ? exposeScale(scaleDescriptors[key]) : undefined;
  };
}
var exposeScale = function({ scale, type: type6, domain, range: range5, interpolate: interpolate3, interval: interval10, transform: transform5, percent, pivot }) {
  if (type6 === "identity")
    return { type: "identity", apply: (d) => d, invert: (d) => d };
  const unknown = scale.unknown ? scale.unknown() : undefined;
  return {
    type: type6,
    domain: slice2(domain),
    ...range5 !== undefined && { range: slice2(range5) },
    ...transform5 !== undefined && { transform: transform5 },
    ...percent && { percent },
    ...unknown !== undefined && { unknown },
    ...interval10 !== undefined && { interval: interval10 },
    ...interpolate3 !== undefined && { interpolate: interpolate3 },
    ...scale.clamp && { clamp: scale.clamp() },
    ...pivot !== undefined && { pivot, symmetric: false },
    ...scale.base && { base: scale.base() },
    ...scale.exponent && { exponent: scale.exponent() },
    ...scale.constant && { constant: scale.constant() },
    ...scale.align && { align: scale.align(), round: scale.round() },
    ...scale.padding && (scale.paddingInner ? { paddingInner: scale.paddingInner(), paddingOuter: scale.paddingOuter() } : { padding: scale.padding() }),
    ...scale.bandwidth && { bandwidth: scale.bandwidth(), step: scale.step() },
    apply: (t) => scale(t),
    ...scale.invert && { invert: (t) => scale.invert(t) }
  };
};
var typeProjection = { toString: () => "projection" };

// node_modules/@observablehq/plot/src/dimensions.js
function createDimensions(scales4, marks, options13 = {}) {
  let marginTopDefault = 0.5 - offset, marginRightDefault = 0.5 + offset, marginBottomDefault = 0.5 + offset, marginLeftDefault = 0.5 - offset;
  for (const { marginTop: marginTop2, marginRight: marginRight2, marginBottom: marginBottom2, marginLeft: marginLeft2 } of marks) {
    if (marginTop2 > marginTopDefault)
      marginTopDefault = marginTop2;
    if (marginRight2 > marginRightDefault)
      marginRightDefault = marginRight2;
    if (marginBottom2 > marginBottomDefault)
      marginBottomDefault = marginBottom2;
    if (marginLeft2 > marginLeftDefault)
      marginLeftDefault = marginLeft2;
  }
  let {
    margin,
    marginTop = margin !== undefined ? margin : marginTopDefault,
    marginRight = margin !== undefined ? margin : marginRightDefault,
    marginBottom = margin !== undefined ? margin : marginBottomDefault,
    marginLeft = margin !== undefined ? margin : marginLeftDefault
  } = options13;
  marginTop = +marginTop;
  marginRight = +marginRight;
  marginBottom = +marginBottom;
  marginLeft = +marginLeft;
  let {
    width = 640,
    height = autoHeight(scales4, options13, {
      width,
      marginTopDefault,
      marginRightDefault,
      marginBottomDefault,
      marginLeftDefault
    }) + Math.max(0, marginTop - marginTopDefault + marginBottom - marginBottomDefault)
  } = options13;
  width = +width;
  height = +height;
  const dimensions = {
    width,
    height,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft
  };
  if (scales4.fx || scales4.fy) {
    let {
      margin: facetMargin,
      marginTop: facetMarginTop = facetMargin !== undefined ? facetMargin : marginTop,
      marginRight: facetMarginRight = facetMargin !== undefined ? facetMargin : marginRight,
      marginBottom: facetMarginBottom = facetMargin !== undefined ? facetMargin : marginBottom,
      marginLeft: facetMarginLeft = facetMargin !== undefined ? facetMargin : marginLeft
    } = options13.facet ?? {};
    facetMarginTop = +facetMarginTop;
    facetMarginRight = +facetMarginRight;
    facetMarginBottom = +facetMarginBottom;
    facetMarginLeft = +facetMarginLeft;
    dimensions.facet = {
      marginTop: facetMarginTop,
      marginRight: facetMarginRight,
      marginBottom: facetMarginBottom,
      marginLeft: facetMarginLeft
    };
  }
  return dimensions;
}
var autoHeight = function({ x: x2, y: y2, fy, fx }, { projection: projection4, aspectRatio }, { width, marginTopDefault, marginRightDefault, marginBottomDefault, marginLeftDefault }) {
  const nfy = fy ? fy.scale.domain().length : 1;
  const ar = projectionAspectRatio(projection4);
  if (ar) {
    const nfx = fx ? fx.scale.domain().length : 1;
    const far = (1.1 * nfy - 0.1) / (1.1 * nfx - 0.1) * ar;
    const lar = Math.max(0.1, Math.min(10, far));
    return Math.round((width - marginLeftDefault - marginRightDefault) * lar + marginTopDefault + marginBottomDefault);
  }
  const ny = y2 ? isOrdinalScale(y2) ? y2.scale.domain().length : Math.max(7, 17 / nfy) : 1;
  if (aspectRatio != null) {
    aspectRatio = +aspectRatio;
    if (!(isFinite(aspectRatio) && aspectRatio > 0))
      throw new Error(`invalid aspectRatio: ${aspectRatio}`);
    const ratio = aspectRatioLength("y", y2) / (aspectRatioLength("x", x2) * aspectRatio);
    const fxb = fx ? fx.scale.bandwidth() : 1;
    const fyb = fy ? fy.scale.bandwidth() : 1;
    const w = fxb * (width - marginLeftDefault - marginRightDefault) - x2.insetLeft - x2.insetRight;
    return (ratio * w + y2.insetTop + y2.insetBottom) / fyb + marginTopDefault + marginBottomDefault;
  }
  return !!(y2 || fy) * Math.max(1, Math.min(60, ny * nfy)) * 20 + !!fx * 30 + 60;
};
var aspectRatioLength = function(k2, scale) {
  if (!scale)
    throw new Error(`aspectRatio requires ${k2} scale`);
  const { type: type6, domain } = scale;
  let transform5;
  switch (type6) {
    case "linear":
    case "utc":
    case "time":
      transform5 = Number;
      break;
    case "pow": {
      const exponent5 = scale.scale.exponent();
      transform5 = (x2) => Math.pow(x2, exponent5);
      break;
    }
    case "log":
      transform5 = Math.log;
      break;
    case "point":
    case "band":
      return domain.length;
    default:
      throw new Error(`unsupported ${k2} scale for aspectRatio: ${type6}`);
  }
  const [min4, max5] = extent(domain);
  return Math.abs(transform5(max5) - transform5(min4));
};

// node_modules/@observablehq/plot/src/facet.js
function createFacets(channelsByScale, options14) {
  const { fx, fy } = createScales(channelsByScale, options14);
  const fxDomain = fx?.scale.domain();
  const fyDomain = fy?.scale.domain();
  return fxDomain && fyDomain ? cross(fxDomain, fyDomain).map(([x2, y2], i) => ({ x: x2, y: y2, i })) : fxDomain ? fxDomain.map((x2, i) => ({ x: x2, i })) : fyDomain ? fyDomain.map((y2, i) => ({ y: y2, i })) : undefined;
}
function recreateFacets(facets, { x: X3, y: Y3 }) {
  X3 &&= facetIndex(X3);
  Y3 &&= facetIndex(Y3);
  return facets.filter(X3 && Y3 ? (f) => X3.has(f.x) && Y3.has(f.y) : X3 ? (f) => X3.has(f.x) : (f) => Y3.has(f.y)).sort(X3 && Y3 ? (a2, b) => X3.get(a2.x) - X3.get(b.x) || Y3.get(a2.y) - Y3.get(b.y) : X3 ? (a2, b) => X3.get(a2.x) - X3.get(b.x) : (a2, b) => Y3.get(a2.y) - Y3.get(b.y));
}
function facetGroups(data2, { fx, fy }) {
  const I = range4(data2);
  const FX = fx?.value;
  const FY = fy?.value;
  return fx && fy ? rollup(I, (G) => (G.fx = FX[G[0]], G.fy = FY[G[0]], G), (i) => FX[i], (i) => FY[i]) : fx ? rollup(I, (G) => (G.fx = FX[G[0]], G), (i) => FX[i]) : rollup(I, (G) => (G.fy = FY[G[0]], G), (i) => FY[i]);
}
function facetTranslator(fx, fy, { marginTop, marginLeft }) {
  return fx && fy ? ({ x: x2, y: y2 }) => `translate(${fx(x2) - marginLeft},${fy(y2) - marginTop})` : fx ? ({ x: x2 }) => `translate(${fx(x2) - marginLeft},0)` : ({ y: y2 }) => `translate(0,${fy(y2) - marginTop})`;
}
function facetExclude(index2) {
  const ex = [];
  const e3 = new Uint32Array(sum3(index2, (d) => d.length));
  for (const i of index2) {
    let n = 0;
    for (const j of index2) {
      if (i === j)
        continue;
      e3.set(j, n);
      n += j.length;
    }
    ex.push(e3.slice(0, n));
  }
  return ex;
}
function maybeFacetAnchor(facetAnchor) {
  if (facetAnchor == null)
    return null;
  const anchor = facetAnchors.get(`${facetAnchor}`.toLowerCase());
  if (anchor)
    return anchor;
  throw new Error(`invalid facet anchor: ${facetAnchor}`);
}
var facetIndex = function(V) {
  let I = indexCache.get(V);
  if (!I)
    indexCache.set(V, I = new InternMap(map7(V, (v, i) => [v, i])));
  return I;
};
var facetIndexOf = function(V, v) {
  return facetIndex(V).get(v);
};
var facetFind = function(facets, x2, y2) {
  x2 = keyof2(x2);
  y2 = keyof2(y2);
  return facets.find((f) => Object.is(keyof2(f.x), x2) && Object.is(keyof2(f.y), y2));
};
var facetEmpty = function(facets, x2, y2) {
  return facetFind(facets, x2, y2)?.empty;
};
var facetAnchorTop = function(facets, { y: Y3 }, { y: y2 }) {
  return Y3 ? facetIndexOf(Y3, y2) === 0 : true;
};
var facetAnchorBottom = function(facets, { y: Y3 }, { y: y2 }) {
  return Y3 ? facetIndexOf(Y3, y2) === Y3.length - 1 : true;
};
var facetAnchorLeft = function(facets, { x: X3 }, { x: x2 }) {
  return X3 ? facetIndexOf(X3, x2) === 0 : true;
};
var facetAnchorRight = function(facets, { x: X3 }, { x: x2 }) {
  return X3 ? facetIndexOf(X3, x2) === X3.length - 1 : true;
};
var facetAnchorTopEmpty = function(facets, { y: Y3 }, { x: x2, y: y2, empty: empty4 }) {
  if (empty4)
    return false;
  if (!Y3)
    return;
  const i = facetIndexOf(Y3, y2);
  if (i > 0)
    return facetEmpty(facets, x2, Y3[i - 1]);
};
var facetAnchorBottomEmpty = function(facets, { y: Y3 }, { x: x2, y: y2, empty: empty4 }) {
  if (empty4)
    return false;
  if (!Y3)
    return;
  const i = facetIndexOf(Y3, y2);
  if (i < Y3.length - 1)
    return facetEmpty(facets, x2, Y3[i + 1]);
};
var facetAnchorLeftEmpty = function(facets, { x: X3 }, { x: x2, y: y2, empty: empty4 }) {
  if (empty4)
    return false;
  if (!X3)
    return;
  const i = facetIndexOf(X3, x2);
  if (i > 0)
    return facetEmpty(facets, X3[i - 1], y2);
};
var facetAnchorRightEmpty = function(facets, { x: X3 }, { x: x2, y: y2, empty: empty4 }) {
  if (empty4)
    return false;
  if (!X3)
    return;
  const i = facetIndexOf(X3, x2);
  if (i < X3.length - 1)
    return facetEmpty(facets, X3[i + 1], y2);
};
var facetAnchorEmpty = function(facets, channels, { empty: empty4 }) {
  return empty4;
};
var and = function(a2, b) {
  return function() {
    return a2.apply(null, arguments) && b.apply(null, arguments);
  };
};
function facetFilter(facets, { channels: { fx, fy }, groups: groups2 }) {
  return fx && fy ? facets.map(({ x: x2, y: y2 }) => groups2.get(x2)?.get(y2) ?? []) : fx ? facets.map(({ x: x2 }) => groups2.get(x2) ?? []) : facets.map(({ y: y2 }) => groups2.get(y2) ?? []);
}
var facetAnchors = new Map([
  ["top", facetAnchorTop],
  ["right", facetAnchorRight],
  ["bottom", facetAnchorBottom],
  ["left", facetAnchorLeft],
  ["top-left", and(facetAnchorTop, facetAnchorLeft)],
  ["top-right", and(facetAnchorTop, facetAnchorRight)],
  ["bottom-left", and(facetAnchorBottom, facetAnchorLeft)],
  ["bottom-right", and(facetAnchorBottom, facetAnchorRight)],
  ["top-empty", facetAnchorTopEmpty],
  ["right-empty", facetAnchorRightEmpty],
  ["bottom-empty", facetAnchorBottomEmpty],
  ["left-empty", facetAnchorLeftEmpty],
  ["empty", facetAnchorEmpty]
]);
var indexCache = new WeakMap;

// node_modules/@observablehq/plot/src/mark.js
function marks(...marks2) {
  marks2.plot = Mark.prototype.plot;
  return marks2;
}
function composeRender(r1, r2) {
  if (r1 == null)
    return r2 === null ? undefined : r2;
  if (r2 == null)
    return r1 === null ? undefined : r1;
  if (typeof r1 !== "function")
    throw new TypeError(`invalid render transform: ${r1}`);
  if (typeof r2 !== "function")
    throw new TypeError(`invalid render transform: ${r2}`);
  return function(i, s2, v, d, c4, next) {
    return r1.call(this, i, s2, v, d, c4, (i2, s3, v2, d2, c5) => {
      return r2.call(this, i2, s3, v2, d2, c5, next);
    });
  };
}
var maybeChannels = function(channels) {
  return Object.fromEntries(Object.entries(maybeNamed(channels)).map(([name, channel2]) => {
    channel2 = maybeValue(channel2);
    if (channel2.filter === undefined && channel2.scale == null)
      channel2 = { ...channel2, filter: null };
    return [name, channel2];
  }));
};
var maybeTip = function(tip) {
  return tip === true ? "xy" : tip === false ? null : maybeKeyword(tip, "tip", ["x", "y", "xy"]);
};
function withTip(options16, tip) {
  return options16?.tip === true ? { ...options16, tip } : options16;
}

class Mark {
  constructor(data2, channels = {}, options16 = {}, defaults) {
    const {
      facet: facet2 = "auto",
      facetAnchor,
      fx,
      fy,
      sort: sort6,
      dx = 0,
      dy = 0,
      margin = 0,
      marginTop = margin,
      marginRight = margin,
      marginBottom = margin,
      marginLeft = margin,
      clip = defaults?.clip,
      channels: extraChannels,
      tip,
      render
    } = options16;
    this.data = data2;
    this.sort = isDomainSort(sort6) ? sort6 : null;
    this.initializer = initializer(options16).initializer;
    this.transform = this.initializer ? options16.transform : basic(options16).transform;
    if (facet2 === null || facet2 === false) {
      this.facet = null;
    } else {
      this.facet = keyword(facet2 === true ? "include" : facet2, "facet", ["auto", "include", "exclude", "super"]);
      this.fx = data2 === singleton && typeof fx === "string" ? [fx] : fx;
      this.fy = data2 === singleton && typeof fy === "string" ? [fy] : fy;
    }
    this.facetAnchor = maybeFacetAnchor(facetAnchor);
    channels = maybeNamed(channels);
    if (extraChannels !== undefined)
      channels = { ...maybeChannels(extraChannels), ...channels };
    if (defaults !== undefined)
      channels = { ...styles(this, options16, defaults), ...channels };
    this.channels = Object.fromEntries(Object.entries(channels).map(([name, channel2]) => {
      if (isOptions(channel2.value)) {
        const { value: value5, scale = channel2.scale } = channel2.value;
        channel2 = { ...channel2, scale, value: value5 };
      }
      if (data2 === singleton && typeof channel2.value === "string") {
        const { value: value5 } = channel2;
        channel2 = { ...channel2, value: [value5] };
      }
      return [name, channel2];
    }).filter(([name, { value: value5, optional }]) => {
      if (value5 != null)
        return true;
      if (optional)
        return false;
      throw new Error(`missing channel value: ${name}`);
    }));
    this.dx = +dx;
    this.dy = +dy;
    this.marginTop = +marginTop;
    this.marginRight = +marginRight;
    this.marginBottom = +marginBottom;
    this.marginLeft = +marginLeft;
    this.clip = maybeClip(clip);
    this.tip = maybeTip(tip);
    if (this.facet === "super") {
      if (fx || fy)
        throw new Error(`super-faceting cannot use fx or fy`);
      for (const name in this.channels) {
        const { scale } = channels[name];
        if (scale !== "x" && scale !== "y")
          continue;
        throw new Error(`super-faceting cannot use x or y`);
      }
    }
    if (render != null) {
      this.render = composeRender(render, this.render);
    }
  }
  initialize(facets, facetChannels, plotOptions) {
    let data2 = arrayify2(this.data);
    if (facets === undefined && data2 != null)
      facets = [range4(data2)];
    const originalFacets = facets;
    if (this.transform != null)
      ({ facets, data: data2 } = this.transform(data2, facets, plotOptions)), data2 = arrayify2(data2);
    if (facets !== undefined)
      facets.original = originalFacets;
    const channels = createChannels(this.channels, data2);
    if (this.sort != null)
      channelDomain(data2, facets, channels, facetChannels, this.sort);
    return { data: data2, facets, channels };
  }
  filter(index2, channels, values4) {
    for (const name in channels) {
      const { filter: filter6 = defined } = channels[name];
      if (filter6 !== null) {
        const value5 = values4[name];
        index2 = index2.filter((i) => filter6(value5[i]));
      }
    }
    return index2;
  }
  project(channels, values4, context3) {
    for (const cx in channels) {
      if (channels[cx].scale === "x" && /^x|x$/.test(cx)) {
        const cy = cx.replace(/^x|x$/, "y");
        if ((cy in channels) && channels[cy].scale === "y") {
          project(cx, cy, values4, context3.projection);
        }
      }
    }
  }
  scale(channels, scales5, context3) {
    const values4 = valueObject(channels, scales5);
    if (context3.projection)
      this.project(channels, values4, context3);
    return values4;
  }
}

// node_modules/@observablehq/plot/src/interactions/pointer.js
var pointerK = function(kx2, ky2, { x: x2, y: y2, px, py, maxRadius = 40, channels, render, ...options16 } = {}) {
  maxRadius = +maxRadius;
  if (px != null)
    x2 ??= null, channels = { ...channels, px: { value: px, scale: "x" } };
  if (py != null)
    y2 ??= null, channels = { ...channels, py: { value: py, scale: "y" } };
  return {
    x: x2,
    y: y2,
    channels,
    ...options16,
    render: composeRender(function(index2, scales5, values4, dimensions, context3, next) {
      context3 = { ...context3, pointerSticky: false };
      const svg = context3.ownerSVGElement;
      const { data: data2 } = context3.getMarkState(this);
      let state = states.get(svg);
      if (!state)
        states.set(svg, state = { sticky: false, roots: [], renders: [] });
      let renderIndex = state.renders.push(render2) - 1;
      const { x: x3, y: y3, fx, fy } = scales5;
      let tx = fx ? fx(index2.fx) - dimensions.marginLeft : 0;
      let ty = fy ? fy(index2.fy) - dimensions.marginTop : 0;
      if (x3?.bandwidth)
        tx += x3.bandwidth() / 2;
      if (y3?.bandwidth)
        ty += y3.bandwidth() / 2;
      const faceted = index2.fi != null;
      let facetState;
      if (faceted) {
        let facetStates = state.facetStates;
        if (!facetStates)
          state.facetStates = facetStates = new Map;
        facetState = facetStates.get(this);
        if (!facetState)
          facetStates.set(this, facetState = new Map);
      }
      const [cx, cy] = applyFrameAnchor(this, dimensions);
      const { px: PX, py: PY } = values4;
      const px2 = PX ? (i2) => PX[i2] : anchorX(values4, cx);
      const py2 = PY ? (i2) => PY[i2] : anchorY(values4, cy);
      let i;
      let g;
      let s2;
      let f;
      function update(ii, ri) {
        if (faceted) {
          if (f)
            f = cancelAnimationFrame(f);
          if (ii == null)
            facetState.delete(index2.fi);
          else {
            facetState.set(index2.fi, ri);
            f = requestAnimationFrame(() => {
              f = null;
              for (const [fi, r] of facetState) {
                if (r < ri || r === ri && fi < index2.fi) {
                  ii = null;
                  break;
                }
              }
              render2(ii);
            });
            return;
          }
        }
        render2(ii);
      }
      function render2(ii) {
        if (i === ii && s2 === state.sticky)
          return;
        i = ii;
        s2 = context3.pointerSticky = state.sticky;
        const I = i == null ? [] : [i];
        if (faceted)
          I.fx = index2.fx, I.fy = index2.fy, I.fi = index2.fi;
        const r = next(I, scales5, values4, dimensions, context3);
        if (g) {
          if (faceted) {
            const p = g.parentNode;
            const ft = g.getAttribute("transform");
            const mt = r.getAttribute("transform");
            ft ? r.setAttribute("transform", ft) : r.removeAttribute("transform");
            mt ? p.setAttribute("transform", mt) : p.removeAttribute("transform");
            r.removeAttribute("aria-label");
            r.removeAttribute("aria-description");
            r.removeAttribute("aria-hidden");
          }
          g.replaceWith(r);
        }
        state.roots[renderIndex] = g = r;
        if (!(i == null && facetState?.size > 1))
          context3.dispatchValue(i == null ? null : data2[i]);
        return r;
      }
      function pointermove(event3) {
        if (state.sticky || event3.pointerType === "mouse" && event3.buttons === 1)
          return;
        let [xp, yp] = pointer_default(event3);
        xp -= tx, yp -= ty;
        const kpx = xp < dimensions.marginLeft || xp > dimensions.width - dimensions.marginRight ? 1 : kx2;
        const kpy = yp < dimensions.marginTop || yp > dimensions.height - dimensions.marginBottom ? 1 : ky2;
        let ii = null;
        let ri = maxRadius * maxRadius;
        for (const j of index2) {
          const dx = kpx * (px2(j) - xp);
          const dy = kpy * (py2(j) - yp);
          const rj = dx * dx + dy * dy;
          if (rj <= ri)
            ii = j, ri = rj;
        }
        if (ii != null && (kx2 !== 1 || ky2 !== 1)) {
          const dx = px2(ii) - xp;
          const dy = py2(ii) - yp;
          ri = dx * dx + dy * dy;
        }
        update(ii, ri);
      }
      function pointerdown(event3) {
        if (event3.pointerType !== "mouse")
          return;
        if (i == null)
          return;
        if (state.sticky && state.roots.some((r) => r?.contains(event3.target)))
          return;
        if (state.sticky)
          state.sticky = false, state.renders.forEach((r) => r(null));
        else
          state.sticky = true, render2(i);
        event3.stopImmediatePropagation();
      }
      function pointerleave(event3) {
        if (event3.pointerType !== "mouse")
          return;
        if (!state.sticky)
          update(null);
      }
      svg.addEventListener("pointerenter", pointermove);
      svg.addEventListener("pointermove", pointermove);
      svg.addEventListener("pointerdown", pointerdown);
      svg.addEventListener("pointerleave", pointerleave);
      return render2(null);
    }, render)
  };
};
function pointer(options16) {
  return pointerK(1, 1, options16);
}
function pointerX(options16) {
  return pointerK(1, 0.01, options16);
}
function pointerY(options16) {
  return pointerK(0.01, 1, options16);
}
function anchorX({ x1: X12, x2: X22, x: X3 = X12 }, cx) {
  return X12 && X22 ? (i) => (X12[i] + X22[i]) / 2 : X3 ? (i) => X3[i] : () => cx;
}
function anchorY({ y1: Y12, y2: Y22, y: Y3 = Y12 }, cy) {
  return Y12 && Y22 ? (i) => (Y12[i] + Y22[i]) / 2 : Y3 ? (i) => Y3[i] : () => cy;
}
var states = new WeakMap;

// node_modules/@observablehq/plot/src/axes.js
function inferFontVariant(scale) {
  return isOrdinalScale(scale) && scale.interval === undefined ? undefined : "tabular-nums";
}

// node_modules/@observablehq/plot/src/legends/ramp.js
function legendRamp(color10, options17) {
  let {
    label = color10.label,
    tickSize = 6,
    width = 240,
    height = 44 + tickSize,
    marginTop = 18,
    marginRight = 0,
    marginBottom = 16 + tickSize,
    marginLeft = 0,
    style: style8,
    ticks: ticks2 = (width - marginLeft - marginRight) / 64,
    tickFormat: tickFormat3,
    fontVariant = inferFontVariant(color10),
    round = true,
    opacity: opacity2,
    className
  } = options17;
  const context4 = createContext(options17);
  className = maybeClassName(className);
  opacity2 = maybeNumberChannel(opacity2)[1];
  if (tickFormat3 === null)
    tickFormat3 = () => null;
  const svg = create2("svg", context4).attr("class", `${className}-ramp`).attr("font-family", "system-ui, sans-serif").attr("font-size", 10).attr("width", width).attr("height", height).attr("viewBox", `0 0 ${width} ${height}`).call((svg2) => svg2.append("style").text(`.${className}-ramp {
  display: block;
  background: white;
  height: auto;
  height: intrinsic;
  max-width: 100%;
  overflow: visible;
}
.${className}-ramp text {
  white-space: pre;
}`)).call(applyInlineStyles, style8);
  let tickAdjust = (g) => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
  let x2;
  const applyRange = round ? (x3, range6) => x3.rangeRound(range6) : (x3, range6) => x3.range(range6);
  const { type: type6, domain, range: range5, interpolate: interpolate3, scale, pivot } = color10;
  if (interpolate3) {
    const interpolator = range5 === undefined ? interpolate3 : piecewise(interpolate3.length === 1 ? interpolatePiecewise(interpolate3) : interpolate3, range5);
    x2 = applyRange(scale.copy(), quantize_default(number_default(marginLeft, width - marginRight), Math.min(domain.length + (pivot !== undefined), range5 === undefined ? Infinity : range5.length)));
    const n = 256;
    const canvas = context4.document.createElement("canvas");
    canvas.width = n;
    canvas.height = 1;
    const context22 = canvas.getContext("2d");
    for (let i = 0, j = n - 1;i < n; ++i) {
      context22.fillStyle = interpolator(i / j);
      context22.fillRect(i, 0, 1, 1);
    }
    svg.append("image").attr("opacity", opacity2).attr("x", marginLeft).attr("y", marginTop).attr("width", width - marginLeft - marginRight).attr("height", height - marginTop - marginBottom).attr("preserveAspectRatio", "none").attr("xlink:href", canvas.toDataURL());
  } else if (type6 === "threshold") {
    const thresholds = domain;
    const thresholdFormat = tickFormat3 === undefined ? (d) => d : typeof tickFormat3 === "string" ? format(tickFormat3) : tickFormat3;
    x2 = applyRange(linear2().domain([-1, range5.length - 1]), [marginLeft, width - marginRight]);
    svg.append("g").attr("fill-opacity", opacity2).selectAll().data(range5).enter().append("rect").attr("x", (d, i) => x2(i - 1)).attr("y", marginTop).attr("width", (d, i) => x2(i) - x2(i - 1)).attr("height", height - marginTop - marginBottom).attr("fill", (d) => d);
    ticks2 = map7(thresholds, (_, i) => i);
    tickFormat3 = (i) => thresholdFormat(thresholds[i], i);
  } else {
    x2 = applyRange(band().domain(domain), [marginLeft, width - marginRight]);
    svg.append("g").attr("fill-opacity", opacity2).selectAll().data(domain).enter().append("rect").attr("x", x2).attr("y", marginTop).attr("width", Math.max(0, x2.bandwidth() - 1)).attr("height", height - marginTop - marginBottom).attr("fill", scale);
    tickAdjust = () => {
    };
  }
  svg.append("g").attr("transform", `translate(0,${height - marginBottom})`).call(axisBottom(x2).ticks(Array.isArray(ticks2) ? null : ticks2, typeof tickFormat3 === "string" ? tickFormat3 : undefined).tickFormat(typeof tickFormat3 === "function" ? tickFormat3 : undefined).tickSize(tickSize).tickValues(Array.isArray(ticks2) ? ticks2 : null)).attr("font-size", null).attr("font-family", null).attr("font-variant", impliedString(fontVariant, "normal")).call(tickAdjust).call((g) => g.select(".domain").remove());
  if (label !== undefined) {
    svg.append("text").attr("x", marginLeft).attr("y", marginTop - 6).attr("fill", "currentColor").attr("font-weight", "bold").text(label);
  }
  return svg.node();
}

// node_modules/@observablehq/plot/src/math.js
var radians3 = Math.PI / 180;

// node_modules/@observablehq/plot/src/marker.js
function markers(mark2, { marker, markerStart = marker, markerMid = marker, markerEnd = marker } = {}) {
  mark2.markerStart = maybeMarker(markerStart);
  mark2.markerMid = maybeMarker(markerMid);
  mark2.markerEnd = maybeMarker(markerEnd);
}
var maybeMarker = function(marker) {
  if (marker == null || marker === false)
    return null;
  if (marker === true)
    return markerCircleFill;
  if (typeof marker === "function")
    return marker;
  switch (`${marker}`.toLowerCase()) {
    case "none":
      return null;
    case "arrow":
      return markerArrow("auto");
    case "arrow-reverse":
      return markerArrow("auto-start-reverse");
    case "dot":
      return markerDot;
    case "circle":
    case "circle-fill":
      return markerCircleFill;
    case "circle-stroke":
      return markerCircleStroke;
  }
  throw new Error(`invalid marker: ${marker}`);
};
var markerArrow = function(orient) {
  return (color10, context5) => create2("svg:marker", context5).attr("viewBox", "-5 -5 10 10").attr("markerWidth", 6.67).attr("markerHeight", 6.67).attr("orient", orient).attr("fill", "none").attr("stroke", color10).attr("stroke-width", 1.5).attr("stroke-linecap", "round").attr("stroke-linejoin", "round").call((marker) => marker.append("path").attr("d", "M-1.5,-3l3,3l-3,3")).node();
};
var markerDot = function(color10, context5) {
  return create2("svg:marker", context5).attr("viewBox", "-5 -5 10 10").attr("markerWidth", 6.67).attr("markerHeight", 6.67).attr("fill", color10).attr("stroke", "none").call((marker) => marker.append("circle").attr("r", 2.5)).node();
};
var markerCircleFill = function(color10, context5) {
  return create2("svg:marker", context5).attr("viewBox", "-5 -5 10 10").attr("markerWidth", 6.67).attr("markerHeight", 6.67).attr("fill", color10).attr("stroke", "white").attr("stroke-width", 1.5).call((marker) => marker.append("circle").attr("r", 3)).node();
};
var markerCircleStroke = function(color10, context5) {
  return create2("svg:marker", context5).attr("viewBox", "-5 -5 10 10").attr("markerWidth", 6.67).attr("markerHeight", 6.67).attr("fill", "white").attr("stroke", color10).attr("stroke-width", 1.5).call((marker) => marker.append("circle").attr("r", 3)).node();
};
function applyMarkers(path3, mark2, { stroke: S }, context5) {
  return applyMarkersColor(path3, mark2, S && ((i) => S[i]), context5);
}
function applyGroupedMarkers(path3, mark2, { stroke: S }, context5) {
  return applyMarkersColor(path3, mark2, S && (([i]) => S[i]), context5);
}
var applyMarkersColor = function(path3, { markerStart, markerMid, markerEnd, stroke }, strokeof = () => stroke, context5) {
  const iriByMarkerColor = new Map;
  function applyMarker(marker) {
    return function(i) {
      const color10 = strokeof(i);
      let iriByColor = iriByMarkerColor.get(marker);
      if (!iriByColor)
        iriByMarkerColor.set(marker, iriByColor = new Map);
      let iri = iriByColor.get(color10);
      if (!iri) {
        const node2 = this.parentNode.insertBefore(marker(color10, context5), this);
        const id2 = `plot-marker-${++nextMarkerId}`;
        node2.setAttribute("id", id2);
        iriByColor.set(color10, iri = `url(#${id2})`);
      }
      return iri;
    };
  }
  if (markerStart)
    path3.attr("marker-start", applyMarker(markerStart));
  if (markerMid)
    path3.attr("marker-mid", applyMarker(markerMid));
  if (markerEnd)
    path3.attr("marker-end", applyMarker(markerEnd));
};
var nextMarkerId = 0;

// node_modules/@observablehq/plot/src/transforms/inset.js
function maybeInsetX({ inset, insetLeft, insetRight, ...options17 } = {}) {
  [insetLeft, insetRight] = maybeInset(inset, insetLeft, insetRight);
  return { inset, insetLeft, insetRight, ...options17 };
}
function maybeInsetY({ inset, insetTop, insetBottom, ...options17 } = {}) {
  [insetTop, insetBottom] = maybeInset(inset, insetTop, insetBottom);
  return { inset, insetTop, insetBottom, ...options17 };
}
var maybeInset = function(inset, inset1, inset2) {
  return inset === undefined && inset1 === undefined && inset2 === undefined ? offset ? [1, 0] : [0.5, 0.5] : [inset1, inset2];
};

// node_modules/@observablehq/plot/src/transforms/interval.js
var maybeIntervalValue = function(value5, { interval: interval10 }) {
  value5 = { ...maybeValue(value5) };
  value5.interval = maybeInterval(value5.interval === undefined ? interval10 : value5.interval);
  return value5;
};
var maybeIntervalK = function(k2, maybeInsetK, options18, trivial) {
  const { [k2]: v, [`${k2}1`]: v1, [`${k2}2`]: v2 } = options18;
  const { value: value5, interval: interval10 } = maybeIntervalValue(v, options18);
  if (value5 == null || interval10 == null && !trivial)
    return options18;
  const label = labelof(v);
  if (interval10 == null) {
    let V;
    const kv = { transform: (data2) => V || (V = valueof(data2, value5)), label };
    return {
      ...options18,
      [k2]: undefined,
      [`${k2}1`]: v1 === undefined ? kv : v1,
      [`${k2}2`]: v2 === undefined ? kv : v2
    };
  }
  let D1, V1;
  function transform5(data2) {
    if (V1 !== undefined && data2 === D1)
      return V1;
    return V1 = map7(valueof(D1 = data2, value5), (v3) => interval10.floor(v3));
  }
  return maybeInsetK({
    ...options18,
    [k2]: undefined,
    [`${k2}1`]: v1 === undefined ? { transform: transform5, label } : v1,
    [`${k2}2`]: v2 === undefined ? { transform: (data2) => transform5(data2).map((v3) => interval10.offset(v3)), label } : v2
  });
};
var maybeIntervalMidK = function(k2, maybeInsetK, options18) {
  const { [k2]: v } = options18;
  const { value: value5, interval: interval10 } = maybeIntervalValue(v, options18);
  if (value5 == null || interval10 == null)
    return options18;
  return maybeInsetK({
    ...options18,
    [k2]: {
      label: labelof(v),
      transform: (data2) => {
        const V1 = map7(valueof(data2, value5), (v2) => interval10.floor(v2));
        const V2 = V1.map((v2) => interval10.offset(v2));
        return V1.map(isTemporal(V1) ? (v1, v2) => v1 == null || isNaN(v1 = +v1) || (v2 = V2[v2], v2 == null) || isNaN(v2 = +v2) ? undefined : new Date((v1 + v2) / 2) : (v1, v2) => v1 == null || (v2 = V2[v2], v2 == null) ? NaN : (+v1 + +v2) / 2);
      }
    }
  });
};
function maybeTrivialIntervalX(options18 = {}) {
  return maybeIntervalK("x", maybeInsetX, options18, true);
}
function maybeTrivialIntervalY(options18 = {}) {
  return maybeIntervalK("y", maybeInsetY, options18, true);
}
function maybeIntervalX(options18 = {}) {
  return maybeIntervalK("x", maybeInsetX, options18);
}
function maybeIntervalY(options18 = {}) {
  return maybeIntervalK("y", maybeInsetY, options18);
}
function maybeIntervalMidX(options18 = {}) {
  return maybeIntervalMidK("x", maybeInsetX, options18);
}
function maybeIntervalMidY(options18 = {}) {
  return maybeIntervalMidK("y", maybeInsetY, options18);
}

// node_modules/@observablehq/plot/src/marks/rule.js
function ruleX(data2, options19) {
  let { x: x2 = identity13, y: y2, y1: y12, y2: y22, ...rest } = maybeIntervalY(options19);
  [y12, y22] = maybeOptionalZero(y2, y12, y22);
  return new RuleX(data2, { ...rest, x: x2, y1: y12, y2: y22 });
}
function ruleY(data2, options19) {
  let { y: y2 = identity13, x: x2, x1: x12, x2: x22, ...rest } = maybeIntervalX(options19);
  [x12, x22] = maybeOptionalZero(x2, x12, x22);
  return new RuleY(data2, { ...rest, y: y2, x1: x12, x2: x22 });
}
var maybeOptionalZero = function(x2, x12, x22) {
  if (x2 == null) {
    if (x12 === undefined) {
      if (x22 !== undefined)
        return [0, x22];
    } else {
      if (x22 === undefined)
        return [0, x12];
    }
  } else if (x12 === undefined) {
    return x22 === undefined ? [0, x2] : [x2, x22];
  } else if (x22 === undefined) {
    return [x2, x12];
  }
  return [x12, x22];
};
var defaults = {
  ariaLabel: "rule",
  fill: null,
  stroke: "currentColor"
};

class RuleX extends Mark {
  constructor(data2, options19 = {}) {
    const { x: x2, y1: y12, y2, inset: inset2 = 0, insetTop = inset2, insetBottom = inset2 } = options19;
    super(data2, {
      x: { value: x2, scale: "x", optional: true },
      y1: { value: y12, scale: "y", optional: true },
      y2: { value: y2, scale: "y", optional: true }
    }, withTip(options19, "x"), defaults);
    this.insetTop = number12(insetTop);
    this.insetBottom = number12(insetBottom);
    markers(this, options19);
  }
  render(index2, scales7, channels, dimensions, context6) {
    const { x: x2, y: y2 } = scales7;
    const { x: X3, y1: Y12, y2: Y22 } = channels;
    const { width, height, marginTop, marginRight, marginLeft, marginBottom } = dimensions;
    const { insetTop, insetBottom } = this;
    return create2("svg:g", context6).call(applyIndirectStyles, this, dimensions, context6).call(applyTransform, this, { x: X3 && x2 }, offset, 0).call((g) => g.selectAll().data(index2).enter().append("line").call(applyDirectStyles, this).attr("x1", X3 ? (i) => X3[i] : (marginLeft + width - marginRight) / 2).attr("x2", X3 ? (i) => X3[i] : (marginLeft + width - marginRight) / 2).attr("y1", Y12 && !isCollapsed(y2) ? (i) => Y12[i] + insetTop : marginTop + insetTop).attr("y2", Y22 && !isCollapsed(y2) ? y2.bandwidth ? (i) => Y22[i] + y2.bandwidth() - insetBottom : (i) => Y22[i] - insetBottom : height - marginBottom - insetBottom).call(applyChannelStyles, this, channels).call(applyMarkers, this, channels, context6)).node();
  }
}

class RuleY extends Mark {
  constructor(data2, options19 = {}) {
    const { x1: x12, x2, y: y2, inset: inset2 = 0, insetRight = inset2, insetLeft = inset2 } = options19;
    super(data2, {
      y: { value: y2, scale: "y", optional: true },
      x1: { value: x12, scale: "x", optional: true },
      x2: { value: x2, scale: "x", optional: true }
    }, withTip(options19, "y"), defaults);
    this.insetRight = number12(insetRight);
    this.insetLeft = number12(insetLeft);
    markers(this, options19);
  }
  render(index2, scales7, channels, dimensions, context6) {
    const { x: x2, y: y2 } = scales7;
    const { y: Y3, x1: X12, x2: X22 } = channels;
    const { width, height, marginTop, marginRight, marginLeft, marginBottom } = dimensions;
    const { insetLeft, insetRight } = this;
    return create2("svg:g", context6).call(applyIndirectStyles, this, dimensions, context6).call(applyTransform, this, { y: Y3 && y2 }, 0, offset).call((g) => g.selectAll().data(index2).enter().append("line").call(applyDirectStyles, this).attr("x1", X12 && !isCollapsed(x2) ? (i) => X12[i] + insetLeft : marginLeft + insetLeft).attr("x2", X22 && !isCollapsed(x2) ? x2.bandwidth ? (i) => X22[i] + x2.bandwidth() - insetRight : (i) => X22[i] - insetRight : width - marginRight - insetRight).attr("y1", Y3 ? (i) => Y3[i] : (marginTop + height - marginBottom) / 2).attr("y2", Y3 ? (i) => Y3[i] : (marginTop + height - marginBottom) / 2).call(applyChannelStyles, this, channels).call(applyMarkers, this, channels, context6)).node();
  }
}

// node_modules/@observablehq/plot/src/template.js
function template(strings, ...parts) {
  let n = parts.length;
  for (let j = 0, copy3 = true;j < n; ++j) {
    if (typeof parts[j] !== "function") {
      if (copy3) {
        strings = strings.slice();
        copy3 = false;
      }
      strings.splice(j, 2, strings[j] + parts[j] + strings[j + 1]);
      parts.splice(j, 1);
      --j, --n;
    }
  }
  return (i) => {
    let s2 = strings[0];
    for (let j = 0;j < n; ++j) {
      s2 += parts[j](i) + strings[j + 1];
    }
    return s2;
  };
}

// node_modules/@observablehq/plot/src/marks/text.js
function maybeTextOverflow(textOverflow) {
  return textOverflow == null ? null : keyword(textOverflow, "textOverflow", [
    "clip",
    "ellipsis",
    "clip-start",
    "clip-end",
    "ellipsis-start",
    "ellipsis-middle",
    "ellipsis-end"
  ]).replace(/^(clip|ellipsis)$/, "$1-end");
}
var applyMultilineText = function(selection5, mark4, T, TL) {
  if (!T)
    return;
  const { lineAnchor, lineHeight, textOverflow, splitLines, clipLine } = mark4;
  selection5.each(function(i) {
    const lines = splitLines(formatDefault(T[i]) ?? "").map(clipLine);
    const n = lines.length;
    const y2 = lineAnchor === "top" ? 0.71 : lineAnchor === "bottom" ? 1 - n : (164 - n * 100) / 200;
    if (n > 1) {
      let m = 0;
      for (let i2 = 0;i2 < n; ++i2) {
        ++m;
        if (!lines[i2])
          continue;
        const tspan = this.ownerDocument.createElementNS(namespaces_default.svg, "tspan");
        tspan.setAttribute("x", 0);
        if (i2 === m - 1)
          tspan.setAttribute("y", `${(y2 + i2) * lineHeight}em`);
        else
          tspan.setAttribute("dy", `${m * lineHeight}em`);
        tspan.textContent = lines[i2];
        this.appendChild(tspan);
        m = 0;
      }
    } else {
      if (y2)
        this.setAttribute("y", `${y2 * lineHeight}em`);
      this.textContent = lines[0];
    }
    if (textOverflow && !TL && lines[0] !== T[i]) {
      const title = this.ownerDocument.createElementNS(namespaces_default.svg, "title");
      title.textContent = T[i];
      this.appendChild(title);
    }
  });
};
function text3(data2, { x: x2, y: y2, ...options20 } = {}) {
  if (options20.frameAnchor === undefined)
    [x2, y2] = maybeTuple(x2, y2);
  return new Text(data2, { ...options20, x: x2, y: y2 });
}
function textX(data2, { x: x2 = identity13, ...options20 } = {}) {
  return new Text(data2, maybeIntervalMidY({ ...options20, x: x2 }));
}
function textY(data2, { y: y2 = identity13, ...options20 } = {}) {
  return new Text(data2, maybeIntervalMidX({ ...options20, y: y2 }));
}
function applyIndirectTextStyles(selection5, mark4, T) {
  applyAttr(selection5, "text-anchor", mark4.textAnchor);
  applyAttr(selection5, "font-family", mark4.fontFamily);
  applyAttr(selection5, "font-size", mark4.fontSize);
  applyAttr(selection5, "font-style", mark4.fontStyle);
  applyAttr(selection5, "font-variant", mark4.fontVariant === undefined ? inferFontVariant2(T) : mark4.fontVariant);
  applyAttr(selection5, "font-weight", mark4.fontWeight);
}
var inferFontVariant2 = function(T) {
  return T && (isNumeric(T) || isTemporal(T)) ? "tabular-nums" : undefined;
};
var maybeFontSizeChannel = function(fontSize) {
  if (fontSize == null || typeof fontSize === "number")
    return [undefined, fontSize];
  if (typeof fontSize !== "string")
    return [fontSize, undefined];
  fontSize = fontSize.trim().toLowerCase();
  return fontSizes.has(fontSize) || /^[+-]?\d*\.?\d+(e[+-]?\d+)?(\w*|%)$/.test(fontSize) ? [undefined, fontSize] : [fontSize, undefined];
};
var lineWrap = function(input, maxWidth, widthof) {
  const lines = [];
  let lineStart, lineEnd = 0;
  for (const [wordStart, wordEnd, required] of lineBreaks(input)) {
    if (lineStart === undefined)
      lineStart = wordStart;
    if (lineEnd > lineStart && widthof(input, lineStart, wordEnd) > maxWidth) {
      lines.push(input.slice(lineStart, lineEnd) + (input[lineEnd - 1] === softHyphen ? "-" : ""));
      lineStart = wordStart;
    }
    if (required) {
      lines.push(input.slice(lineStart, wordEnd));
      lineStart = undefined;
      continue;
    }
    lineEnd = wordEnd;
  }
  return lines;
};
function* lineBreaks(input) {
  let i = 0, j = 0;
  const n = input.length;
  while (j < n) {
    let k2 = 1;
    switch (input[j]) {
      case softHyphen:
      case "-":
        ++j;
        yield [i, j, false];
        i = j;
        break;
      case " ":
        yield [i, j, false];
        while (input[++j] === " ")
          ;
        i = j;
        break;
      case "\r":
        if (input[j + 1] === "\n")
          ++k2;
      case "\n":
        yield [i, j, true];
        j += k2;
        i = j;
        break;
      default:
        ++j;
        break;
    }
  }
  yield [i, j, true];
}
function defaultWidth(text4, start2 = 0, end2 = text4.length) {
  let sum4 = 0;
  for (let i = start2;i < end2; i = readCharacter(text4, i)) {
    sum4 += defaultWidthMap[text4[i]] ?? (isPictographic(text4, i) ? 120 : defaultWidthMap.e);
  }
  return sum4;
}
function monospaceWidth(text4, start2 = 0, end2 = text4.length) {
  let sum4 = 0;
  for (let i = start2;i < end2; i = readCharacter(text4, i)) {
    sum4 += isPictographic(text4, i) ? 200 : 100;
  }
  return sum4;
}
function splitter({ monospace, lineWidth, textOverflow }) {
  if (textOverflow != null || lineWidth == Infinity)
    return (text4) => text4.split(/\r\n?|\n/g);
  const widthof = monospace ? monospaceWidth : defaultWidth;
  const maxWidth = lineWidth * 100;
  return (text4) => lineWrap(text4, maxWidth, widthof);
}
function clipper({ monospace, lineWidth, textOverflow }) {
  if (textOverflow == null || lineWidth == Infinity)
    return (text4) => text4;
  const widthof = monospace ? monospaceWidth : defaultWidth;
  const maxWidth = lineWidth * 100;
  switch (textOverflow) {
    case "clip-start":
      return (text4) => clipStart(text4, maxWidth, widthof, "");
    case "clip-end":
      return (text4) => clipEnd(text4, maxWidth, widthof, "");
    case "ellipsis-start":
      return (text4) => clipStart(text4, maxWidth, widthof, ellipsis);
    case "ellipsis-middle":
      return (text4) => clipMiddle(text4, maxWidth, widthof, ellipsis);
    case "ellipsis-end":
      return (text4) => clipEnd(text4, maxWidth, widthof, ellipsis);
  }
}
function cut(text4, width, widthof, inset2) {
  const I = [];
  let w = 0;
  for (let i = 0, j = 0, n = text4.length;i < n; i = j) {
    j = readCharacter(text4, i);
    const l = widthof(text4, i, j);
    if (w + l > width) {
      w += inset2;
      while (w > width && i > 0)
        j = i, i = I.pop(), w -= widthof(text4, i, j);
      return [i, width - w];
    }
    w += l;
    I.push(i);
  }
  return [-1, 0];
}
function clipEnd(text4, width, widthof, ellipsis) {
  text4 = text4.trim();
  const e3 = widthof(ellipsis);
  const [i] = cut(text4, width, widthof, e3);
  return i < 0 ? text4 : text4.slice(0, i).trimEnd() + ellipsis;
}
function clipMiddle(text4, width, widthof, ellipsis) {
  text4 = text4.trim();
  const w = widthof(text4);
  if (w <= width)
    return text4;
  const e3 = widthof(ellipsis) / 2;
  const [i, ei] = cut(text4, width / 2, widthof, e3);
  const [j] = cut(text4, w - width / 2 - ei + e3, widthof, -e3);
  return j < 0 ? ellipsis : text4.slice(0, i).trimEnd() + ellipsis + text4.slice(readCharacter(text4, j)).trimStart();
}
function clipStart(text4, width, widthof, ellipsis) {
  text4 = text4.trim();
  const w = widthof(text4);
  if (w <= width)
    return text4;
  const e3 = widthof(ellipsis);
  const [j] = cut(text4, w - width + e3, widthof, -e3);
  return j < 0 ? ellipsis : ellipsis + text4.slice(readCharacter(text4, j)).trimStart();
}
function readCharacter(text4, i) {
  i += isSurrogatePair(text4, i) ? 2 : 1;
  if (isCombiner(text4, i))
    i = reCombiner.lastIndex;
  if (isZeroWidthJoiner(text4, i))
    return readCharacter(text4, i + 1);
  return i;
}
var isAscii = function(text4, i) {
  return text4.charCodeAt(i) < 128;
};
var isSurrogatePair = function(text4, i) {
  const hi = text4.charCodeAt(i);
  if (hi >= 55296 && hi < 56320) {
    const lo = text4.charCodeAt(i + 1);
    return lo >= 56320 && lo < 57344;
  }
  return false;
};
var isZeroWidthJoiner = function(text4, i) {
  return text4.charCodeAt(i) === 8205;
};
var isCombiner = function(text4, i) {
  return isAscii(text4, i) ? false : (reCombiner.lastIndex = i, reCombiner.test(text4));
};
var isPictographic = function(text4, i) {
  return isAscii(text4, i) ? false : (rePictographic.lastIndex = i, rePictographic.test(text4));
};
var defaults2 = {
  ariaLabel: "text",
  strokeLinejoin: "round",
  strokeWidth: 3,
  paintOrder: "stroke"
};
var softHyphen = "\xAD";

class Text extends Mark {
  constructor(data2, options20 = {}) {
    const {
      x: x2,
      y: y2,
      text: text4 = isIterable(data2) && isTextual(data2) ? identity13 : indexOf,
      frameAnchor,
      textAnchor = /right$/i.test(frameAnchor) ? "end" : /left$/i.test(frameAnchor) ? "start" : "middle",
      lineAnchor = /^top/i.test(frameAnchor) ? "top" : /^bottom/i.test(frameAnchor) ? "bottom" : "middle",
      lineHeight = 1,
      lineWidth = Infinity,
      textOverflow,
      monospace,
      fontFamily = monospace ? "ui-monospace, monospace" : undefined,
      fontSize,
      fontStyle,
      fontVariant,
      fontWeight,
      rotate
    } = options20;
    const [vrotate, crotate] = maybeNumberChannel(rotate, 0);
    const [vfontSize, cfontSize] = maybeFontSizeChannel(fontSize);
    super(data2, {
      x: { value: x2, scale: "x", optional: true },
      y: { value: y2, scale: "y", optional: true },
      fontSize: { value: vfontSize, optional: true },
      rotate: { value: numberChannel(vrotate), optional: true },
      text: { value: text4, filter: nonempty, optional: true }
    }, options20, defaults2);
    this.rotate = crotate;
    this.textAnchor = impliedString(textAnchor, "middle");
    this.lineAnchor = keyword(lineAnchor, "lineAnchor", ["top", "middle", "bottom"]);
    this.lineHeight = +lineHeight;
    this.lineWidth = +lineWidth;
    this.textOverflow = maybeTextOverflow(textOverflow);
    this.monospace = !!monospace;
    this.fontFamily = string3(fontFamily);
    this.fontSize = cfontSize;
    this.fontStyle = string3(fontStyle);
    this.fontVariant = string3(fontVariant);
    this.fontWeight = string3(fontWeight);
    this.frameAnchor = maybeFrameAnchor(frameAnchor);
    if (!(this.lineWidth >= 0))
      throw new Error(`invalid lineWidth: ${lineWidth}`);
    this.splitLines = splitter(this);
    this.clipLine = clipper(this);
  }
  render(index2, scales7, channels, dimensions, context7) {
    const { x: x2, y: y2 } = scales7;
    const { x: X3, y: Y3, rotate: R, text: T, title: TL, fontSize: FS } = channels;
    const { rotate } = this;
    const [cx, cy] = applyFrameAnchor(this, dimensions);
    return create2("svg:g", context7).call(applyIndirectStyles, this, dimensions, context7).call(applyIndirectTextStyles, this, T, dimensions).call(applyTransform, this, { x: X3 && x2, y: Y3 && y2 }).call((g) => g.selectAll().data(index2).enter().append("text").call(applyDirectStyles, this).call(applyMultilineText, this, T, TL).attr("transform", template`translate(${X3 ? (i) => X3[i] : cx},${Y3 ? (i) => Y3[i] : cy})${R ? (i) => ` rotate(${R[i]})` : rotate ? ` rotate(${rotate})` : ``}`).call(applyAttr, "font-size", FS && ((i) => FS[i])).call(applyChannelStyles, this, channels)).node();
  }
}
var fontSizes = new Set([
  "inherit",
  "initial",
  "revert",
  "unset",
  "xx-small",
  "x-small",
  "small",
  "medium",
  "large",
  "x-large",
  "xx-large",
  "xxx-large",
  "larger",
  "smaller"
]);
var defaultWidthMap = {
  a: 56,
  b: 63,
  c: 57,
  d: 63,
  e: 58,
  f: 37,
  g: 62,
  h: 60,
  i: 26,
  j: 26,
  k: 55,
  l: 26,
  m: 88,
  n: 60,
  o: 60,
  p: 62,
  q: 62,
  r: 39,
  s: 54,
  t: 38,
  u: 60,
  v: 55,
  w: 79,
  x: 54,
  y: 55,
  z: 55,
  A: 69,
  B: 67,
  C: 73,
  D: 74,
  E: 61,
  F: 58,
  G: 76,
  H: 75,
  I: 28,
  J: 55,
  K: 67,
  L: 58,
  M: 89,
  N: 75,
  O: 78,
  P: 65,
  Q: 78,
  R: 67,
  S: 65,
  T: 65,
  U: 75,
  V: 69,
  W: 98,
  X: 69,
  Y: 67,
  Z: 67,
  0: 64,
  1: 48,
  2: 62,
  3: 64,
  4: 66,
  5: 63,
  6: 65,
  7: 58,
  8: 65,
  9: 65,
  " ": 29,
  "!": 32,
  '"': 49,
  "'": 31,
  "(": 39,
  ")": 39,
  ",": 31,
  "-": 48,
  ".": 31,
  "/": 32,
  ":": 31,
  ";": 31,
  "?": 52,
  "\u2018": 31,
  "\u2019": 31,
  "\u201C": 47,
  "\u201D": 47,
  "\u2026": 82
};
var ellipsis = "\u2026";
var reCombiner = /[\p{Combining_Mark}\p{Emoji_Modifier}]+/uy;
var rePictographic = /\p{Extended_Pictographic}/uy;

// node_modules/@observablehq/plot/src/marks/vector.js
var isShapeObject = function(value5) {
  return value5 && typeof value5.draw === "function";
};
var maybeShape = function(shape) {
  if (isShapeObject(shape))
    return shape;
  const value5 = shapes.get(`${shape}`.toLowerCase());
  if (value5)
    return value5;
  throw new Error(`invalid shape: ${shape}`);
};
function vectorX(data2, options21 = {}) {
  const { x: x2 = identity13, ...rest } = options21;
  return new Vector(data2, { ...rest, x: x2 });
}
function vectorY(data2, options21 = {}) {
  const { y: y2 = identity13, ...rest } = options21;
  return new Vector(data2, { ...rest, y: y2 });
}
var defaults3 = {
  ariaLabel: "vector",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinejoin: "round",
  strokeLinecap: "round"
};
var defaultRadius = 3.5;
var wingRatio = defaultRadius * 5;
var shapeArrow = {
  draw(context8, l, r) {
    const wing = l * r / wingRatio;
    context8.moveTo(0, 0);
    context8.lineTo(0, -l);
    context8.moveTo(-wing, wing - l);
    context8.lineTo(0, -l);
    context8.lineTo(wing, wing - l);
  }
};
var shapeSpike = {
  draw(context8, l, r) {
    context8.moveTo(-r, 0);
    context8.lineTo(0, -l);
    context8.lineTo(r, 0);
  }
};
var shapes = new Map([
  ["arrow", shapeArrow],
  ["spike", shapeSpike]
]);

class Vector extends Mark {
  constructor(data2, options21 = {}) {
    const { x: x2, y: y2, r = defaultRadius, length: length3, rotate, shape = shapeArrow, anchor = "middle", frameAnchor } = options21;
    const [vl, cl] = maybeNumberChannel(length3, 12);
    const [vr, cr] = maybeNumberChannel(rotate, 0);
    super(data2, {
      x: { value: x2, scale: "x", optional: true },
      y: { value: y2, scale: "y", optional: true },
      length: { value: vl, scale: "length", optional: true },
      rotate: { value: vr, optional: true }
    }, options21, defaults3);
    this.r = +r;
    this.length = cl;
    this.rotate = cr;
    this.shape = maybeShape(shape);
    this.anchor = keyword(anchor, "anchor", ["start", "middle", "end"]);
    this.frameAnchor = maybeFrameAnchor(frameAnchor);
  }
  render(index2, scales7, channels, dimensions, context8) {
    const { x: x2, y: y2 } = scales7;
    const { x: X3, y: Y3, length: L, rotate: A5 } = channels;
    const { length: length3, rotate, anchor, shape, r } = this;
    const [cx, cy] = applyFrameAnchor(this, dimensions);
    return create2("svg:g", context8).call(applyIndirectStyles, this, dimensions, context8).call(applyTransform, this, { x: X3 && x2, y: Y3 && y2 }).call((g) => g.selectAll().data(index2).enter().append("path").call(applyDirectStyles, this).attr("transform", template`translate(${X3 ? (i) => X3[i] : cx},${Y3 ? (i) => Y3[i] : cy})${A5 ? (i) => ` rotate(${A5[i]})` : rotate ? ` rotate(${rotate})` : ``}${anchor === "start" ? `` : anchor === "end" ? L ? (i) => ` translate(0,${L[i]})` : ` translate(0,${length3})` : L ? (i) => ` translate(0,${L[i] / 2})` : ` translate(0,${length3 / 2})`}`).attr("d", L ? (i) => {
      const p = pathRound();
      shape.draw(p, L[i], r);
      return p;
    } : (() => {
      const p = pathRound();
      shape.draw(p, length3, r);
      return p;
    })()).call(applyChannelStyles, this, channels)).node();
  }
}

// node_modules/@observablehq/plot/src/marks/axis.js
var maybeData = function(data2, options24) {
  if (arguments.length < 2 && !isIterable(data2))
    options24 = data2, data2 = null;
  if (options24 === undefined)
    options24 = {};
  return [data2, options24];
};
var maybeAnchor2 = function({ anchor } = {}, anchors) {
  return anchor === undefined ? anchors[0] : keyword(anchor, "anchor", anchors);
};
var anchorY2 = function(options24) {
  return maybeAnchor2(options24, ["left", "right"]);
};
var anchorFy = function(options24) {
  return maybeAnchor2(options24, ["right", "left"]);
};
var anchorX2 = function(options24) {
  return maybeAnchor2(options24, ["bottom", "top"]);
};
var anchorFx = function(options24) {
  return maybeAnchor2(options24, ["top", "bottom"]);
};
function axisY() {
  const [data2, options24] = maybeData(...arguments);
  return axisKy("y", anchorY2(options24), data2, options24);
}
function axisFy() {
  const [data2, options24] = maybeData(...arguments);
  return axisKy("fy", anchorFy(options24), data2, options24);
}
function axisX() {
  const [data2, options24] = maybeData(...arguments);
  return axisKx("x", anchorX2(options24), data2, options24);
}
function axisFx() {
  const [data2, options24] = maybeData(...arguments);
  return axisKx("fx", anchorFx(options24), data2, options24);
}
var axisKy = function(k2, anchor, data2, {
  color: color10 = "currentColor",
  opacity: opacity2 = 1,
  stroke = color10,
  strokeOpacity = opacity2,
  strokeWidth = 1,
  fill = color10,
  fillOpacity = opacity2,
  textAnchor,
  textStroke,
  textStrokeOpacity,
  textStrokeWidth,
  tickSize = k2 === "y" ? 6 : 0,
  tickPadding,
  tickRotate,
  x: x2,
  margin,
  marginTop = margin === undefined ? 20 : margin,
  marginRight = margin === undefined ? anchor === "right" ? 40 : 0 : margin,
  marginBottom = margin === undefined ? 20 : margin,
  marginLeft = margin === undefined ? anchor === "left" ? 40 : 0 : margin,
  label,
  labelAnchor,
  labelArrow,
  labelOffset,
  ...options24
}) {
  tickSize = number12(tickSize);
  tickPadding = number12(tickPadding);
  tickRotate = number12(tickRotate);
  if (labelAnchor !== undefined)
    labelAnchor = keyword(labelAnchor, "labelAnchor", ["center", "top", "bottom"]);
  labelArrow = maybeLabelArrow(labelArrow);
  return marks(tickSize && !isNoneish(stroke) ? axisTickKy(k2, anchor, data2, {
    stroke,
    strokeOpacity,
    strokeWidth,
    tickSize,
    tickPadding,
    tickRotate,
    x: x2,
    ...options24
  }) : null, !isNoneish(fill) ? axisTextKy(k2, anchor, data2, {
    fill,
    fillOpacity,
    stroke: textStroke,
    strokeOpacity: textStrokeOpacity,
    strokeWidth: textStrokeWidth,
    textAnchor,
    tickSize,
    tickPadding,
    tickRotate,
    x: x2,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    ...options24
  }) : null, !isNoneish(fill) && label !== null ? text3([], labelOptions({ fill, fillOpacity, ...options24 }, function(data3, facets, channels, scales8, dimensions) {
    const scale = scales8[k2];
    const { marginTop: marginTop2, marginRight: marginRight2, marginBottom: marginBottom2, marginLeft: marginLeft2 } = k2 === "y" && dimensions.inset || dimensions;
    const cla = labelAnchor ?? (scale.bandwidth ? "center" : "top");
    const clo = labelOffset ?? (anchor === "right" ? marginRight2 : marginLeft2) - 3;
    if (cla === "center") {
      this.textAnchor = undefined;
      this.lineAnchor = anchor === "right" ? "bottom" : "top";
      this.frameAnchor = anchor;
      this.rotate = -90;
    } else {
      this.textAnchor = anchor === "right" ? "end" : "start";
      this.lineAnchor = cla;
      this.frameAnchor = `${cla}-${anchor}`;
      this.rotate = 0;
    }
    this.dy = cla === "top" ? 3 - marginTop2 : cla === "bottom" ? marginBottom2 - 3 : 0;
    this.dx = anchor === "right" ? clo : -clo;
    this.ariaLabel = `${k2}-axis label`;
    return {
      facets: [[0]],
      channels: { text: { value: [formatAxisLabel(k2, scale, { anchor, label, labelAnchor: cla, labelArrow })] } }
    };
  })) : null);
};
var axisKx = function(k2, anchor, data2, {
  color: color10 = "currentColor",
  opacity: opacity2 = 1,
  stroke = color10,
  strokeOpacity = opacity2,
  strokeWidth = 1,
  fill = color10,
  fillOpacity = opacity2,
  textAnchor,
  textStroke,
  textStrokeOpacity,
  textStrokeWidth,
  tickSize = k2 === "x" ? 6 : 0,
  tickPadding,
  tickRotate,
  y: y2,
  margin,
  marginTop = margin === undefined ? anchor === "top" ? 30 : 0 : margin,
  marginRight = margin === undefined ? 20 : margin,
  marginBottom = margin === undefined ? anchor === "bottom" ? 30 : 0 : margin,
  marginLeft = margin === undefined ? 20 : margin,
  label,
  labelAnchor,
  labelArrow,
  labelOffset,
  ...options24
}) {
  tickSize = number12(tickSize);
  tickPadding = number12(tickPadding);
  tickRotate = number12(tickRotate);
  if (labelAnchor !== undefined)
    labelAnchor = keyword(labelAnchor, "labelAnchor", ["center", "left", "right"]);
  labelArrow = maybeLabelArrow(labelArrow);
  return marks(tickSize && !isNoneish(stroke) ? axisTickKx(k2, anchor, data2, {
    stroke,
    strokeOpacity,
    strokeWidth,
    tickSize,
    tickPadding,
    tickRotate,
    y: y2,
    ...options24
  }) : null, !isNoneish(fill) ? axisTextKx(k2, anchor, data2, {
    fill,
    fillOpacity,
    stroke: textStroke,
    strokeOpacity: textStrokeOpacity,
    strokeWidth: textStrokeWidth,
    textAnchor,
    tickSize,
    tickPadding,
    tickRotate,
    y: y2,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    ...options24
  }) : null, !isNoneish(fill) && label !== null ? text3([], labelOptions({ fill, fillOpacity, ...options24 }, function(data3, facets, channels, scales8, dimensions) {
    const scale = scales8[k2];
    const { marginTop: marginTop2, marginRight: marginRight2, marginBottom: marginBottom2, marginLeft: marginLeft2 } = k2 === "x" && dimensions.inset || dimensions;
    const cla = labelAnchor ?? (scale.bandwidth ? "center" : "right");
    const clo = labelOffset ?? (anchor === "top" ? marginTop2 : marginBottom2) - 3;
    if (cla === "center") {
      this.frameAnchor = anchor;
      this.textAnchor = undefined;
    } else {
      this.frameAnchor = `${anchor}-${cla}`;
      this.textAnchor = cla === "right" ? "end" : "start";
    }
    this.lineAnchor = anchor;
    this.dy = anchor === "top" ? -clo : clo;
    this.dx = cla === "right" ? marginRight2 - 3 : cla === "left" ? 3 - marginLeft2 : 0;
    this.ariaLabel = `${k2}-axis label`;
    return {
      facets: [[0]],
      channels: { text: { value: [formatAxisLabel(k2, scale, { anchor, label, labelAnchor: cla, labelArrow })] } }
    };
  })) : null);
};
var axisTickKy = function(k2, anchor, data2, {
  strokeWidth = 1,
  strokeLinecap = null,
  strokeLinejoin = null,
  facetAnchor = anchor + (k2 === "y" ? "-empty" : ""),
  frameAnchor = anchor,
  tickSize,
  inset: inset2 = 0,
  insetLeft = inset2,
  insetRight = inset2,
  dx = 0,
  y: y2 = k2 === "y" ? undefined : null,
  ...options24
}) {
  return axisMark(vectorY, k2, `${k2}-axis tick`, data2, {
    strokeWidth,
    strokeLinecap,
    strokeLinejoin,
    facetAnchor,
    frameAnchor,
    y: y2,
    ...options24,
    dx: anchor === "left" ? +dx - offset + +insetLeft : +dx + offset - insetRight,
    anchor: "start",
    length: tickSize,
    shape: anchor === "left" ? shapeTickLeft : shapeTickRight
  });
};
var axisTickKx = function(k2, anchor, data2, {
  strokeWidth = 1,
  strokeLinecap = null,
  strokeLinejoin = null,
  facetAnchor = anchor + (k2 === "x" ? "-empty" : ""),
  frameAnchor = anchor,
  tickSize,
  inset: inset2 = 0,
  insetTop = inset2,
  insetBottom = inset2,
  dy = 0,
  x: x2 = k2 === "x" ? undefined : null,
  ...options24
}) {
  return axisMark(vectorX, k2, `${k2}-axis tick`, data2, {
    strokeWidth,
    strokeLinejoin,
    strokeLinecap,
    facetAnchor,
    frameAnchor,
    x: x2,
    ...options24,
    dy: anchor === "bottom" ? +dy - offset - insetBottom : +dy + offset + +insetTop,
    anchor: "start",
    length: tickSize,
    shape: anchor === "bottom" ? shapeTickBottom : shapeTickTop
  });
};
var axisTextKy = function(k2, anchor, data2, {
  facetAnchor = anchor + (k2 === "y" ? "-empty" : ""),
  frameAnchor = anchor,
  tickSize,
  tickRotate = 0,
  tickPadding = Math.max(3, 9 - tickSize) + (Math.abs(tickRotate) > 60 ? 4 * Math.cos(tickRotate * radians3) : 0),
  tickFormat: tickFormat3,
  text: text5 = typeof tickFormat3 === "function" ? tickFormat3 : undefined,
  textAnchor = Math.abs(tickRotate) > 60 ? "middle" : anchor === "left" ? "end" : "start",
  lineAnchor = tickRotate > 60 ? "top" : tickRotate < -60 ? "bottom" : "middle",
  fontVariant,
  inset: inset2 = 0,
  insetLeft = inset2,
  insetRight = inset2,
  dx = 0,
  y: y2 = k2 === "y" ? undefined : null,
  ...options24
}) {
  return axisMark(textY, k2, `${k2}-axis tick label`, data2, {
    facetAnchor,
    frameAnchor,
    text: text5 === undefined ? null : text5,
    textAnchor,
    lineAnchor,
    fontVariant,
    rotate: tickRotate,
    y: y2,
    ...options24,
    dx: anchor === "left" ? +dx - tickSize - tickPadding + +insetLeft : +dx + +tickSize + +tickPadding - insetRight
  }, function(scale, data3, ticks2, channels) {
    if (fontVariant === undefined)
      this.fontVariant = inferFontVariant3(scale);
    if (text5 === undefined)
      channels.text = inferTextChannel(scale, data3, ticks2, tickFormat3, anchor);
  });
};
var axisTextKx = function(k2, anchor, data2, {
  facetAnchor = anchor + (k2 === "x" ? "-empty" : ""),
  frameAnchor = anchor,
  tickSize,
  tickRotate = 0,
  tickPadding = Math.max(3, 9 - tickSize) + (Math.abs(tickRotate) >= 10 ? 4 * Math.cos(tickRotate * radians3) : 0),
  tickFormat: tickFormat3,
  text: text5 = typeof tickFormat3 === "function" ? tickFormat3 : undefined,
  textAnchor = Math.abs(tickRotate) >= 10 ? tickRotate < 0 ^ anchor === "bottom" ? "start" : "end" : "middle",
  lineAnchor = Math.abs(tickRotate) >= 10 ? "middle" : anchor === "bottom" ? "top" : "bottom",
  fontVariant,
  inset: inset2 = 0,
  insetTop = inset2,
  insetBottom = inset2,
  dy = 0,
  x: x2 = k2 === "x" ? undefined : null,
  ...options24
}) {
  return axisMark(textX, k2, `${k2}-axis tick label`, data2, {
    facetAnchor,
    frameAnchor,
    text: text5 === undefined ? null : text5,
    textAnchor,
    lineAnchor,
    fontVariant,
    rotate: tickRotate,
    x: x2,
    ...options24,
    dy: anchor === "bottom" ? +dy + +tickSize + +tickPadding - insetBottom : +dy - tickSize - tickPadding + +insetTop
  }, function(scale, data3, ticks2, channels) {
    if (fontVariant === undefined)
      this.fontVariant = inferFontVariant3(scale);
    if (text5 === undefined)
      channels.text = inferTextChannel(scale, data3, ticks2, tickFormat3, anchor);
  });
};
function gridY() {
  const [data2, options24] = maybeData(...arguments);
  return gridKy("y", anchorY2(options24), data2, options24);
}
function gridFy() {
  const [data2, options24] = maybeData(...arguments);
  return gridKy("fy", anchorFy(options24), data2, options24);
}
function gridX() {
  const [data2, options24] = maybeData(...arguments);
  return gridKx("x", anchorX2(options24), data2, options24);
}
function gridFx() {
  const [data2, options24] = maybeData(...arguments);
  return gridKx("fx", anchorFx(options24), data2, options24);
}
var gridKy = function(k2, anchor, data2, {
  y: y2 = k2 === "y" ? undefined : null,
  x: x2 = null,
  x1: x12 = anchor === "left" ? x2 : null,
  x2: x22 = anchor === "right" ? x2 : null,
  ...options24
}) {
  return axisMark(ruleY, k2, `${k2}-grid`, data2, { y: y2, x1: x12, x2: x22, ...gridDefaults(options24) });
};
var gridKx = function(k2, anchor, data2, {
  x: x2 = k2 === "x" ? undefined : null,
  y: y2 = null,
  y1: y12 = anchor === "top" ? y2 : null,
  y2: y22 = anchor === "bottom" ? y2 : null,
  ...options24
}) {
  return axisMark(ruleX, k2, `${k2}-grid`, data2, { x: x2, y1: y12, y2: y22, ...gridDefaults(options24) });
};
var gridDefaults = function({
  color: color10 = "currentColor",
  opacity: opacity2 = 0.1,
  stroke = color10,
  strokeOpacity = opacity2,
  strokeWidth = 1,
  ...options24
}) {
  return { stroke, strokeOpacity, strokeWidth, ...options24 };
};
var labelOptions = function({
  fill,
  fillOpacity,
  fontFamily,
  fontSize,
  fontStyle,
  fontWeight,
  monospace,
  pointerEvents,
  shapeRendering,
  clip = false
}, initializer2) {
  [, fill] = maybeColorChannel(fill);
  [, fillOpacity] = maybeNumberChannel(fillOpacity);
  return {
    facet: "super",
    x: null,
    y: null,
    fill,
    fillOpacity,
    fontFamily,
    fontSize,
    fontStyle,
    fontWeight,
    monospace,
    pointerEvents,
    shapeRendering,
    clip,
    initializer: initializer2
  };
};
var axisMark = function(mark6, k2, ariaLabel, data2, options24, initialize) {
  let channels;
  function axisInitializer(data3, facets, _channels, scales8, dimensions, context8) {
    const initializeFacets = data3 == null && (k2 === "fx" || k2 === "fy");
    const { [k2]: scale } = scales8;
    if (!scale)
      throw new Error(`missing scale: ${k2}`);
    let { ticks: ticks2, tickSpacing, interval: interval12 } = options24;
    if (isTemporalScale(scale) && typeof ticks2 === "string")
      interval12 = ticks2, ticks2 = undefined;
    if (data3 == null) {
      if (isIterable(ticks2)) {
        data3 = arrayify2(ticks2);
      } else if (scale.ticks) {
        if (ticks2 !== undefined) {
          data3 = scale.ticks(ticks2);
        } else {
          interval12 = maybeRangeInterval(interval12 === undefined ? scale.interval : interval12, scale.type);
          if (interval12 !== undefined) {
            const [min4, max5] = extent(scale.domain());
            data3 = interval12.range(min4, interval12.offset(interval12.floor(max5)));
          } else {
            const [min4, max5] = extent(scale.range());
            ticks2 = (max5 - min4) / (tickSpacing === undefined ? k2 === "x" ? 80 : 35 : tickSpacing);
            data3 = scale.ticks(ticks2);
          }
        }
      } else {
        data3 = scale.domain();
      }
      if (k2 === "y" || k2 === "x") {
        facets = [range4(data3)];
      } else {
        channels[k2] = { scale: k2, value: identity13 };
      }
    }
    initialize?.call(this, scale, data3, ticks2, channels);
    const initializedChannels = Object.fromEntries(Object.entries(channels).map(([name, channel2]) => {
      return [name, { ...channel2, value: valueof(data3, channel2.value) }];
    }));
    if (initializeFacets)
      facets = context8.filterFacets(data3, initializedChannels);
    return { data: data3, facets, channels: initializedChannels };
  }
  const basicInitializer = initializer(options24).initializer;
  const m = mark6(data2, initializer({ ...options24, initializer: axisInitializer }, basicInitializer));
  if (data2 == null) {
    channels = m.channels;
    m.channels = {};
  } else {
    channels = {};
  }
  m.ariaLabel = ariaLabel;
  if (m.clip === undefined)
    m.clip = false;
  return m;
};
var inferTextChannel = function(scale, data2, ticks2, tickFormat3, anchor) {
  return { value: inferTickFormat(scale, data2, ticks2, tickFormat3, anchor) };
};
function inferTickFormat(scale, data2, ticks2, tickFormat3, anchor) {
  return tickFormat3 === undefined && isTemporalScale(scale) ? formatTimeTicks(scale, data2, ticks2, anchor) : scale.tickFormat ? scale.tickFormat(isIterable(ticks2) ? null : ticks2, tickFormat3) : tickFormat3 === undefined ? isUtcYear(scale.interval) ? utcFormat("%Y") : isTimeYear(scale.interval) ? timeFormat("%Y") : formatDefault : typeof tickFormat3 === "string" ? (isTemporal(scale.domain()) ? utcFormat : format)(tickFormat3) : constant8(tickFormat3);
}
var inferFontVariant3 = function(scale) {
  return scale.bandwidth && !scale.interval ? undefined : "tabular-nums";
};
var inferScaleOrder = function(scale) {
  return Math.sign(orderof(scale.domain())) * Math.sign(orderof(scale.range()));
};
var formatAxisLabel = function(k2, scale, { anchor, label = scale.label, labelAnchor, labelArrow } = {}) {
  if (label == null || label.inferred && isTemporalish(scale) && /^(date|time|year)$/i.test(label))
    return;
  label = String(label);
  if (labelArrow === "auto")
    labelArrow = (!scale.bandwidth || scale.interval) && !/[↑↓→←]/.test(label);
  if (!labelArrow)
    return label;
  if (labelArrow === true) {
    const order2 = inferScaleOrder(scale);
    if (order2)
      labelArrow = /x$/.test(k2) || labelAnchor === "center" ? /x$/.test(k2) === order2 < 0 ? "left" : "right" : order2 < 0 ? "up" : "down";
  }
  switch (labelArrow) {
    case "left":
      return `\u2190 ${label}`;
    case "right":
      return `${label} \u2192`;
    case "up":
      return anchor === "right" ? `${label} \u2191` : `\u2191 ${label}`;
    case "down":
      return anchor === "right" ? `${label} \u2193` : `\u2193 ${label}`;
  }
  return label;
};
var maybeLabelArrow = function(labelArrow = "auto") {
  return isNoneish(labelArrow) ? false : typeof labelArrow === "boolean" ? labelArrow : keyword(labelArrow, "labelArrow", ["auto", "up", "right", "down", "left"]);
};
var isTemporalish = function(scale) {
  return isTemporalScale(scale) || scale.interval != null;
};
var shapeTickBottom = {
  draw(context8, l) {
    context8.moveTo(0, 0);
    context8.lineTo(0, l);
  }
};
var shapeTickTop = {
  draw(context8, l) {
    context8.moveTo(0, 0);
    context8.lineTo(0, -l);
  }
};
var shapeTickLeft = {
  draw(context8, l) {
    context8.moveTo(0, 0);
    context8.lineTo(-l, 0);
  }
};
var shapeTickRight = {
  draw(context8, l) {
    context8.moveTo(0, 0);
    context8.lineTo(l, 0);
  }
};

// node_modules/@observablehq/plot/src/legends/swatches.js
var maybeScale = function(scale, key) {
  if (key == null)
    return key;
  const s2 = scale(key);
  if (!s2)
    throw new Error(`scale not found: ${key}`);
  return s2;
};
function legendSwatches(color10, { opacity: opacity2, ...options25 } = {}) {
  if (!isOrdinalScale(color10) && !isThresholdScale(color10))
    throw new Error(`swatches legend requires ordinal or threshold color scale (not ${color10.type})`);
  return legendItems(color10, options25, (selection5, scale, width, height) => selection5.append("svg").attr("width", width).attr("height", height).attr("fill", scale.scale).attr("fill-opacity", maybeNumberChannel(opacity2)[1]).append("rect").attr("width", "100%").attr("height", "100%"));
}
function legendSymbols(symbol5, {
  fill = symbol5.hint?.fill !== undefined ? symbol5.hint.fill : "none",
  fillOpacity = 1,
  stroke = symbol5.hint?.stroke !== undefined ? symbol5.hint.stroke : isNoneish(fill) ? "currentColor" : "none",
  strokeOpacity = 1,
  strokeWidth = 1.5,
  r = 4.5,
  ...options25
} = {}, scale) {
  const [vf, cf] = maybeColorChannel(fill);
  const [vs, cs] = maybeColorChannel(stroke);
  const sf = maybeScale(scale, vf);
  const ss = maybeScale(scale, vs);
  const size2 = r * r * Math.PI;
  fillOpacity = maybeNumberChannel(fillOpacity)[1];
  strokeOpacity = maybeNumberChannel(strokeOpacity)[1];
  strokeWidth = maybeNumberChannel(strokeWidth)[1];
  return legendItems(symbol5, options25, (selection5, scale2, width, height) => selection5.append("svg").attr("viewBox", "-8 -8 16 16").attr("width", width).attr("height", height).attr("fill", vf === "color" ? (d) => sf.scale(d) : cf).attr("fill-opacity", fillOpacity).attr("stroke", vs === "color" ? (d) => ss.scale(d) : cs).attr("stroke-opacity", strokeOpacity).attr("stroke-width", strokeWidth).append("path").attr("d", (d) => {
    const p = pathRound();
    symbol5.scale(d).draw(p, size2);
    return p;
  }));
}
var legendItems = function(scale, options25 = {}, swatch) {
  let {
    columns,
    tickFormat: tickFormat3,
    fontVariant = inferFontVariant(scale),
    swatchSize = 15,
    swatchWidth = swatchSize,
    swatchHeight = swatchSize,
    marginLeft = 0,
    className,
    style: style14,
    width
  } = options25;
  const context9 = createContext(options25);
  className = maybeClassName(className);
  if (typeof tickFormat3 !== "function")
    tickFormat3 = inferTickFormat(scale.scale, scale.domain, undefined, tickFormat3);
  const swatches = create2("div", context9).attr("class", `${className}-swatches ${className}-swatches-${columns != null ? "columns" : "wrap"}`);
  let extraStyle;
  if (columns != null) {
    extraStyle = `.${className}-swatches-columns .${className}-swatch {
  display: flex;
  align-items: center;
  break-inside: avoid;
  padding-bottom: 1px;
}
.${className}-swatches-columns .${className}-swatch::before {
  flex-shrink: 0;
}
.${className}-swatches-columns .${className}-swatch-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}`;
    swatches.style("columns", columns).selectAll().data(scale.domain).enter().append("div").attr("class", `${className}-swatch`).call(swatch, scale, swatchWidth, swatchHeight).call((item) => item.append("div").attr("class", `${className}-swatch-label`).attr("title", tickFormat3).text(tickFormat3));
  } else {
    extraStyle = `.${className}-swatches-wrap {
  display: flex;
  align-items: center;
  min-height: 33px;
  flex-wrap: wrap;
}
.${className}-swatches-wrap .${className}-swatch {
  display: inline-flex;
  align-items: center;
  margin-right: 1em;
}`;
    swatches.selectAll().data(scale.domain).enter().append("span").attr("class", `${className}-swatch`).call(swatch, scale, swatchWidth, swatchHeight).append(function() {
      return this.ownerDocument.createTextNode(tickFormat3.apply(this, arguments));
    });
  }
  return swatches.call((div) => div.insert("style", "*").text(`.${className}-swatches {
  font-family: system-ui, sans-serif;
  font-size: 10px;
  margin-bottom: 0.5em;
}
.${className}-swatch > svg {
  margin-right: 0.5em;
  overflow: visible;
}
${extraStyle}`)).style("margin-left", marginLeft ? `${+marginLeft}px` : null).style("width", width === undefined ? null : `${+width}px`).style("font-variant", impliedString(fontVariant, "normal")).call(applyInlineStyles, style14).node();
};

// node_modules/@observablehq/plot/src/legends.js
function exposeLegends(scales9, context9, defaults4 = {}) {
  return (key, options26) => {
    if (!legendRegistry.has(key))
      throw new Error(`unknown legend type: ${key}`);
    if (!(key in scales9))
      return;
    return legendRegistry.get(key)(scales9[key], legendOptions(context9, defaults4[key], options26), (key2) => scales9[key2]);
  };
}
var legendOptions = function({ className, ...context9 }, { label, ticks: ticks2, tickFormat: tickFormat3 } = {}, options26) {
  return inherit2(options26, { className, ...context9 }, { label, ticks: ticks2, tickFormat: tickFormat3 });
};
var legendColor = function(color10, { legend = true, ...options26 }) {
  if (legend === true)
    legend = color10.type === "ordinal" ? "swatches" : "ramp";
  if (color10.domain === undefined)
    return;
  switch (`${legend}`.toLowerCase()) {
    case "swatches":
      return legendSwatches(color10, options26);
    case "ramp":
      return legendRamp(color10, options26);
    default:
      throw new Error(`unknown legend type: ${legend}`);
  }
};
var legendOpacity = function({ type: type6, interpolate: interpolate3, ...scale }, { legend = true, color: color10 = rgb(0, 0, 0), ...options26 }) {
  if (!interpolate3)
    throw new Error(`${type6} opacity scales are not supported`);
  if (legend === true)
    legend = "ramp";
  if (`${legend}`.toLowerCase() !== "ramp")
    throw new Error(`${legend} opacity legends are not supported`);
  return legendColor({ type: type6, ...scale, interpolate: interpolateOpacity(color10) }, { legend, ...options26 });
};
var interpolateOpacity = function(color10) {
  const { r, g, b } = rgb(color10) || rgb(0, 0, 0);
  return (t) => `rgba(${r},${g},${b},${t})`;
};
function createLegends(scales9, context9, options26) {
  const legends = [];
  for (const [key, value5] of legendRegistry) {
    const o = options26[key];
    if (o?.legend && (key in scales9)) {
      const legend = value5(scales9[key], legendOptions(context9, scales9[key], o), (key2) => scales9[key2]);
      if (legend != null)
        legends.push(legend);
    }
  }
  return legends;
}
var legendRegistry = new Map([
  ["symbol", legendSymbols],
  ["color", legendColor],
  ["opacity", legendOpacity]
]);

// node_modules/@observablehq/plot/src/marks/frame.js
function frame2(options27) {
  return new Frame(options27);
}
var defaults4 = {
  ariaLabel: "frame",
  fill: "none",
  stroke: "currentColor",
  clip: false
};
var lineDefaults = {
  ariaLabel: "frame",
  fill: null,
  stroke: "currentColor",
  strokeLinecap: "square",
  clip: false
};

class Frame extends Mark {
  constructor(options27 = {}) {
    const {
      anchor = null,
      inset: inset2 = 0,
      insetTop = inset2,
      insetRight = inset2,
      insetBottom = inset2,
      insetLeft = inset2,
      rx,
      ry
    } = options27;
    super(singleton, undefined, options27, anchor == null ? defaults4 : lineDefaults);
    this.anchor = maybeKeyword(anchor, "anchor", ["top", "right", "bottom", "left"]);
    this.insetTop = number12(insetTop);
    this.insetRight = number12(insetRight);
    this.insetBottom = number12(insetBottom);
    this.insetLeft = number12(insetLeft);
    this.rx = number12(rx);
    this.ry = number12(ry);
  }
  render(index2, scales9, channels, dimensions, context10) {
    const { marginTop, marginRight, marginBottom, marginLeft, width, height } = dimensions;
    const { anchor, insetTop, insetRight, insetBottom, insetLeft, rx, ry } = this;
    const x12 = marginLeft + insetLeft;
    const x2 = width - marginRight - insetRight;
    const y12 = marginTop + insetTop;
    const y2 = height - marginBottom - insetBottom;
    return create2(anchor ? "svg:line" : "svg:rect", context10).datum(0).call(applyIndirectStyles, this, dimensions, context10).call(applyDirectStyles, this).call(applyChannelStyles, this, channels).call(applyTransform, this, {}).call(anchor === "left" ? (line2) => line2.attr("x1", x12).attr("x2", x12).attr("y1", y12).attr("y2", y2) : anchor === "right" ? (line2) => line2.attr("x1", x2).attr("x2", x2).attr("y1", y12).attr("y2", y2) : anchor === "top" ? (line2) => line2.attr("x1", x12).attr("x2", x2).attr("y1", y12).attr("y2", y12) : anchor === "bottom" ? (line2) => line2.attr("x1", x12).attr("x2", x2).attr("y1", y2).attr("y2", y2) : (rect) => rect.attr("x", x12).attr("y", y12).attr("width", x2 - x12).attr("height", y2 - y12).attr("rx", rx).attr("ry", ry)).node();
  }
}

// node_modules/@observablehq/plot/src/marks/tip.js
function tip(data2, { x: x2, y: y2, ...options29 } = {}) {
  if (options29.frameAnchor === undefined)
    [x2, y2] = maybeTuple(x2, y2);
  return new Tip(data2, { ...options29, x: x2, y: y2 });
}
var getLineOffset = function(anchor, length3, lineHeight) {
  return /^top(?:-|$)/.test(anchor) ? 0.94 - lineHeight : -0.29 - length3 * lineHeight;
};
var getTextTranslate = function(anchor, m, r, width, height) {
  switch (anchor) {
    case "middle":
      return [-width / 2, height / 2];
    case "top-left":
      return [r, m + r];
    case "top":
      return [-width / 2, m / 2 + r];
    case "top-right":
      return [-width - r, m + r];
    case "right":
      return [-m / 2 - width - r, height / 2];
    case "bottom-left":
      return [r, -m - r];
    case "bottom":
      return [-width / 2, -m / 2 - r];
    case "bottom-right":
      return [-width - r, -m - r];
    case "left":
      return [r + m / 2, height / 2];
  }
};
var getPath = function(anchor, m, r, width, height) {
  const w = width + r * 2;
  const h = height + r * 2;
  switch (anchor) {
    case "middle":
      return `M${-w / 2},${-h / 2}h${w}v${h}h${-w}z`;
    case "top-left":
      return `M0,0l${m},${m}h${w - m}v${h}h${-w}z`;
    case "top":
      return `M0,0l${m / 2},${m / 2}h${(w - m) / 2}v${h}h${-w}v${-h}h${(w - m) / 2}z`;
    case "top-right":
      return `M0,0l${-m},${m}h${m - w}v${h}h${w}z`;
    case "right":
      return `M0,0l${-m / 2},${-m / 2}v${m / 2 - h / 2}h${-w}v${h}h${w}v${m / 2 - h / 2}z`;
    case "bottom-left":
      return `M0,0l${m},${-m}h${w - m}v${-h}h${-w}z`;
    case "bottom":
      return `M0,0l${m / 2},${-m / 2}h${(w - m) / 2}v${-h}h${-w}v${h}h${(w - m) / 2}z`;
    case "bottom-right":
      return `M0,0l${-m},${-m}h${m - w}v${-h}h${w}z`;
    case "left":
      return `M0,0l${m / 2},${-m / 2}v${m / 2 - h / 2}h${w}v${h}h${-w}v${m / 2 - h / 2}z`;
  }
};
var getSources = function({ channels }) {
  const sources = {};
  for (const key in channels) {
    if (ignoreChannels.has(key))
      continue;
    const source = getSource(channels, key);
    if (source)
      sources[key] = source;
  }
  return sources;
};
var formatPair = function(c1, c22, i) {
  return c22.hint?.length ? `${formatDefault(c22.value[i] - c1.value[i])}` : `${formatDefault(c1.value[i])}\u2013${formatDefault(c22.value[i])}`;
};
var formatPairLabel = function(scales9, c1, c22, defaultLabel) {
  const l1 = formatLabel(scales9, c1, defaultLabel);
  const l2 = formatLabel(scales9, c22, defaultLabel);
  return l1 === l2 ? l1 : `${l1}\u2013${l2}`;
};
var formatLabel = function(scales9, c4, defaultLabel) {
  return String(scales9[c4.scale]?.label ?? c4?.label ?? defaultLabel);
};
var defaults5 = {
  ariaLabel: "tip",
  fill: "white",
  stroke: "currentColor"
};
var ignoreChannels = new Set(["geometry", "href", "src", "ariaLabel"]);

class Tip extends Mark {
  constructor(data2, options29 = {}) {
    if (options29.tip)
      options29 = { ...options29, tip: false };
    if (options29.title === undefined && isIterable(data2) && isTextual(data2))
      options29 = { ...options29, title: identity13 };
    const {
      x: x2,
      y: y2,
      x1: x12,
      x2: x22,
      y1: y12,
      y2: y22,
      anchor,
      monospace,
      fontFamily = monospace ? "ui-monospace, monospace" : undefined,
      fontSize,
      fontStyle,
      fontVariant,
      fontWeight,
      lineHeight = 1,
      lineWidth = 20,
      frameAnchor,
      textAnchor = "start",
      textOverflow,
      textPadding = 8,
      title,
      pointerSize = 12,
      pathFilter = "drop-shadow(0 3px 4px rgba(0,0,0,0.2))"
    } = options29;
    super(data2, {
      x: { value: x12 != null && x22 != null ? null : x2, scale: "x", optional: true },
      y: { value: y12 != null && y22 != null ? null : y2, scale: "y", optional: true },
      x1: { value: x12, scale: "x", optional: x22 == null },
      y1: { value: y12, scale: "y", optional: y22 == null },
      x2: { value: x22, scale: "x", optional: x12 == null },
      y2: { value: y22, scale: "y", optional: y12 == null },
      title: { value: title, optional: true }
    }, options29, defaults5);
    this.anchor = maybeAnchor(anchor, "anchor");
    this.previousAnchor = this.anchor ?? "top-left";
    this.frameAnchor = maybeFrameAnchor(frameAnchor);
    this.textAnchor = impliedString(textAnchor, "middle");
    this.textPadding = +textPadding;
    this.pointerSize = +pointerSize;
    this.pathFilter = string3(pathFilter);
    this.lineHeight = +lineHeight;
    this.lineWidth = +lineWidth;
    this.textOverflow = maybeTextOverflow(textOverflow);
    this.monospace = !!monospace;
    this.fontFamily = string3(fontFamily);
    this.fontSize = number12(fontSize);
    this.fontStyle = string3(fontStyle);
    this.fontVariant = string3(fontVariant);
    this.fontWeight = string3(fontWeight);
    for (const key in defaults5)
      if (key in this.channels)
        this[key] = defaults5[key];
    this.splitLines = splitter(this);
    this.clipLine = clipper(this);
  }
  render(index2, scales9, values4, dimensions, context11) {
    const mark8 = this;
    const { x: x2, y: y2, fx, fy } = scales9;
    const { ownerSVGElement: svg, document: document2 } = context11;
    const { anchor, monospace, lineHeight, lineWidth } = this;
    const { textPadding: r, pointerSize: m, pathFilter } = this;
    const { marginTop, marginLeft } = dimensions;
    const sources = getSources(values4);
    const { x1: X12, y1: Y12, x2: X22, y2: Y22, x: X3 = X12 ?? X22, y: Y3 = Y12 ?? Y22 } = values4;
    const ox = fx ? fx(index2.fx) - marginLeft : 0;
    const oy = fy ? fy(index2.fy) - marginTop : 0;
    const [cx, cy] = applyFrameAnchor(this, dimensions);
    const px = anchorX(values4, cx);
    const py = anchorY(values4, cy);
    const widthof = monospace ? monospaceWidth : defaultWidth;
    const ee = widthof(ellipsis);
    const formatFx = fx && inferTickFormat(fx);
    const formatFy = fy && inferTickFormat(fy);
    function* format7(sources2, i) {
      if ("title" in sources2) {
        const text7 = sources2.title.value[i];
        for (const line2 of mark8.splitLines(formatDefault(text7))) {
          yield { name: "", value: mark8.clipLine(line2) };
        }
        return;
      }
      for (const key in sources2) {
        if (key === "x1" && ("x2" in sources2))
          continue;
        if (key === "y1" && ("y2" in sources2))
          continue;
        const channel3 = sources2[key];
        const value5 = channel3.value[i];
        if (!defined(value5) && channel3.scale == null)
          continue;
        if (key === "x2" && ("x1" in sources2)) {
          yield { name: formatPairLabel(scales9, sources2.x1, channel3, "x"), value: formatPair(sources2.x1, channel3, i) };
        } else if (key === "y2" && ("y1" in sources2)) {
          yield { name: formatPairLabel(scales9, sources2.y1, channel3, "y"), value: formatPair(sources2.y1, channel3, i) };
        } else {
          const scale = channel3.scale;
          const line2 = { name: formatLabel(scales9, channel3, key), value: formatDefault(value5) };
          if (scale === "color" || scale === "opacity")
            line2[scale] = values4[key][i];
          yield line2;
        }
      }
      if (index2.fi != null && fx)
        yield { name: String(fx.label ?? "fx"), value: formatFx(index2.fx) };
      if (index2.fi != null && fy)
        yield { name: String(fy.label ?? "fy"), value: formatFy(index2.fy) };
    }
    const g = create2("svg:g", context11).call(applyIndirectStyles, this, dimensions, context11).call(applyIndirectTextStyles, this).call(applyTransform, this, { x: X3 && x2, y: Y3 && y2 }).call((g2) => g2.selectAll().data(index2).enter().append("g").attr("transform", (i) => `translate(${Math.round(px(i))},${Math.round(py(i))})`).call(applyDirectStyles, this).call((g3) => g3.append("path").attr("filter", pathFilter)).call((g3) => g3.append("text").each(function(i) {
      const that = select_default2(this);
      this.setAttribute("fill", "currentColor");
      this.setAttribute("fill-opacity", 1);
      this.setAttribute("stroke", "none");
      const names = new Set;
      for (const line2 of format7(sources, i)) {
        const name = line2.name;
        if (name && names.has(name))
          continue;
        else
          names.add(name);
        renderLine(that, line2);
      }
    })));
    function renderLine(selection5, { name, value: value5, color: color10, opacity: opacity2 }) {
      const swatch = color10 != null || opacity2 != null;
      let title;
      let w = lineWidth * 100;
      const [j] = cut(name, w, widthof, ee);
      if (j >= 0) {
        name = name.slice(0, j).trimEnd() + ellipsis;
        title = value5.trim();
        value5 = "";
      } else {
        if (name || !value5 && !swatch)
          value5 = " " + value5;
        const [k2] = cut(value5, w - widthof(name), widthof, ee);
        if (k2 >= 0) {
          value5 = value5.slice(0, k2).trimEnd() + ellipsis;
          title = value5.trim();
        }
      }
      const line2 = selection5.append("tspan").attr("x", 0).attr("dy", `${lineHeight}em`).text("\u200B");
      if (name)
        line2.append("tspan").attr("font-weight", "bold").text(name);
      if (value5)
        line2.append(() => document2.createTextNode(value5));
      if (swatch)
        line2.append("tspan").text(" \u25A0").attr("fill", color10).attr("fill-opacity", opacity2).style("user-select", "none");
      if (title)
        line2.append("title").text(title);
    }
    function postrender() {
      const { width, height } = dimensions.facet ?? dimensions;
      g.selectChildren().each(function(i) {
        let { x: tx, width: w, height: h } = this.getBBox();
        w = Math.round(w), h = Math.round(h);
        let a2 = anchor;
        if (a2 === undefined) {
          a2 = mark8.previousAnchor;
          const x3 = px(i) + ox;
          const y3 = py(i) + oy;
          const fitLeft = x3 + w + r * 2 < width;
          const fitRight = x3 - w - r * 2 > 0;
          const fitTop = y3 + h + m + r * 2 + 7 < height;
          const fitBottom = y3 - h - m - r * 2 > 0;
          const ax = (/-left$/.test(a2) ? fitLeft || !fitRight : fitLeft && !fitRight) ? "left" : "right";
          const ay = (/^top-/.test(a2) ? fitTop || !fitBottom : fitTop && !fitBottom) ? "top" : "bottom";
          a2 = mark8.previousAnchor = `${ay}-${ax}`;
        }
        const path3 = this.firstChild;
        const text7 = this.lastChild;
        path3.setAttribute("d", getPath(a2, m, r, w, h));
        if (tx)
          for (const t of text7.childNodes)
            t.setAttribute("x", -tx);
        text7.setAttribute("y", `${+getLineOffset(a2, text7.childNodes.length, lineHeight).toFixed(6)}em`);
        text7.setAttribute("transform", `translate(${getTextTranslate(a2, m, r, w, h)})`);
      });
    }
    if (svg.isConnected)
      Promise.resolve().then(postrender);
    else if (typeof requestAnimationFrame !== "undefined")
      requestAnimationFrame(postrender);
    return g.node();
  }
}

// node_modules/@observablehq/plot/src/plot.js
function plot(options31 = {}) {
  const { facet: facet3, style: style17, title, subtitle, caption, ariaLabel, ariaDescription } = options31;
  const className = maybeClassName(options31.className);
  const marks2 = options31.marks === undefined ? [] : flatMarks(options31.marks);
  marks2.push(...inferTips(marks2));
  const topFacetState = maybeTopFacet(facet3, options31);
  const facetStateByMark = new Map;
  for (const mark9 of marks2) {
    const facetState = maybeMarkFacet(mark9, topFacetState, options31);
    if (facetState)
      facetStateByMark.set(mark9, facetState);
  }
  const channelsByScale = new Map;
  if (topFacetState)
    addScaleChannels(channelsByScale, [topFacetState], options31);
  addScaleChannels(channelsByScale, facetStateByMark, options31);
  const axes3 = flatMarks(inferAxes(marks2, channelsByScale, options31));
  for (const mark9 of axes3) {
    const facetState = maybeMarkFacet(mark9, topFacetState, options31);
    if (facetState)
      facetStateByMark.set(mark9, facetState);
  }
  marks2.unshift(...axes3);
  let facets = createFacets(channelsByScale, options31);
  if (facets !== undefined) {
    const topFacetsIndex = topFacetState ? facetFilter(facets, topFacetState) : undefined;
    for (const mark9 of marks2) {
      if (mark9.facet === null || mark9.facet === "super")
        continue;
      const facetState = facetStateByMark.get(mark9);
      if (facetState === undefined)
        continue;
      facetState.facetsIndex = mark9.fx != null || mark9.fy != null ? facetFilter(facets, facetState) : topFacetsIndex;
    }
    const nonEmpty = new Set;
    for (const { facetsIndex } of facetStateByMark.values()) {
      facetsIndex?.forEach((index2, i) => {
        if (index2?.length > 0) {
          nonEmpty.add(i);
        }
      });
    }
    facets.forEach(0 < nonEmpty.size && nonEmpty.size < facets.length ? (f, i) => f.empty = !nonEmpty.has(i) : (f) => f.empty = false);
    for (const mark9 of marks2) {
      if (mark9.facet === "exclude") {
        const facetState = facetStateByMark.get(mark9);
        if (facetState !== undefined)
          facetState.facetsIndex = facetExclude(facetState.facetsIndex);
      }
    }
  }
  for (const key of registry.keys()) {
    if (isScaleOptions(options31[key]) && key !== "fx" && key !== "fy") {
      channelsByScale.set(key, []);
    }
  }
  const stateByMark = new Map;
  for (const mark9 of marks2) {
    if (stateByMark.has(mark9))
      throw new Error("duplicate mark; each mark must be unique");
    const { facetsIndex, channels: facetChannels } = facetStateByMark.get(mark9) ?? {};
    const { data: data2, facets: facets2, channels } = mark9.initialize(facetsIndex, facetChannels, options31);
    applyScaleTransforms(channels, options31);
    stateByMark.set(mark9, { data: data2, facets: facets2, channels });
  }
  const scaleDescriptors = createScales(addScaleChannels(channelsByScale, stateByMark, options31), options31);
  const scales12 = createScaleFunctions(scaleDescriptors);
  const dimensions2 = createDimensions(scaleDescriptors, marks2, options31);
  autoScaleRange(scaleDescriptors, dimensions2);
  const { fx, fy } = scales12;
  const subdimensions = fx || fy ? innerDimensions(scaleDescriptors, dimensions2) : dimensions2;
  const superdimensions = fx || fy ? actualDimensions(scales12, dimensions2) : dimensions2;
  const context12 = createContext(options31);
  const document2 = context12.document;
  const svg = creator_default("svg").call(document2.documentElement);
  let figure = svg;
  context12.ownerSVGElement = svg;
  context12.className = className;
  context12.projection = createProjection(options31, subdimensions);
  context12.filterFacets = (data2, channels) => {
    return facetFilter(facets, { channels, groups: facetGroups(data2, channels) });
  };
  context12.getMarkState = (mark9) => {
    const state = stateByMark.get(mark9);
    const facetState = facetStateByMark.get(mark9);
    return { ...state, channels: { ...state.channels, ...facetState?.channels } };
  };
  context12.dispatchValue = (value5) => {
    if (figure.value === value5)
      return;
    figure.value = value5;
    figure.dispatchEvent(new Event("input", { bubbles: true }));
  };
  const newByScale = new Set;
  for (const [mark9, state] of stateByMark) {
    if (mark9.initializer != null) {
      const dimensions3 = mark9.facet === "super" ? superdimensions : subdimensions;
      const update = mark9.initializer(state.data, state.facets, state.channels, scales12, dimensions3, context12);
      if (update.data !== undefined) {
        state.data = update.data;
      }
      if (update.facets !== undefined) {
        state.facets = update.facets;
      }
      if (update.channels !== undefined) {
        const { fx: fx2, fy: fy2, ...channels } = update.channels;
        inferChannelScales(channels);
        Object.assign(state.channels, channels);
        for (const channel4 of Object.values(channels)) {
          const { scale } = channel4;
          if (scale != null && !isPosition(registry.get(scale))) {
            applyScaleTransform(channel4, options31);
            newByScale.add(scale);
          }
        }
        if (fx2 != null || fy2 != null)
          facetStateByMark.set(mark9, true);
      }
    }
  }
  if (newByScale.size) {
    const newChannelsByScale = new Map;
    addScaleChannels(newChannelsByScale, stateByMark, options31, (key) => newByScale.has(key));
    addScaleChannels(channelsByScale, stateByMark, options31, (key) => newByScale.has(key));
    const newScaleDescriptors = inheritScaleLabels(createScales(newChannelsByScale, options31), scaleDescriptors);
    const newScales = createScaleFunctions(newScaleDescriptors);
    Object.assign(scaleDescriptors, newScaleDescriptors);
    Object.assign(scales12, newScales);
  }
  let facetDomains, facetTranslate;
  if (facets !== undefined) {
    facetDomains = { x: fx?.domain(), y: fy?.domain() };
    facets = recreateFacets(facets, facetDomains);
    facetTranslate = facetTranslator(fx, fy, dimensions2);
  }
  for (const [mark9, state] of stateByMark) {
    state.values = mark9.scale(state.channels, scales12, context12);
  }
  const { width, height } = dimensions2;
  select_default2(svg).attr("class", className).attr("fill", "currentColor").attr("font-family", "system-ui, sans-serif").attr("font-size", 10).attr("text-anchor", "middle").attr("width", width).attr("height", height).attr("viewBox", `0 0 ${width} ${height}`).attr("aria-label", ariaLabel).attr("aria-description", ariaDescription).call((svg2) => svg2.append("style").text(`.${className} {
  display: block;
  background: white;
  height: auto;
  height: intrinsic;
  max-width: 100%;
}
.${className} text,
.${className} tspan {
  white-space: pre;
}`)).call(applyInlineStyles, style17);
  for (const mark9 of marks2) {
    const { channels, values: values4, facets: indexes2 } = stateByMark.get(mark9);
    if (facets === undefined || mark9.facet === "super") {
      let index2 = null;
      if (indexes2) {
        index2 = indexes2[0];
        index2 = mark9.filter(index2, channels, values4);
        if (index2.length === 0)
          continue;
      }
      const node2 = mark9.render(index2, scales12, values4, superdimensions, context12);
      if (node2 == null)
        continue;
      svg.appendChild(node2);
    } else {
      let g;
      for (const f of facets) {
        if (!(mark9.facetAnchor?.(facets, facetDomains, f) ?? !f.empty))
          continue;
        let index2 = null;
        if (indexes2) {
          const faceted = facetStateByMark.has(mark9);
          index2 = indexes2[faceted ? f.i : 0];
          index2 = mark9.filter(index2, channels, values4);
          if (index2.length === 0)
            continue;
          if (!faceted && index2 === indexes2[0])
            index2 = subarray(index2);
          index2.fx = f.x, index2.fy = f.y, index2.fi = f.i;
        }
        const node2 = mark9.render(index2, scales12, values4, subdimensions, context12);
        if (node2 == null)
          continue;
        (g ??= select_default2(svg).append("g")).append(() => node2).datum(f);
        for (const name of ["aria-label", "aria-description", "aria-hidden", "transform"]) {
          if (node2.hasAttribute(name)) {
            g.attr(name, node2.getAttribute(name));
            node2.removeAttribute(name);
          }
        }
      }
      g?.selectChildren().attr("transform", facetTranslate);
    }
  }
  const legends2 = createLegends(scaleDescriptors, context12, options31);
  const { figure: figured = title != null || subtitle != null || caption != null || legends2.length > 0 } = options31;
  if (figured) {
    figure = document2.createElement("figure");
    figure.className = `${className}-figure`;
    figure.style.maxWidth = "initial";
    if (title != null)
      figure.append(createTitleElement(document2, title, "h2"));
    if (subtitle != null)
      figure.append(createTitleElement(document2, subtitle, "h3"));
    figure.append(...legends2, svg);
    if (caption != null)
      figure.append(createFigcaption(document2, caption));
  }
  figure.scale = exposeScales(scaleDescriptors);
  figure.legend = exposeLegends(scaleDescriptors, context12, options31);
  const w = consumeWarnings();
  if (w > 0) {
    select_default2(svg).append("text").attr("x", width).attr("y", 20).attr("dy", "-1em").attr("text-anchor", "end").attr("font-family", "initial").text("\u26A0\uFE0F").append("title").text(`${w.toLocaleString("en-US")} warning${w === 1 ? "" : "s"}. Please check the console.`);
  }
  return figure;
}
var createTitleElement = function(document2, contents, tag) {
  if (contents.ownerDocument)
    return contents;
  const e3 = document2.createElement(tag);
  e3.append(document2.createTextNode(contents));
  return e3;
};
var createFigcaption = function(document2, caption) {
  const e3 = document2.createElement("figcaption");
  e3.append(caption.ownerDocument ? caption : document2.createTextNode(caption));
  return e3;
};
var plotThis = function({ marks: marks2 = [], ...options31 } = {}) {
  return plot({ ...options31, marks: [...marks2, this] });
};
var flatMarks = function(marks2) {
  return marks2.flat(Infinity).filter((mark9) => mark9 != null).map(markify);
};
var markify = function(mark9) {
  return typeof mark9.render === "function" ? mark9 : new Render(mark9);
};
var applyScaleTransforms = function(channels, options31) {
  for (const name in channels)
    applyScaleTransform(channels[name], options31);
  return channels;
};
var applyScaleTransform = function(channel4, options31) {
  const { scale, transform: t = true } = channel4;
  if (scale == null || !t)
    return;
  const {
    type: type6,
    percent,
    interval: interval12,
    transform: transform5 = percent ? (x2) => x2 * 100 : maybeIntervalTransform(interval12, type6)
  } = options31[scale] ?? {};
  if (transform5 == null)
    return;
  channel4.value = map7(channel4.value, transform5);
  channel4.transform = false;
};
var inferChannelScales = function(channels) {
  for (const name in channels) {
    inferChannelScale(name, channels[name]);
  }
};
var addScaleChannels = function(channelsByScale, stateByMark, options31, filter6 = yes) {
  for (const { channels } of stateByMark.values()) {
    for (const name in channels) {
      const channel4 = channels[name];
      const { scale } = channel4;
      if (scale != null && filter6(scale)) {
        if (scale === "projection") {
          if (!hasProjection(options31)) {
            const gx = options31.x?.domain === undefined;
            const gy = options31.y?.domain === undefined;
            if (gx || gy) {
              const [x2, y2] = getGeometryChannels(channel4);
              if (gx)
                addScaleChannel(channelsByScale, "x", x2);
              if (gy)
                addScaleChannel(channelsByScale, "y", y2);
            }
          }
        } else {
          addScaleChannel(channelsByScale, scale, channel4);
        }
      }
    }
  }
  return channelsByScale;
};
var addScaleChannel = function(channelsByScale, scale, channel4) {
  const scaleChannels = channelsByScale.get(scale);
  if (scaleChannels !== undefined)
    scaleChannels.push(channel4);
  else
    channelsByScale.set(scale, [channel4]);
};
var maybeTopFacet = function(facet3, options31) {
  if (facet3 == null)
    return;
  const { x: x2, y: y2 } = facet3;
  if (x2 == null && y2 == null)
    return;
  const data2 = arrayify2(facet3.data);
  if (data2 == null)
    throw new Error("missing facet data");
  const channels = {};
  if (x2 != null)
    channels.fx = createChannel(data2, { value: x2, scale: "fx" });
  if (y2 != null)
    channels.fy = createChannel(data2, { value: y2, scale: "fy" });
  applyScaleTransforms(channels, options31);
  const groups2 = facetGroups(data2, channels);
  return { channels, groups: groups2, data: facet3.data };
};
var maybeMarkFacet = function(mark9, topFacetState, options31) {
  if (mark9.facet === null || mark9.facet === "super")
    return;
  const { fx, fy } = mark9;
  if (fx != null || fy != null) {
    const data3 = arrayify2(mark9.data ?? fx ?? fy);
    if (data3 === undefined)
      throw new Error(`missing facet data in ${mark9.ariaLabel}`);
    if (data3 === null)
      return;
    const channels2 = {};
    if (fx != null)
      channels2.fx = createChannel(data3, { value: fx, scale: "fx" });
    if (fy != null)
      channels2.fy = createChannel(data3, { value: fy, scale: "fy" });
    applyScaleTransforms(channels2, options31);
    return { channels: channels2, groups: facetGroups(data3, channels2) };
  }
  if (topFacetState === undefined)
    return;
  const { channels, groups: groups2, data: data2 } = topFacetState;
  if (mark9.facet !== "auto" || mark9.data === data2)
    return { channels, groups: groups2 };
  if (data2.length > 0 && (groups2.size > 1 || groups2.size === 1 && channels.fx && channels.fy && [...groups2][0][1].size > 1) && arrayify2(mark9.data)?.length === data2.length) {
    warn(`Warning: the ${mark9.ariaLabel} mark appears to use faceted data, but isn\u2019t faceted. The mark data has the same length as the facet data and the mark facet option is "auto", but the mark data and facet data are distinct. If this mark should be faceted, set the mark facet option to true; otherwise, suppress this warning by setting the mark facet option to false.`);
  }
};
var derive = function(mark9, options31 = {}) {
  return initializer({ ...options31, x: null, y: null }, (data2, facets, channels, scales12, dimensions2, context12) => {
    return context12.getMarkState(mark9);
  });
};
var inferTips = function(marks2) {
  const tips = [];
  for (const mark9 of marks2) {
    const t = mark9.tip;
    if (t) {
      const p = t === "x" ? pointerX : t === "y" ? pointerY : pointer;
      const options31 = p(derive(mark9));
      options31.title = null;
      tips.push(tip(mark9.data, options31));
    }
  }
  return tips;
};
var inferAxes = function(marks2, channelsByScale, options31) {
  let {
    projection: projection6,
    x: x2 = {},
    y: y2 = {},
    fx = {},
    fy = {},
    axis: axis5,
    grid,
    facet: facet3 = {},
    facet: { axis: facetAxis = axis5, grid: facetGrid } = facet3,
    x: { axis: xAxis = axis5, grid: xGrid = xAxis === null ? null : grid } = x2,
    y: { axis: yAxis = axis5, grid: yGrid = yAxis === null ? null : grid } = y2,
    fx: { axis: fxAxis = facetAxis, grid: fxGrid = fxAxis === null ? null : facetGrid } = fx,
    fy: { axis: fyAxis = facetAxis, grid: fyGrid = fyAxis === null ? null : facetGrid } = fy
  } = options31;
  if (projection6 || !isScaleOptions(x2) && !hasPositionChannel("x", marks2))
    xAxis = xGrid = null;
  if (projection6 || !isScaleOptions(y2) && !hasPositionChannel("y", marks2))
    yAxis = yGrid = null;
  if (!channelsByScale.has("fx"))
    fxAxis = fxGrid = null;
  if (!channelsByScale.has("fy"))
    fyAxis = fyGrid = null;
  if (xAxis === undefined)
    xAxis = !hasAxis(marks2, "x");
  if (yAxis === undefined)
    yAxis = !hasAxis(marks2, "y");
  if (fxAxis === undefined)
    fxAxis = !hasAxis(marks2, "fx");
  if (fyAxis === undefined)
    fyAxis = !hasAxis(marks2, "fy");
  if (xAxis === true)
    xAxis = "bottom";
  if (yAxis === true)
    yAxis = "left";
  if (fxAxis === true)
    fxAxis = xAxis === "top" || xAxis === null ? "bottom" : "top";
  if (fyAxis === true)
    fyAxis = yAxis === "right" || yAxis === null ? "left" : "right";
  const axes3 = [];
  maybeGrid(axes3, fyGrid, gridFy, fy);
  maybeAxis(axes3, fyAxis, axisFy, "right", "left", facet3, fy);
  maybeGrid(axes3, fxGrid, gridFx, fx);
  maybeAxis(axes3, fxAxis, axisFx, "top", "bottom", facet3, fx);
  maybeGrid(axes3, yGrid, gridY, y2);
  maybeAxis(axes3, yAxis, axisY, "left", "right", options31, y2);
  maybeGrid(axes3, xGrid, gridX, x2);
  maybeAxis(axes3, xAxis, axisX, "bottom", "top", options31, x2);
  return axes3;
};
var maybeAxis = function(axes3, axis5, axisType, primary, secondary, defaults6, options31) {
  if (!axis5)
    return;
  const both = isBoth(axis5);
  options31 = axisOptions(both ? primary : axis5, defaults6, options31);
  const { line: line2 } = options31;
  if ((axisType === axisY || axisType === axisX) && line2 && !isNone(line2))
    axes3.push(frame2(lineOptions(options31)));
  axes3.push(axisType(options31));
  if (both)
    axes3.push(axisType({ ...options31, anchor: secondary, label: null }));
};
var maybeGrid = function(axes3, grid, gridType, options31) {
  if (!grid || isNone(grid))
    return;
  axes3.push(gridType(gridOptions(grid, options31)));
};
var isBoth = function(value5) {
  return /^\s*both\s*$/i.test(value5);
};
var axisOptions = function(anchor, defaults6, {
  line: line2 = defaults6.line,
  ticks: ticks2,
  tickSize,
  tickSpacing,
  tickPadding,
  tickFormat: tickFormat3,
  tickRotate,
  fontVariant,
  ariaLabel,
  ariaDescription,
  label = defaults6.label,
  labelAnchor,
  labelArrow = defaults6.labelArrow,
  labelOffset
}) {
  return {
    anchor,
    line: line2,
    ticks: ticks2,
    tickSize,
    tickSpacing,
    tickPadding,
    tickFormat: tickFormat3,
    tickRotate,
    fontVariant,
    ariaLabel,
    ariaDescription,
    label,
    labelAnchor,
    labelArrow,
    labelOffset
  };
};
var lineOptions = function(options31) {
  const { anchor, line: line2 } = options31;
  return { anchor, facetAnchor: anchor + "-empty", stroke: line2 === true ? undefined : line2 };
};
var gridOptions = function(grid, {
  stroke = isColor(grid) ? grid : undefined,
  ticks: ticks2 = isGridTicks(grid) ? grid : undefined,
  tickSpacing,
  ariaLabel,
  ariaDescription
}) {
  return {
    stroke,
    ticks: ticks2,
    tickSpacing,
    ariaLabel,
    ariaDescription
  };
};
var isGridTicks = function(grid) {
  switch (typeof grid) {
    case "number":
      return true;
    case "string":
      return !isColor(grid);
  }
  return isIterable(grid) || typeof grid?.range === "function";
};
var hasAxis = function(marks2, k2) {
  const prefix = `${k2}-axis `;
  return marks2.some((m) => m.ariaLabel?.startsWith(prefix));
};
var hasPositionChannel = function(k2, marks2) {
  for (const mark9 of marks2) {
    for (const key in mark9.channels) {
      const { scale } = mark9.channels[key];
      if (scale === k2 || scale === "projection") {
        return true;
      }
    }
  }
  return false;
};
var inheritScaleLabels = function(newScales, scales12) {
  for (const key in newScales) {
    const newScale = newScales[key];
    const scale = scales12[key];
    if (newScale.label === undefined && scale) {
      newScale.label = scale.label;
    }
  }
  return newScales;
};
var actualDimensions = function({ fx, fy }, dimensions2) {
  const { marginTop, marginRight, marginBottom, marginLeft, width, height } = outerDimensions(dimensions2);
  const fxr = fx && outerRange(fx);
  const fyr = fy && outerRange(fy);
  return {
    marginTop: fy ? fyr[0] : marginTop,
    marginRight: fx ? width - fxr[1] : marginRight,
    marginBottom: fy ? height - fyr[1] : marginBottom,
    marginLeft: fx ? fxr[0] : marginLeft,
    inset: {
      marginTop: dimensions2.marginTop,
      marginRight: dimensions2.marginRight,
      marginBottom: dimensions2.marginBottom,
      marginLeft: dimensions2.marginLeft
    },
    width,
    height
  };
};
var outerRange = function(scale) {
  const domain = scale.domain();
  let x12 = scale(domain[0]);
  let x2 = scale(domain[domain.length - 1]);
  if (x2 < x12)
    [x12, x2] = [x2, x12];
  return [x12, x2 + scale.bandwidth()];
};
Mark.prototype.plot = plotThis;

class Render extends Mark {
  constructor(render) {
    if (typeof render !== "function")
      throw new TypeError("invalid mark; missing render function");
    super();
    this.render = render;
  }
  render() {
  }
}
// node_modules/@observablehq/plot/src/curve.js
function maybeCurve(curve = linear_default, tension) {
  if (typeof curve === "function")
    return curve;
  const c4 = curves.get(`${curve}`.toLowerCase());
  if (!c4)
    throw new Error(`unknown curve: ${curve}`);
  if (tension !== undefined) {
    if ("beta" in c4) {
      return c4.beta(tension);
    } else if ("tension" in c4) {
      return c4.tension(tension);
    } else if ("alpha" in c4) {
      return c4.alpha(tension);
    }
  }
  return c4;
}
function maybeCurveAuto(curve = curveAuto, tension) {
  return typeof curve !== "function" && `${curve}`.toLowerCase() === "auto" ? curveAuto : maybeCurve(curve, tension);
}
function curveAuto(context12) {
  return linear_default(context12);
}
var curves = new Map([
  ["basis", basis_default2],
  ["basis-closed", basisClosed_default2],
  ["basis-open", basisOpen_default],
  ["bundle", bundle_default],
  ["bump-x", bumpX],
  ["bump-y", bumpY],
  ["cardinal", cardinal_default],
  ["cardinal-closed", cardinalClosed_default],
  ["cardinal-open", cardinalOpen_default],
  ["catmull-rom", catmullRom_default],
  ["catmull-rom-closed", catmullRomClosed_default],
  ["catmull-rom-open", catmullRomOpen_default],
  ["linear", linear_default],
  ["linear-closed", linearClosed_default],
  ["monotone-x", monotoneX],
  ["monotone-y", monotoneY],
  ["natural", natural_default],
  ["step", step_default],
  ["step-after", stepAfter],
  ["step-before", stepBefore]
]);

// node_modules/@observablehq/plot/src/transforms/bin.js
function binX(outputs = { y: "count" }, options32 = {}) {
  [outputs, options32] = mergeOptions(outputs, options32);
  const { x: x2, y: y2 } = options32;
  return binn(maybeBinValue(x2, options32, identity13), null, null, y2, outputs, maybeInsetX(options32));
}
var maybeDenseInterval = function(bin, k2, options32 = {}) {
  return options32?.interval == null ? options32 : bin({ [k2]: options32?.reduce === undefined ? reduceFirst : options32.reduce, filter: null }, options32);
};
function maybeDenseIntervalX(options32 = {}) {
  return maybeDenseInterval(binX, "y", withTip(options32, "x"));
}
var binn = function(bx, by, gx, gy, {
  data: reduceData = reduceIdentity,
  filter: filter6 = reduceCount,
  sort: sort6,
  reverse: reverse2,
  ...outputs
} = {}, inputs = {}) {
  bx = maybeBin(bx);
  by = maybeBin(by);
  outputs = maybeBinOutputs(outputs, inputs);
  reduceData = maybeBinReduce(reduceData, identity13);
  sort6 = sort6 == null ? undefined : maybeBinOutput("sort", sort6, inputs);
  filter6 = filter6 == null ? undefined : maybeBinEvaluator("filter", filter6, inputs);
  if (gx != null && hasOutput(outputs, "x", "x1", "x2"))
    gx = null;
  if (gy != null && hasOutput(outputs, "y", "y1", "y2"))
    gy = null;
  const [BX1, setBX1] = maybeColumn(bx);
  const [BX2, setBX2] = maybeColumn(bx);
  const [BY1, setBY1] = maybeColumn(by);
  const [BY2, setBY2] = maybeColumn(by);
  const [k2, gk] = gx != null ? [gx, "x"] : gy != null ? [gy, "y"] : [];
  const [GK, setGK] = maybeColumn(k2);
  const {
    x: x2,
    y: y2,
    z,
    fill,
    stroke,
    x1: x12,
    x2: x22,
    y1: y12,
    y2: y22,
    domain,
    cumulative,
    thresholds,
    interval: interval12,
    ...options32
  } = inputs;
  const [GZ, setGZ] = maybeColumn(z);
  const [vfill] = maybeColorChannel(fill);
  const [vstroke] = maybeColorChannel(stroke);
  const [GF, setGF] = maybeColumn(vfill);
  const [GS, setGS] = maybeColumn(vstroke);
  return {
    ...("z" in inputs) && { z: GZ || z },
    ...("fill" in inputs) && { fill: GF || fill },
    ...("stroke" in inputs) && { stroke: GS || stroke },
    ...basic(options32, (data2, facets, plotOptions) => {
      const K2 = maybeApplyInterval(valueof(data2, k2), plotOptions?.[gk]);
      const Z = valueof(data2, z);
      const F = valueof(data2, vfill);
      const S = valueof(data2, vstroke);
      const G = maybeSubgroup(outputs, { z: Z, fill: F, stroke: S });
      const groupFacets = [];
      const groupData = [];
      const GK2 = K2 && setGK([]);
      const GZ2 = Z && setGZ([]);
      const GF2 = F && setGF([]);
      const GS2 = S && setGS([]);
      const BX12 = bx && setBX1([]);
      const BX22 = bx && setBX2([]);
      const BY12 = by && setBY1([]);
      const BY22 = by && setBY2([]);
      const bin = bing(bx?.(data2), by?.(data2));
      let i = 0;
      for (const o of outputs)
        o.initialize(data2);
      if (sort6)
        sort6.initialize(data2);
      if (filter6)
        filter6.initialize(data2);
      for (const facet3 of facets) {
        const groupFacet = [];
        for (const o of outputs)
          o.scope("facet", facet3);
        if (sort6)
          sort6.scope("facet", facet3);
        if (filter6)
          filter6.scope("facet", facet3);
        for (const [f, I] of maybeGroup(facet3, G)) {
          for (const [k3, g] of maybeGroup(I, K2)) {
            for (const [b, extent2] of bin(g)) {
              if (filter6 && !filter6.reduce(b, extent2))
                continue;
              groupFacet.push(i++);
              groupData.push(reduceData.reduceIndex(b, data2, extent2));
              if (K2)
                GK2.push(k3);
              if (Z)
                GZ2.push(G === Z ? f : Z[b[0]]);
              if (F)
                GF2.push(G === F ? f : F[b[0]]);
              if (S)
                GS2.push(G === S ? f : S[b[0]]);
              if (BX12)
                BX12.push(extent2.x1), BX22.push(extent2.x2);
              if (BY12)
                BY12.push(extent2.y1), BY22.push(extent2.y2);
              for (const o of outputs)
                o.reduce(b, extent2);
              if (sort6)
                sort6.reduce(b);
            }
          }
        }
        groupFacets.push(groupFacet);
      }
      maybeSort(groupFacets, sort6, reverse2);
      return { data: groupData, facets: groupFacets };
    }),
    ...!hasOutput(outputs, "x") && (BX1 ? { x1: BX1, x2: BX2, x: mid(BX1, BX2) } : { x: x2, x1: x12, x2: x22 }),
    ...!hasOutput(outputs, "y") && (BY1 ? { y1: BY1, y2: BY2, y: mid(BY1, BY2) } : { y: y2, y1: y12, y2: y22 }),
    ...GK && { [gk]: GK },
    ...Object.fromEntries(outputs.map(({ name, output }) => [name, output]))
  };
};
var mergeOptions = function({ cumulative, domain, thresholds, interval: interval12, ...outputs }, options32) {
  return [outputs, { cumulative, domain, thresholds, interval: interval12, ...options32 }];
};
var maybeBinValue = function(value5, { cumulative, domain, thresholds, interval: interval12 }, defaultValue) {
  value5 = { ...maybeValue(value5) };
  if (value5.domain === undefined)
    value5.domain = domain;
  if (value5.cumulative === undefined)
    value5.cumulative = cumulative;
  if (value5.thresholds === undefined)
    value5.thresholds = thresholds;
  if (value5.interval === undefined)
    value5.interval = interval12;
  if (value5.value === undefined)
    value5.value = defaultValue;
  value5.thresholds = maybeThresholds(value5.thresholds, value5.interval);
  return value5;
};
var maybeBin = function(options32) {
  if (options32 == null)
    return;
  const { value: value5, cumulative, domain = extent, thresholds } = options32;
  const bin = (data2) => {
    let V = valueof(data2, value5);
    let T;
    if (isTemporal(V) || isTimeThresholds(thresholds)) {
      V = map7(V, coerceDate, Float64Array);
      let [min4, max5] = typeof domain === "function" ? domain(V) : domain;
      let t = typeof thresholds === "function" && !isInterval(thresholds) ? thresholds(V, min4, max5) : thresholds;
      if (typeof t === "number")
        t = utcTickInterval(min4, max5, t);
      if (isInterval(t)) {
        if (domain === extent) {
          min4 = t.floor(min4);
          max5 = t.offset(t.floor(max5));
        }
        t = t.range(min4, t.offset(max5));
      }
      T = t;
    } else {
      V = coerceNumbers(V);
      let [min4, max5] = typeof domain === "function" ? domain(V) : domain;
      let t = typeof thresholds === "function" && !isInterval(thresholds) ? thresholds(V, min4, max5) : thresholds;
      if (typeof t === "number") {
        if (domain === extent) {
          let step = tickIncrement(min4, max5, t);
          if (isFinite(step)) {
            if (step > 0) {
              let r0 = Math.round(min4 / step);
              let r1 = Math.round(max5 / step);
              if (!(r0 * step <= min4))
                --r0;
              if (!(r1 * step > max5))
                ++r1;
              let n = r1 - r0 + 1;
              t = new Float64Array(n);
              for (let i = 0;i < n; ++i)
                t[i] = (r0 + i) * step;
            } else if (step < 0) {
              step = -step;
              let r0 = Math.round(min4 * step);
              let r1 = Math.round(max5 * step);
              if (!(r0 / step <= min4))
                --r0;
              if (!(r1 / step > max5))
                ++r1;
              let n = r1 - r0 + 1;
              t = new Float64Array(n);
              for (let i = 0;i < n; ++i)
                t[i] = (r0 + i) / step;
            } else {
              t = [min4];
            }
          } else {
            t = [min4];
          }
        } else {
          t = ticks(min4, max5, t);
        }
      } else if (isInterval(t)) {
        if (domain === extent) {
          min4 = t.floor(min4);
          max5 = t.offset(t.floor(max5));
        }
        t = t.range(min4, t.offset(max5));
      }
      T = t;
    }
    const E2 = [];
    if (T.length === 1)
      E2.push([T[0], T[0]]);
    else
      for (let i = 1;i < T.length; ++i)
        E2.push([T[i - 1], T[i]]);
    E2.bin = (cumulative < 0 ? bin1cn : cumulative > 0 ? bin1cp : bin1)(E2, T, V);
    return E2;
  };
  bin.label = labelof(value5);
  return bin;
};
function maybeThresholds(thresholds, interval12, defaultThresholds = thresholdAuto) {
  if (thresholds === undefined) {
    return interval12 === undefined ? defaultThresholds : maybeRangeInterval(interval12);
  }
  if (typeof thresholds === "string") {
    switch (thresholds.toLowerCase()) {
      case "freedman-diaconis":
        return thresholdFreedmanDiaconis;
      case "scott":
        return thresholdScott;
      case "sturges":
        return thresholdSturges;
      case "auto":
        return thresholdAuto;
    }
    return maybeUtcInterval(thresholds);
  }
  return thresholds;
}
var maybeBinOutputs = function(outputs, inputs) {
  return maybeOutputs(outputs, inputs, maybeBinOutput);
};
var maybeBinOutput = function(name, reduce3, inputs) {
  return maybeOutput(name, reduce3, inputs, maybeBinEvaluator);
};
var maybeBinEvaluator = function(name, reduce3, inputs) {
  return maybeEvaluator(name, reduce3, inputs, maybeBinReduce);
};
var maybeBinReduce = function(reduce3, value5) {
  return maybeReduce(reduce3, value5, maybeBinReduceFallback);
};
var maybeBinReduceFallback = function(reduce3) {
  switch (`${reduce3}`.toLowerCase()) {
    case "x":
      return reduceX;
    case "x1":
      return reduceX1;
    case "x2":
      return reduceX2;
    case "y":
      return reduceY;
    case "y1":
      return reduceY1;
    case "y2":
      return reduceY2;
  }
  throw new Error(`invalid bin reduce: ${reduce3}`);
};
var thresholdAuto = function(values4, min4, max5) {
  return Math.min(200, thresholdScott(values4, min4, max5));
};
var isTimeThresholds = function(t) {
  return isTimeInterval(t) || isIterable(t) && isTemporal(t);
};
var isTimeInterval = function(t) {
  return isInterval(t) && typeof t === "function" && t() instanceof Date;
};
var isInterval = function(t) {
  return typeof t?.range === "function";
};
var bing = function(EX, EY) {
  return EX && EY ? function* (I) {
    const X3 = EX.bin(I);
    for (const [ix, [x12, x2]] of EX.entries()) {
      const Y3 = EY.bin(X3[ix]);
      for (const [iy, [y12, y2]] of EY.entries()) {
        yield [Y3[iy], { x1: x12, y1: y12, x2, y2 }];
      }
    }
  } : EX ? function* (I) {
    const X3 = EX.bin(I);
    for (const [i, [x12, x2]] of EX.entries()) {
      yield [X3[i], { x1: x12, x2 }];
    }
  } : function* (I) {
    const Y3 = EY.bin(I);
    for (const [i, [y12, y2]] of EY.entries()) {
      yield [Y3[i], { y1: y12, y2 }];
    }
  };
};
var bin1 = function(E2, T, V) {
  T = coerceNumbers(T);
  return (I) => {
    const B2 = E2.map(() => []);
    for (const i of I)
      B2[bisect_default(T, V[i]) - 1]?.push(i);
    return B2;
  };
};
var bin1cp = function(E2, T, V) {
  const bin = bin1(E2, T, V);
  return (I) => {
    const B2 = bin(I);
    for (let i = 1, n = B2.length;i < n; ++i) {
      const C2 = B2[i - 1];
      const b = B2[i];
      for (const j of C2)
        b.push(j);
    }
    return B2;
  };
};
var bin1cn = function(E2, T, V) {
  const bin = bin1(E2, T, V);
  return (I) => {
    const B2 = bin(I);
    for (let i = B2.length - 2;i >= 0; --i) {
      const C2 = B2[i + 1];
      const b = B2[i];
      for (const j of C2)
        b.push(j);
    }
    return B2;
  };
};
var mid1 = function(x12, x2) {
  const m = (+x12 + +x2) / 2;
  return x12 instanceof Date ? new Date(m) : m;
};
var reduceX = {
  reduceIndex(I, X3, { x1: x12, x2 }) {
    return mid1(x12, x2);
  }
};
var reduceY = {
  reduceIndex(I, X3, { y1: y12, y2 }) {
    return mid1(y12, y2);
  }
};
var reduceX1 = {
  reduceIndex(I, X3, { x1: x12 }) {
    return x12;
  }
};
var reduceX2 = {
  reduceIndex(I, X3, { x2 }) {
    return x2;
  }
};
var reduceY1 = {
  reduceIndex(I, X3, { y1: y12 }) {
    return y12;
  }
};
var reduceY2 = {
  reduceIndex(I, X3, { y2 }) {
    return y2;
  }
};

// node_modules/@observablehq/plot/src/transforms/identity.js
function maybeIdentityX(options33 = {}) {
  return hasX(options33) ? options33 : { ...options33, x: identity13 };
}

// node_modules/@observablehq/plot/src/transforms/stack.js
function stackX(stackOptions = {}, options35 = {}) {
  if (arguments.length === 1)
    [stackOptions, options35] = mergeOptions2(stackOptions);
  const { y1: y12, y: y2 = y12, x: x2, ...rest } = options35;
  const [transform5, Y3, x12, x22] = stack(y2, x2, "y", "x", stackOptions, rest);
  return { ...transform5, y1: y12, y: Y3, x1: x12, x2: x22, x: mid(x12, x22) };
}
function maybeStackX({ x: x2, x1: x12, x2: x22, ...options35 } = {}) {
  options35 = withTip(options35, "y");
  if (x12 === undefined && x22 === undefined)
    return stackX({ x: x2, ...options35 });
  [x12, x22] = maybeZero(x2, x12, x22);
  return { ...options35, x1: x12, x2: x22 };
}
var mergeOptions2 = function(options35) {
  const { offset: offset2, order: order2, reverse: reverse2, ...rest } = options35;
  return [{ offset: offset2, order: order2, reverse: reverse2 }, rest];
};
var stack = function(x2, y2 = one2, kx2, ky2, { offset: offset2, order: order2, reverse: reverse2 }, options35) {
  if (y2 === null)
    throw new Error(`stack requires ${ky2}`);
  const z = maybeZ(options35);
  const [X3, setX] = maybeColumn(x2);
  const [Y12, setY1] = column(y2);
  const [Y22, setY2] = column(y2);
  Y12.hint = Y22.hint = lengthy;
  offset2 = maybeOffset(offset2);
  order2 = maybeOrder2(order2, offset2, ky2);
  return [
    basic(options35, (data2, facets, plotOptions) => {
      const X4 = x2 == null ? undefined : setX(maybeApplyInterval(valueof(data2, x2), plotOptions?.[kx2]));
      const Y3 = valueof(data2, y2, Float64Array);
      const Z = valueof(data2, z);
      const compare = order2 && order2(data2, X4, Y3, Z);
      const n = data2.length;
      const Y13 = setY1(new Float64Array(n));
      const Y23 = setY2(new Float64Array(n));
      const facetstacks = [];
      for (const facet3 of facets) {
        const stacks = X4 ? Array.from(group(facet3, (i) => X4[i]).values()) : [facet3];
        if (compare)
          for (const stack2 of stacks)
            stack2.sort(compare);
        for (const stack2 of stacks) {
          let yn = 0;
          let yp = 0;
          if (reverse2)
            stack2.reverse();
          for (const i of stack2) {
            const y3 = Y3[i];
            if (y3 < 0)
              yn = Y23[i] = (Y13[i] = yn) + y3;
            else if (y3 > 0)
              yp = Y23[i] = (Y13[i] = yp) + y3;
            else
              Y23[i] = Y13[i] = yp;
          }
        }
        facetstacks.push(stacks);
      }
      if (offset2)
        offset2(facetstacks, Y13, Y23, Z);
      return { data: data2, facets };
    }),
    X3,
    Y12,
    Y22
  ];
};
var maybeOffset = function(offset2) {
  if (offset2 == null)
    return;
  if (typeof offset2 === "function")
    return offset2;
  switch (`${offset2}`.toLowerCase()) {
    case "expand":
    case "normalize":
      return offsetExpand;
    case "center":
    case "silhouette":
      return offsetCenter;
    case "wiggle":
      return offsetWiggle;
  }
  throw new Error(`unknown offset: ${offset2}`);
};
var extent2 = function(stack2, Y22) {
  let min4 = 0, max5 = 0;
  for (const i of stack2) {
    const y2 = Y22[i];
    if (y2 < min4)
      min4 = y2;
    if (y2 > max5)
      max5 = y2;
  }
  return [min4, max5];
};
var offsetExpand = function(facetstacks, Y12, Y22) {
  for (const stacks of facetstacks) {
    for (const stack2 of stacks) {
      const [yn, yp] = extent2(stack2, Y22);
      for (const i of stack2) {
        const m = 1 / (yp - yn || 1);
        Y12[i] = m * (Y12[i] - yn);
        Y22[i] = m * (Y22[i] - yn);
      }
    }
  }
};
var offsetCenter = function(facetstacks, Y12, Y22) {
  for (const stacks of facetstacks) {
    for (const stack2 of stacks) {
      const [yn, yp] = extent2(stack2, Y22);
      for (const i of stack2) {
        const m = (yp + yn) / 2;
        Y12[i] -= m;
        Y22[i] -= m;
      }
    }
    offsetZero(stacks, Y12, Y22);
  }
  offsetCenterFacets(facetstacks, Y12, Y22);
};
var offsetWiggle = function(facetstacks, Y12, Y22, Z) {
  for (const stacks of facetstacks) {
    const prev = new InternMap;
    let y2 = 0;
    for (const stack2 of stacks) {
      let j = -1;
      const Fi = stack2.map((i) => Math.abs(Y22[i] - Y12[i]));
      const Df = stack2.map((i) => {
        j = Z ? Z[i] : ++j;
        const value5 = Y22[i] - Y12[i];
        const diff = prev.has(j) ? value5 - prev.get(j) : 0;
        prev.set(j, value5);
        return diff;
      });
      const Cf1 = [0, ...cumsum(Df)];
      for (const i of stack2) {
        Y12[i] += y2;
        Y22[i] += y2;
      }
      const s1 = sum3(Fi);
      if (s1)
        y2 -= sum3(Fi, (d, i) => (Df[i] / 2 + Cf1[i]) * d) / s1;
    }
    offsetZero(stacks, Y12, Y22);
  }
  offsetCenterFacets(facetstacks, Y12, Y22);
};
var offsetZero = function(stacks, Y12, Y22) {
  const m = min(stacks, (stack2) => min(stack2, (i) => Y12[i]));
  for (const stack2 of stacks) {
    for (const i of stack2) {
      Y12[i] -= m;
      Y22[i] -= m;
    }
  }
};
var offsetCenterFacets = function(facetstacks, Y12, Y22) {
  const n = facetstacks.length;
  if (n === 1)
    return;
  const facets = facetstacks.map((stacks) => stacks.flat());
  const m = facets.map((I) => (min(I, (i) => Y12[i]) + max3(I, (i) => Y22[i])) / 2);
  const m0 = min(m);
  for (let j = 0;j < n; j++) {
    const p = m0 - m[j];
    for (const i of facets[j]) {
      Y12[i] += p;
      Y22[i] += p;
    }
  }
};
var maybeOrder2 = function(order2, offset2, ky2) {
  if (order2 === undefined && offset2 === offsetWiggle)
    return orderInsideOut(ascendingDefined2);
  if (order2 == null)
    return;
  if (typeof order2 === "string") {
    const negate = order2.startsWith("-");
    const compare = negate ? descendingDefined : ascendingDefined2;
    switch ((negate ? order2.slice(1) : order2).toLowerCase()) {
      case "value":
      case ky2:
        return orderY(compare);
      case "z":
        return orderZ(compare);
      case "sum":
        return orderSum(compare);
      case "appearance":
        return orderAppearance(compare);
      case "inside-out":
        return orderInsideOut(compare);
    }
    return orderAccessor(field(order2));
  }
  if (typeof order2 === "function")
    return (order2.length === 1 ? orderAccessor : orderComparator)(order2);
  if (Array.isArray(order2))
    return orderGiven(order2);
  throw new Error(`invalid order: ${order2}`);
};
var orderY = function(compare) {
  return (data2, X3, Y3) => (i, j) => compare(Y3[i], Y3[j]);
};
var orderZ = function(compare) {
  return (data2, X3, Y3, Z) => (i, j) => compare(Z[i], Z[j]);
};
var orderSum = function(compare) {
  return orderZDomain(compare, (data2, X3, Y3, Z) => groupSort(range4(data2), (I) => sum3(I, (i) => Y3[i]), (i) => Z[i]));
};
var orderAppearance = function(compare) {
  return orderZDomain(compare, (data2, X3, Y3, Z) => groupSort(range4(data2), (I) => X3[greatest(I, (i) => Y3[i])], (i) => Z[i]));
};
var orderInsideOut = function(compare) {
  return orderZDomain(compare, (data2, X3, Y3, Z) => {
    const I = range4(data2);
    const K2 = groupSort(I, (I2) => X3[greatest(I2, (i) => Y3[i])], (i) => Z[i]);
    const sums = rollup(I, (I2) => sum3(I2, (i) => Y3[i]), (i) => Z[i]);
    const Kp = [], Kn = [];
    let s2 = 0;
    for (const k2 of K2) {
      if (s2 < 0) {
        s2 += sums.get(k2);
        Kp.push(k2);
      } else {
        s2 -= sums.get(k2);
        Kn.push(k2);
      }
    }
    return Kn.reverse().concat(Kp);
  });
};
var orderAccessor = function(f) {
  return (data2) => {
    const O = valueof(data2, f);
    return (i, j) => ascendingDefined2(O[i], O[j]);
  };
};
var orderComparator = function(f) {
  return (data2) => (i, j) => f(data2[i], data2[j]);
};
var orderGiven = function(domain) {
  return orderZDomain(ascendingDefined2, () => domain);
};
var orderZDomain = function(compare, domain) {
  return (data2, X3, Y3, Z) => {
    if (!Z)
      throw new Error("missing channel: z");
    const map8 = new InternMap(domain(data2, X3, Y3, Z).map((d, i) => [d, i]));
    return (i, j) => compare(map8.get(Z[i]), map8.get(Z[j]));
  };
};
var lengthy = { length: true };

// node_modules/@observablehq/plot/src/marks/bar.js
function barX(data2, options36 = {}) {
  if (!hasXY(options36))
    options36 = { ...options36, y: indexOf, x2: identity13 };
  return new BarX(data2, maybeStackX(maybeIntervalX(maybeIdentityX(options36))));
}
class AbstractBar extends Mark {
  constructor(data2, channels, options36 = {}, defaults6) {
    super(data2, channels, options36, defaults6);
    const { inset: inset3 = 0, insetTop = inset3, insetRight = inset3, insetBottom = inset3, insetLeft = inset3, rx, ry } = options36;
    this.insetTop = number12(insetTop);
    this.insetRight = number12(insetRight);
    this.insetBottom = number12(insetBottom);
    this.insetLeft = number12(insetLeft);
    this.rx = impliedString(rx, "auto");
    this.ry = impliedString(ry, "auto");
  }
  render(index2, scales13, channels, dimensions2, context13) {
    const { rx, ry } = this;
    return create2("svg:g", context13).call(applyIndirectStyles, this, dimensions2, context13).call(this._transform, this, scales13).call((g) => g.selectAll().data(index2).enter().append("rect").call(applyDirectStyles, this).attr("x", this._x(scales13, channels, dimensions2)).attr("width", this._width(scales13, channels, dimensions2)).attr("y", this._y(scales13, channels, dimensions2)).attr("height", this._height(scales13, channels, dimensions2)).call(applyAttr, "rx", rx).call(applyAttr, "ry", ry).call(applyChannelStyles, this, channels)).node();
  }
  _x(scales13, { x: X3 }, { marginLeft }) {
    const { insetLeft } = this;
    return X3 ? (i) => X3[i] + insetLeft : marginLeft + insetLeft;
  }
  _y(scales13, { y: Y3 }, { marginTop }) {
    const { insetTop } = this;
    return Y3 ? (i) => Y3[i] + insetTop : marginTop + insetTop;
  }
  _width({ x: x2 }, { x: X3 }, { marginRight, marginLeft, width }) {
    const { insetLeft, insetRight } = this;
    const bandwidth = X3 && x2 ? x2.bandwidth() : width - marginRight - marginLeft;
    return Math.max(0, bandwidth - insetLeft - insetRight);
  }
  _height({ y: y2 }, { y: Y3 }, { marginTop, marginBottom, height }) {
    const { insetTop, insetBottom } = this;
    const bandwidth = Y3 && y2 ? y2.bandwidth() : height - marginTop - marginBottom;
    return Math.max(0, bandwidth - insetTop - insetBottom);
  }
}
var defaults6 = {
  ariaLabel: "bar"
};

class BarX extends AbstractBar {
  constructor(data2, options36 = {}) {
    const { x1: x12, x2, y: y2 } = options36;
    super(data2, {
      x1: { value: x12, scale: "x" },
      x2: { value: x2, scale: "x" },
      y: { value: y2, scale: "y", type: "band", optional: true }
    }, options36, defaults6);
  }
  _transform(selection5, mark12, { x: x2 }) {
    selection5.call(applyTransform, mark12, { x: x2 }, 0, 0);
  }
  _x({ x: x2 }, { x1: X12, x2: X22 }, { marginLeft }) {
    const { insetLeft } = this;
    return isCollapsed(x2) ? marginLeft + insetLeft : (i) => Math.min(X12[i], X22[i]) + insetLeft;
  }
  _width({ x: x2 }, { x1: X12, x2: X22 }, { marginRight, marginLeft, width }) {
    const { insetLeft, insetRight } = this;
    return isCollapsed(x2) ? width - marginRight - marginLeft - insetLeft - insetRight : (i) => Math.max(0, Math.abs(X22[i] - X12[i]) - insetLeft - insetRight);
  }
}

// node_modules/@observablehq/plot/src/marks/dot.js
function withDefaultSort(options37) {
  return options37.sort === undefined && options37.reverse === undefined ? sort5({ channel: "-r" }, options37) : options37;
}
function dot(data2, { x: x2, y: y2, ...options37 } = {}) {
  if (options37.frameAnchor === undefined)
    [x2, y2] = maybeTuple(x2, y2);
  return new Dot(data2, { ...options37, x: x2, y: y2 });
}
var defaults7 = {
  ariaLabel: "dot",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5
};

class Dot extends Mark {
  constructor(data2, options37 = {}) {
    const { x: x2, y: y2, r, rotate, symbol: symbol6 = circle_default2, frameAnchor } = options37;
    const [vrotate, crotate] = maybeNumberChannel(rotate, 0);
    const [vsymbol, csymbol] = maybeSymbolChannel(symbol6);
    const [vr, cr] = maybeNumberChannel(r, vsymbol == null ? 3 : 4.5);
    super(data2, {
      x: { value: x2, scale: "x", optional: true },
      y: { value: y2, scale: "y", optional: true },
      r: { value: vr, scale: "r", filter: positive, optional: true },
      rotate: { value: vrotate, optional: true },
      symbol: { value: vsymbol, scale: "auto", optional: true }
    }, withDefaultSort(options37), defaults7);
    this.r = cr;
    this.rotate = crotate;
    this.symbol = csymbol;
    this.frameAnchor = maybeFrameAnchor(frameAnchor);
    const { channels } = this;
    const { symbol: symbolChannel } = channels;
    if (symbolChannel) {
      const { fill: fillChannel, stroke: strokeChannel } = channels;
      symbolChannel.hint = {
        fill: fillChannel ? fillChannel.value === symbolChannel.value ? "color" : "currentColor" : this.fill,
        stroke: strokeChannel ? strokeChannel.value === symbolChannel.value ? "color" : "currentColor" : this.stroke
      };
    }
  }
  render(index2, scales13, channels, dimensions2, context14) {
    const { x: x2, y: y2 } = scales13;
    const { x: X3, y: Y3, r: R, rotate: A5, symbol: S } = channels;
    const { r, rotate, symbol: symbol6 } = this;
    const [cx, cy] = applyFrameAnchor(this, dimensions2);
    const circle4 = symbol6 === circle_default2;
    const size2 = R ? undefined : r * r * Math.PI;
    if (negative(r))
      index2 = [];
    return create2("svg:g", context14).call(applyIndirectStyles, this, dimensions2, context14).call(applyTransform, this, { x: X3 && x2, y: Y3 && y2 }).call((g) => g.selectAll().data(index2).enter().append(circle4 ? "circle" : "path").call(applyDirectStyles, this).call(circle4 ? (selection5) => {
      selection5.attr("cx", X3 ? (i) => X3[i] : cx).attr("cy", Y3 ? (i) => Y3[i] : cy).attr("r", R ? (i) => R[i] : r);
    } : (selection5) => {
      selection5.attr("transform", template`translate(${X3 ? (i) => X3[i] : cx},${Y3 ? (i) => Y3[i] : cy})${A5 ? (i) => ` rotate(${A5[i]})` : rotate ? ` rotate(${rotate})` : ``}`).attr("d", R && S ? (i) => {
        const p = pathRound();
        S[i].draw(p, R[i] * R[i] * Math.PI);
        return p;
      } : R ? (i) => {
        const p = pathRound();
        symbol6.draw(p, R[i] * R[i] * Math.PI);
        return p;
      } : S ? (i) => {
        const p = pathRound();
        S[i].draw(p, size2);
        return p;
      } : (() => {
        const p = pathRound();
        symbol6.draw(p, size2);
        return p;
      })());
    }).call(applyChannelStyles, this, channels)).node();
  }
}

// node_modules/@observablehq/plot/src/marks/line.js
var sphereLine = function(projection6, X3, Y3) {
  const path3 = path_default(projection6);
  X3 = coerceNumbers(X3);
  Y3 = coerceNumbers(Y3);
  return (I) => {
    let line2 = [];
    const lines = [line2];
    for (const i of I) {
      if (i === -1) {
        line2 = [];
        lines.push(line2);
      } else {
        line2.push([X3[i], Y3[i]]);
      }
    }
    return path3({ type: "MultiLineString", coordinates: lines });
  };
};
function lineY(data2, { x: x2 = indexOf, y: y2 = identity13, ...options38 } = {}) {
  return new Line(data2, maybeDenseIntervalX({ ...options38, x: x2, y: y2 }));
}
var defaults8 = {
  ariaLabel: "line",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeMiterlimit: 1
};

class Line extends Mark {
  constructor(data2, options38 = {}) {
    const { x: x2, y: y2, z, curve: curve2, tension } = options38;
    super(data2, {
      x: { value: x2, scale: "x" },
      y: { value: y2, scale: "y" },
      z: { value: maybeZ(options38), optional: true }
    }, options38, defaults8);
    this.z = z;
    this.curve = maybeCurveAuto(curve2, tension);
    markers(this, options38);
  }
  filter(index2) {
    return index2;
  }
  project(channels, values4, context15) {
    if (this.curve !== curveAuto) {
      super.project(channels, values4, context15);
    }
  }
  render(index2, scales13, channels, dimensions2, context15) {
    const { x: X3, y: Y3 } = channels;
    const { curve: curve2 } = this;
    return create2("svg:g", context15).call(applyIndirectStyles, this, dimensions2, context15).call(applyTransform, this, scales13).call((g) => g.selectAll().data(groupIndex(index2, [X3, Y3], this, channels)).enter().append("path").call(applyDirectStyles, this).call(applyGroupedChannelStyles, this, channels).call(applyGroupedMarkers, this, channels, context15).attr("d", curve2 === curveAuto && context15.projection ? sphereLine(context15.projection, X3, Y3) : line_default2().curve(curve2).defined((i) => i >= 0).x((i) => X3[i]).y((i) => Y3[i]))).node();
  }
}

// node_modules/@observablehq/plot/src/marks/rect.js
function rect(data2, options39) {
  return new Rect(data2, maybeTrivialIntervalX(maybeTrivialIntervalY(options39)));
}
var defaults9 = {
  ariaLabel: "rect"
};

class Rect extends Mark {
  constructor(data2, options39 = {}) {
    const {
      x1: x12,
      y1: y12,
      x2,
      y2,
      inset: inset3 = 0,
      insetTop = inset3,
      insetRight = inset3,
      insetBottom = inset3,
      insetLeft = inset3,
      rx,
      ry
    } = options39;
    super(data2, {
      x1: { value: x12, scale: "x", optional: true },
      y1: { value: y12, scale: "y", optional: true },
      x2: { value: x2, scale: "x", optional: true },
      y2: { value: y2, scale: "y", optional: true }
    }, options39, defaults9);
    this.insetTop = number12(insetTop);
    this.insetRight = number12(insetRight);
    this.insetBottom = number12(insetBottom);
    this.insetLeft = number12(insetLeft);
    this.rx = impliedString(rx, "auto");
    this.ry = impliedString(ry, "auto");
  }
  render(index2, scales14, channels, dimensions2, context16) {
    const { x: x2, y: y2 } = scales14;
    const { x1: X12, y1: Y12, x2: X22, y2: Y22 } = channels;
    const { marginTop, marginRight, marginBottom, marginLeft, width, height } = dimensions2;
    const { projection: projection6 } = context16;
    const { insetTop, insetRight, insetBottom, insetLeft, rx, ry } = this;
    return create2("svg:g", context16).call(applyIndirectStyles, this, dimensions2, context16).call(applyTransform, this, { x: X12 && X22 && x2, y: Y12 && Y22 && y2 }, 0, 0).call((g) => g.selectAll().data(index2).enter().append("rect").call(applyDirectStyles, this).attr("x", X12 && X22 && (projection6 || !isCollapsed(x2)) ? (i) => Math.min(X12[i], X22[i]) + insetLeft : marginLeft + insetLeft).attr("y", Y12 && Y22 && (projection6 || !isCollapsed(y2)) ? (i) => Math.min(Y12[i], Y22[i]) + insetTop : marginTop + insetTop).attr("width", X12 && X22 && (projection6 || !isCollapsed(x2)) ? (i) => Math.max(0, Math.abs(X22[i] - X12[i]) - insetLeft - insetRight) : width - marginRight - marginLeft - insetRight - insetLeft).attr("height", Y12 && Y22 && (projection6 || !isCollapsed(y2)) ? (i) => Math.max(0, Math.abs(Y12[i] - Y22[i]) - insetTop - insetBottom) : height - marginTop - marginBottom - insetTop - insetBottom).call(applyAttr, "rx", rx).call(applyAttr, "ry", ry).call(applyChannelStyles, this, channels)).node();
  }
}
// node_modules/@observablehq/plot/src/marks/tick.js
function tickX(data2, { x: x2 = identity13, ...options40 } = {}) {
  return new TickX(data2, { ...options40, x: x2 });
}
var defaults10 = {
  ariaLabel: "tick",
  fill: null,
  stroke: "currentColor"
};

class AbstractTick extends Mark {
  constructor(data2, channels, options40) {
    super(data2, channels, options40, defaults10);
    markers(this, options40);
  }
  render(index2, scales14, channels, dimensions2, context17) {
    return create2("svg:g", context17).call(applyIndirectStyles, this, dimensions2, context17).call(this._transform, this, scales14).call((g) => g.selectAll().data(index2).enter().append("line").call(applyDirectStyles, this).attr("x1", this._x1(scales14, channels, dimensions2)).attr("x2", this._x2(scales14, channels, dimensions2)).attr("y1", this._y1(scales14, channels, dimensions2)).attr("y2", this._y2(scales14, channels, dimensions2)).call(applyChannelStyles, this, channels).call(applyMarkers, this, channels, context17)).node();
  }
}

class TickX extends AbstractTick {
  constructor(data2, options40 = {}) {
    const { x: x2, y: y2, inset: inset3 = 0, insetTop = inset3, insetBottom = inset3 } = options40;
    super(data2, {
      x: { value: x2, scale: "x" },
      y: { value: y2, scale: "y", type: "band", optional: true }
    }, options40);
    this.insetTop = number12(insetTop);
    this.insetBottom = number12(insetBottom);
  }
  _transform(selection5, mark16, { x: x2 }) {
    selection5.call(applyTransform, mark16, { x: x2 }, offset, 0);
  }
  _x1(scales14, { x: X3 }) {
    return (i) => X3[i];
  }
  _x2(scales14, { x: X3 }) {
    return (i) => X3[i];
  }
  _y1({ y: y2 }, { y: Y3 }, { marginTop }) {
    const { insetTop } = this;
    return Y3 && y2 ? (i) => Y3[i] + insetTop : marginTop + insetTop;
  }
  _y2({ y: y2 }, { y: Y3 }, { height, marginBottom }) {
    const { insetBottom } = this;
    return Y3 && y2 ? (i) => Y3[i] + y2.bandwidth() - insetBottom : height - marginBottom - insetBottom;
  }
}
// client/views/plots.ts
var import_mithril = __toESM(require_mithril(), 1);
var cdfplot = function(f) {
  let data2 = range_default(1, 100).map((x2) => [f(x2 / 100), x2 / 100]);
  return plot({
    marginTop: 50,
    marginBottom: 50,
    style: {
      "background-color": "#111",
      color: "white",
      "font-size": "110%"
    },
    x: {
      label: "value",
      tickFormat: "~s"
    },
    y: {
      label: "quantile",
      grid: true,
      ticks: range_default(0, 11).map((x2) => x2 / 10)
    },
    marks: [
      lineY(data2, { x: (d) => d[0], y: (d) => d[1], stroke: "grey" }),
      ruleY([0.1, 0.5, 0.9], { y: (d) => d, x1: f(0.01), x2: (d) => f(d), stroke: "lightgreen" }),
      ruleX([0.1, 0.5, 0.9], { x: (d) => f(d), y1: 0, y2: (d) => d, stroke: "lightgreen" })
    ]
  });
};
function CDFPlot(f) {
  return {
    oncreate: function(vnode) {
      vnode.dom.append(cdfplot(f));
    },
    view: function(vnode) {
      return import_mithril.default("div.cdf-plot");
    }
  };
}
var tornadoplot = function(data2) {
  return plot({
    marginLeft: 120,
    marginBottom: 50,
    style: {
      "background-color": "#111",
      color: "white",
      "font-size": "130%"
    },
    x: {
      label: "opportunity",
      tickFormat: "~s"
    },
    y: { label: "" },
    color: {
      scheme: "Greens"
    },
    marks: [
      barX(data2, {
        y: "variable",
        sort: { y: {
          value: "data",
          reverse: true,
          reduce: (d) => reduce_default(max_default, (-Infinity), map_default((x2) => Math.abs(x2.value[2] - x2.value[0]), d))
        } },
        fillOpacity: 0.8,
        fill: (d) => Math.abs(d.value[2] - d.value[0]),
        x1: (d) => Math.min(...d.value),
        x2: (d) => Math.max(...d.value)
      }),
      tickX([0], { stroke: "white", x: (d) => d }),
      tickX([data2[0].value[1]], { stroke: "white", strokeDasharray: "3 2", x: (d) => d })
    ]
  });
};
function TornadoPlot(data2) {
  return {
    oncreate: function(vnode) {
      vnode.dom.append(tornadoplot(data2));
    },
    view: function(vnode) {
      return import_mithril.default("div.tornado-plot");
    }
  };
}
var innovationchart = function(data2, markStyle = "glyph", position2 = "median") {
  let marks2 = [];
  const x2 = (d) => position2 === "median" ? d.opportunity.quantileF()(0.5) : position2 === "mean" ? mean_default(d.opportunity.samples) : NaN;
  switch (markStyle) {
    case "simple":
      marks2 = [
        dot(data2, {
          x: (d) => x2(d),
          y: (d) => d.roadmap.chanceOfSuccess() * 100,
          fill: (d) => d.assessor?.color || "grey",
          symbol: "circle-filled",
          r: 10
        }),
        text3(data2, {
          text: (d) => d.assessor?.name.split(" ").slice(0, 2).map((x3) => x3[0]) || "",
          x: (d) => x2(d),
          y: (d) => d.roadmap.chanceOfSuccess() * 100,
          fill: "#111"
        })
      ];
      break;
    case "glyph":
      const max5 = reduce_default(max_default, 0, data2.map((x3) => Math.abs(x3.opportunity.quantileF()(0.5))));
      const size2 = 0.04 * max5;
      const separation = (d) => -size2 + 2 * size2 * (filter_default((x3) => x3 < 0, d.opportunity.samples).length / d.opportunity.samples.length);
      const offset2 = (d) => (d.opportunity.quantile(mean_default(d.opportunity.samples)) - 0.5) * 2 * size2;
      marks2 = [
        rect(data2, {
          x1: (d) => offset2(d) + x2(d) - size2,
          x2: (d) => offset2(d) + x2(d) + separation(d),
          y1: (d) => d.roadmap.chanceOfSuccess() * 100 - 1,
          y2: (d) => d.roadmap.chanceOfSuccess() * 100 + 1,
          fill: "#a00"
        }),
        rect(data2, {
          x1: (d) => offset2(d) + x2(d) + separation(d),
          x2: (d) => offset2(d) + x2(d) + size2,
          y1: (d) => d.roadmap.chanceOfSuccess() * 100 - 1,
          y2: (d) => d.roadmap.chanceOfSuccess() * 100 + 1,
          fill: "#48a"
        }),
        ruleX(data2, {
          x: (d) => x2(d),
          y1: (d) => d.roadmap.chanceOfSuccess() * 100 - 1.5,
          y2: (d) => d.roadmap.chanceOfSuccess() * 100 + 1.5
        }),
        dot(data2, {
          x: (d) => x2(d) + offset2(d),
          y: (d) => d.roadmap.chanceOfSuccess() * 100,
          fill: "black",
          r: 2
        })
      ];
      break;
  }
  return plot({
    style: {
      "background-color": "#111",
      color: "white"
    },
    y: {
      domain: [0, 100]
    },
    marks: [
      ruleX([0], {
        strokeWidth: 4,
        stroke: "grey",
        opacity: 0.5
      }),
      ...marks2
    ]
  });
};
function InnovationChart(data2, markStyle = "glyph") {
  return {
    oncreate: function(vnode) {
      vnode.dom.append(innovationchart(data2, markStyle));
    },
    view: (vnode) => import_mithril.default("div.innovation-chart")
  };
}

// client/views/components.ts
function Tabs() {
  let selected = null;
  return {
    view: ({ attrs }) => {
      return import_mithril2.default("div.tabs", import_mithril2.default("div.tab-bar", Object.keys(attrs).map((name) => import_mithril2.default("span.tab-name", {
        class: name === selected ? "selected" : "",
        onclick: () => {
          selected = name;
        }
      }, name))), import_mithril2.default("div.tab-content", attrs[selected ?? Object.keys(attrs)[0]]));
    }
  };
}
var AssessmentOutputsView = {
  view({ attrs: { assessment } }) {
    return import_mithril2.default("div.assessment-outputs", import_mithril2.default(AssessmentStatsView, { assessment }), import_mithril2.default(CDFPlot(assessment.quantileF())), import_mithril2.default(TornadoPlot(assessment.sensitivity())));
  }
};
var AssessmentStatsView = {
  view({ attrs: { assessment } }) {
    return import_mithril2.default("div.stats", import_mithril2.default(LabeledNumber, { number: mean_default(assessment.samples), label: "Mean" }), import_mithril2.default(LabeledNumber, { postunit: "%", number: 100 * assessment.quantile(mean_default(assessment.samples)), label: "MeanQ" }), import_mithril2.default(LabeledNumber, { number: median_default(assessment.samples), label: "Median" }), import_mithril2.default(LabeledNumber, { postunit: "%", number: 100 * filter_default((x2) => x2 < 0, assessment.samples).length / assessment.samples.length, label: "Loss Chance" }));
  }
};
var AssessmentInputsView = {
  view({ attrs: { assessment, update } }) {
    return import_mithril2.default("div.asssessment-inputs", import_mithril2.default(FormulaText, { formula: assessment.model.formulaString(), update: (s2) => {
      assessment.model = new Formula(s2);
    } }), import_mithril2.default(InputsListView, { assessment, update }));
  }
};
var FormulaText = {
  view({ attrs: { formula, update, title } }) {
    return import_mithril2.default("div.formula", import_mithril2.default("p", title ?? "Formula:"), import_mithril2.default("textarea", { onblur: (e3) => update(e3.target.value) }, formula));
  }
};
var FormulaInputView = {
  view({ attrs: { assessment } }) {
    return import_mithril2.default("div.formula-input-view", assessment.model.formulas.map((f) => import_mithril2.default("div.formula-view", import_mithril2.default("span.variable", f[1]), import_mithril2.default("span.equals", `=`), this.construct(f[2], assessment))));
  },
  construct(formula, assessment) {
    if (isLeaf(formula)) {
      if (typeof formula === "number") {
        return import_mithril2.default("span.number", `${formula}`);
      } else {
        if (includes_default(formula, assessment.model.derived_vars)) {
          return import_mithril2.default("span.variable", `${formula}`);
        }
        return import_mithril2.default(InputView, {
          name: formula,
          input: assessment.inputs[formula].estimate,
          update: (v) => assessment.patch(formula, { estimate: v })
        });
      }
    }
    const children2 = formula.slice(1).map((x2) => this.construct(x2, assessment));
    if (!/\w+/.test(formula[0])) {
      const term = intersperse_default(import_mithril2.default("span.operator", { "+": "+", "-": "-", "*": "\xD7", "/": "\xF7" }[formula[0]]), children2);
      if (formula[0] === "+" || formula[0] === "-") {
        return import_mithril2.default("span.factor", import_mithril2.default("span.open-bracket", ``), ...term, import_mithril2.default("span.closed-bracket", ``));
      }
      return import_mithril2.default("span.factor", ...term);
    } else {
      return import_mithril2.default("span.function", import_mithril2.default("span.variable", `${formula[0]}`), import_mithril2.default("span.open-bracket"), ...intersperse_default(",", children2), import_mithril2.default("span.closed-bracket"));
    }
  }
};
var RoadmapView = {
  view({ attrs: { roadmap, update } }) {
    return import_mithril2.default("div.roadmap", import_mithril2.default("span.success-chance", roadmap.chanceOfSuccess()), roadmap.phases.map((phase, i) => import_mithril2.default(PhaseView, {
      phase,
      update: (p) => {
        if (p === null || p === undefined) {
          roadmap.phases.splice(i, 1);
        } else {
          roadmap.phases[i] = p;
        }
        update(roadmap);
      }
    })), import_mithril2.default("span.add-button", { onclick: () => {
      roadmap.phases.push(new Phase("Untitled Phase"));
      update(roadmap);
    } }, "Add Phase"));
  }
};
var PhaseView = {
  view({ attrs: { phase, update } }) {
    return import_mithril2.default("div.phase", import_mithril2.default(CE, { selector: "h4.name", onchange: (s2) => {
      phase.name = s2;
      update(phase);
    }, value: phase.name }), import_mithril2.default("button.remove", { onclick: () => update(null) }, "\xD7"), import_mithril2.default("textarea.textarea.description", { value: phase.description, onblur: (e3) => {
      phase.description = e3.target.value;
      update(phase);
    } }), import_mithril2.default("div.cost-profile", import_mithril2.default("span.label", "Cost profile:"), import_mithril2.default("div.stats", import_mithril2.default(LabeledNumber, { number: phase.cost.quantileF()(0.1), label: "10%" }), import_mithril2.default(LabeledNumber, { number: median_default(phase.cost.samples), label: "50%" }), import_mithril2.default(LabeledNumber, { number: mean_default(phase.cost.samples), label: "Mean" }), import_mithril2.default(LabeledNumber, { number: phase.cost.quantileF()(0.9), label: "90%" })), import_mithril2.default(InputsListView, { assessment: phase.cost, update: (q) => {
      phase.cost.set(q.name, q);
      update(phase);
    } })), import_mithril2.default("div.proof-points", import_mithril2.default("span.label", "Proof Points"), import_mithril2.default(LabeledNumber, { label: "Chance of Success", precision: 2, number: phase.chanceOfSuccess() }), keys_default(phase.proof_points).map((pp) => import_mithril2.default(ProofPointView, { proof_point: phase.proof_points[pp], update: (p) => {
      phase.proof_points[pp] = p;
      update(phase);
    } })), import_mithril2.default("span.add-button", { onclick: () => {
      phase.create();
      update(phase);
    } }, "Add Proof Point")));
  }
};
var ProofPointView = {
  view({ attrs: { proof_point, update } }) {
    return import_mithril2.default("div.proof-point", import_mithril2.default(CE, { selector: "span.name", onchange: (s2) => {
      proof_point.name = s2;
      update(proof_point);
    }, value: proof_point.name }), import_mithril2.default("span.chance", import_mithril2.default("span.label", "Assessment: "), import_mithril2.default("input", { type: "number", step: "0.1", value: proof_point.estimate, oninput: (e3) => {
      proof_point.estimate = +e3.target.value;
      update(proof_point);
    } })), import_mithril2.default("textarea.textarea.criteria", { placeholder: "Enter criteria ..." }, proof_point.description), import_mithril2.default("textarea.textarea.comments", { placeholder: "Enter comments ..." }, proof_point.rationales.comments));
  }
};
var QuantityView = {
  view({ attrs: { quantity, update } }) {
    return import_mithril2.default(isCertain(quantity) ? FixedQuantityView : UncertainQuantityView, { quantity, update });
  }
};
var UncertainQuantityView = {
  view({ attrs: { quantity, update } }) {
    return import_mithril2.default(QuantityHeader, { quantity, update }, import_mithril2.default("textarea.rationale.low", { value: quantity.rationales.low, placeholder: "Explain reasons for low estimate here...", onblur: (e3) => update(quantity, "rationales", { low: e3.target.value, high: quantity.rationales.high }) }), import_mithril2.default(SPTInputView, { input: quantity.estimate, update: (n) => update(quantity, "estimate", n) }), import_mithril2.default("textarea.rationale.low", { value: quantity.rationales.high, placeholder: "Explain reasons for high estimate here...", onblur: (e3) => update(quantity, "rationales", { low: quantity.rationales.low, high: e3.target.value }) }));
  }
};
var FixedQuantityView = {
  view({ attrs: { quantity, update } }) {
    return import_mithril2.default(QuantityHeader, { quantity, update }, import_mithril2.default("textarea.rationale.comments", { value: quantity.rationales.comments, placeholder: "Add comments here...", onblur: (s2) => update(quantity, "rationales", { comments: s2 }) }), import_mithril2.default(FixedInputView, { input: quantity.estimate, update: (n) => update(quantity, "estimate", n) }));
  }
};
var QuantityHeader = {
  view({ children: children2, attrs: { quantity, update } }) {
    return import_mithril2.default("div.quantity", import_mithril2.default("span.name", quantity.name), import_mithril2.default("input.description", { type: "text", onblur: (e3) => update(quantity, "description", e3.target.value) }, quantity.description), import_mithril2.default(CE, { selector: "span.units", value: quantity.units, onchange: (s2) => update(quantity, "units", s2) }), children2);
  }
};
var InputsListView = {
  view({ attrs: { assessment, update } }) {
    return import_mithril2.default("div.spts", assessment.model.inputs.map((x2) => {
      let input = assessment.inputs[x2];
      return import_mithril2.default(InputView, {
        name: x2,
        input: input.estimate,
        update: (values4) => {
          input.estimate = values4;
          update(input);
        }
      });
    }));
  }
};
var SPTInputView = {
  view({ attrs: { name, input, update, simple } }) {
    return import_mithril2.default("div.spt-input", name && import_mithril2.default("h4", name), import_mithril2.default("div.input-stack", (simple ? ["low", "med", "high"] : ["min", "low", "med", "high", "max"]).map((q) => import_mithril2.default("input", {
      type: "number",
      value: input[q],
      placeholder: q,
      oninput: (e3) => update(Object.assign(input, {
        [q]: e3.target.value && e3.target.value !== "" ? /-?\d+(\.\d*)?([eE]\d+)?/.test(e3.target.value) ? +e3.target.value : input[q] : null
      }))
    }))));
  }
};
var FixedInputView = {
  view: ({ attrs: { name, input, update, simple } }) => import_mithril2.default("div.spt-input", name && import_mithril2.default("h4", name), import_mithril2.default("div.input-stack", import_mithril2.default("input", {
    type: "number",
    value: input,
    oninput: (e3) => update(e3.target.value && /-?\d+(\.\d*)?([eE]\d+)?/.test(e3.target.value) ? +e3.target.value : input)
  })))
};
var InputView = {
  view: ({ attrs }) => typeof attrs.input === "number" ? import_mithril2.default(FixedInputView, attrs) : import_mithril2.default(SPTInputView, attrs)
};
var CE = {
  view: ({ attrs: { selector: selector3, onchange, value: value5 } }) => {
    return import_mithril2.default(selector3, { contentEditable: true, onblur: (e3) => onchange(e3.target.innerText) }, import_mithril2.default.trust(value5));
  }
};
var LabeledNumber = {
  view: ({ attrs: { label = "", number: number13 = 0, precision = 0, postunit = "", preunit = "" } }) => {
    return import_mithril2.default("span.labeled-number", import_mithril2.default("span.label", label), import_mithril2.default("span.number", preunit, number13.toLocaleString("en-US", { maximumFractionDigits: precision }), postunit));
  }
};

// client/views/views.ts
function MainView(db2) {
  return function() {
    let chartstyle = "glyph";
    return {
      view: ({ attrs: {} }) => {
        console.log("chartstyle", chartstyle);
        return import_mithril3.default("div.main-view", import_mithril3.default("h1.title", "DA Product Valuations"), import_mithril3.default("select", { onchange: (e3) => {
          chartstyle = e3.target.value;
        } }, ["glyph", "simple"].map((x2) => import_mithril3.default("option", { value: x2 }, x2))), import_mithril3.default(InnovationChart(map5(db2.ideas, (x2) => head_default(db2.scenarios.get({ idea: x2.id }))), chartstyle)), map5(db2.ideas, (idea) => import_mithril3.default("div.idea-summary", { onclick: () => {
          console.log("clicked", idea.id);
          import_mithril3.default.route.set(`/idea/:id`, { id: idea.id });
        } }, import_mithril3.default("h3.name", idea.name), import_mithril3.default("p.description", idea.description), import_mithril3.default("p.proposer", idea.proposer ?? ""))), import_mithril3.default("button", { onclick: () => {
          db2.ideas.add(new Idea("New Idea", "Fill in a description"));
        } }, "+ Add Idea"));
      }
    };
  };
}
function IdeaView(db2) {
  return {
    view({ attrs: { id: id2 } }) {
      const idea = db2.ideas.get(id2);
      return import_mithril3.default("div.idea-view", import_mithril3.default(CE, { selector: "h1.title", value: idea.name, onchange: (name) => db2.ideas.upsert(Object.assign(idea, { name })) }), import_mithril3.default("p.description", idea.description), import_mithril3.default("p.proposer", idea.proposer ?? ""), import_mithril3.default("div.scenarios", db2.scenarios.get({ idea: id2 }).map((s2) => import_mithril3.default(ScenarioSummary, { scenario: s2, update: (s3) => db2.scenarios.upsert(s3) })), import_mithril3.default("div.scenario-summary.new", { onclick: () => db2.scenarios.add(new Scenario("value = price * reach", "New Scenario", idea.id)) }, import_mithril3.default("span", "+ Add Scenario"))));
    }
  };
}
function ScenarioView(db2) {
  return {
    view({ attrs: { id: id2 } }) {
      const scenario = db2.scenarios.get(id2);
      return import_mithril3.default("div.scenario", import_mithril3.default(CE, { selector: "h1.name", value: scenario.name, onchange: (s2) => {
        scenario.name = s2;
        db2.scenarios.upsert(scenario);
      } }), import_mithril3.default(CE, { selector: "div.description", value: scenario.description, onchange: (s2) => {
        scenario.description = s2;
        db2.scenarios.upsert(scenario);
      } }), import_mithril3.default(Tabs, {
        Opportunity: import_mithril3.default(OpportunityView, {
          assessment: scenario.opportunity,
          update: (o) => {
            db2.scenarios.upsert(scenario);
          }
        }),
        Roadmap: import_mithril3.default(RoadmapView, {
          roadmap: scenario.roadmap,
          update: (r) => {
            scenario.roadmap = r;
            db2.scenarios.upsert(scenario);
          }
        })
      }));
    }
  };
}
var OpportunitySummary = {
  view({ attrs: { opportunity, update } }) {
    return import_mithril3.default("div.opportunity", import_mithril3.default(AssessmentOutputsView, { assessment: opportunity }), import_mithril3.default("div.inputs", import_mithril3.default(AssessmentInputsView, { assessment: opportunity, update })));
  }
};
var ScenarioSummary = {
  view: ({ attrs: { scenario, update } }) => {
    return import_mithril3.default("div.scenario-summary", import_mithril3.default("div.top-bar", import_mithril3.default(CE, { selector: "span.name", onchange: (s2) => {
      scenario.name = s2;
      update(scenario);
    }, value: scenario.name }), import_mithril3.default("button", import_mithril3.default("a", { href: `#!/scenario/${scenario.id}` }, ">"))), import_mithril3.default(OpportunitySummary, { opportunity: scenario.opportunity, update: (q) => {
      scenario.opportunity.set(q.name, q);
      update(scenario);
    } }));
  }
};
var OpportunityView = {
  view({ attrs: { assessment, update } }) {
    return import_mithril3.default("div.opportunity", import_mithril3.default(FormulaText, { formula: assessment.model.formulaString(), update: (s2) => {
      assessment.model = new Formula(s2);
      update(assessment);
    } }), import_mithril3.default(FormulaInputView, { assessment }), import_mithril3.default("div.rationales", map_default((input) => !isCertain(input) && import_mithril3.default("div.input-rationale", import_mithril3.default(QuantityView, { quantity: input, update: (quantity, prop4, value5) => {
      assessment.patch(input.name, { [prop4]: value5 });
      update(assessment);
    } })), values_default(assessment.inputs))));
  }
};

// client/viewmodel.ts
var import_mithril4 = __toESM(require_mithril(), 1);
function serialize(db3) {
  return {
    ideas: map5(db3.ideas, (idea) => idea.serialize()),
    scenarios: map5(db3.scenarios, (scenario) => scenario.serialize())
  };
}

class IdeaT extends IndexedSet {
  constructor() {
    super(...arguments);
  }
  id(i) {
    return i.id;
  }
}

class ScenarioT extends IndexedSet {
  id(s2) {
    return s2.id;
  }
  constructor(iterable) {
    super(iterable);
    this.addIndex((s2) => s2.idea, "idea");
  }
}

class Actions {
  static save(DB) {
    const data2 = serialize(DB);
    console.log("[INFO] Actions.save", data2);
    import_mithril4.default.request({
      method: "PUT",
      url: "/save",
      body: data2
    }).then((data3) => {
      return data3;
    });
  }
  static load() {
    return import_mithril4.default.request({ method: "GET", url: "/load" }).then((data2) => {
      console.log("[INFO] Actions.load: Data received ", data2);
      const result = {
        ideas: new IdeaT(data2.ideas.map(Idea.deserialize)),
        scenarios: new ScenarioT(data2.scenarios.map(Scenario.deserialize))
      };
      console.log("[INFO] Actions.load: Parsed result", result);
      return result;
    });
  }
}

// client/index.ts
var DB;
var Frame2 = (...views2) => ({
  view: ({ attrs }) => import_mithril5.default("div.app", import_mithril5.default("div.nav-bar", import_mithril5.default("button.save", { onclick: () => Actions.save(DB) }, "Save")), ...views2.map((x2) => import_mithril5.default(x2, attrs)))
});
Actions.load().then((data2) => {
  DB = data2;
  console.log("[INFO] Initial DB is: ", DB);
  import_mithril5.default.route(document.getElementById("app"), "/", {
    "/": Frame2(MainView(DB)),
    "/idea/:id": Frame2(IdeaView(DB)),
    "/scenario/:id": Frame2(ScenarioView(DB))
  });
});
