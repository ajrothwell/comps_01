//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var script = {
  name: 'Badge',
  props: {
    'slots': {
      type: Object,
      default: function() { return {} }
    },
    'options': {
      type: Object,
      default: function() { return {} }
    },
    'item': {
      type: Object,
      default: function() { return {} }
    },
  },
  computed: {
    nullValue: function nullValue() {
      var options = this.options || {};
      return options.nullValue;
    },
    style: function style() {
      var titleBackgroundValOrFn = (this.options || {}).titleBackground;
      var titleBackground;

      if (titleBackgroundValOrFn) {
        if (typeof titleBackgroundValOrFn === 'function') {
          titleBackground = titleBackgroundValOrFn(this.$store.state);
        } else {
          titleBackground = titleBackgroundValOrFn;
        }
      } else {
        titleBackground = '#444';
      }

      return { background: titleBackground };
    },
  },
  methods: {
    evaluateSlot: function evaluateSlot(valOrGetter, transforms, nullValue) {
      var this$1 = this;
      if ( transforms === void 0 ) transforms = [];
      if ( nullValue === void 0 ) nullValue = '';

      // console.log('evaluateSlot is running, valOrGetter:', valOrGetter);
      // check for null val/getter
      if (!valOrGetter) {
        return valOrGetter;
      }

      var valOrGetterType = typeof valOrGetter;
      var val;

      // fn
      if (valOrGetterType === 'function') {
        var state = this.$store.state;
        var controller = this.$controller;
        var getter = valOrGetter;
        var item = this.item;

        if (item) {
          val = getter(state, item, controller);
        } else {
          // console.log('evaluateSlot, about to get value');
          val = getter(state);
          // console.log('state:', state, 'val:', val);
        }
      } else {
        val = valOrGetter;
      }

      // format nulls but not falses
      if (val === false) ; else if (!val) {
        return nullValue;
      }

      // apply transforms
      var loop = function () {
        // get transform definition from config by name
        var transformKey = list[i];

        var transform = this$1.$config.transforms[transformKey];
        // make object of (relevant) globals by filtering window object
        var globals = (void 0);
        var globalKeys = transform.globals;
        if (globalKeys) {
          globals = Object.keys(window)
                        .filter(function (key) { return globalKeys.includes(key); })
                        .reduce(function (obj, key) {
                            obj[key] = window[key];
                            return obj;
                        }, {});
        }
        // run transform
        var fn = transform.transform;
        val = fn(val, globals);
      };

      for (var i = 0, list = transforms; i < list.length; i += 1) loop();

      return val;
    },
  },
};

function normalizeComponent(compiledTemplate, injectStyle, defaultExport, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, isShadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof isShadowMode === 'function') {
        createInjectorSSR = createInjector;
        createInjector = isShadowMode;
        isShadowMode = false;
    }
    // Vue.extend constructor export interop
    var options = typeof defaultExport === 'function' ? defaultExport.options : defaultExport;
    // render functions
    if (compiledTemplate && compiledTemplate.render) {
        options.render = compiledTemplate.render;
        options.staticRenderFns = compiledTemplate.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    var hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (injectStyle) {
                injectStyle.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (injectStyle) {
        hook = isShadowMode
            ? function () {
                injectStyle.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
            }
            : function (context) {
                injectStyle.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            var originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            var existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return defaultExport;
}

var isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return function (id, style) { return addStyle(id, style); };
}
var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};
function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        var code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                { style.element.setAttribute('media', css.media); }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            var index = style.ids.size - 1;
            var textNode = document.createTextNode(code);
            var nodes = style.element.childNodes;
            if (nodes[index])
                { style.element.removeChild(nodes[index]); }
            if (nodes.length)
                { style.element.insertBefore(textNode, nodes[index]); }
            else
                { style.element.appendChild(textNode); }
        }
    }
}

/* script */
var __vue_script__ = script;
// For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
script.__file = "C:\\Users\\andy.rothwell\\Projects\\comps_01\\src\\Badge.vue";

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "center" },
    [
      _c("div", { staticClass: "mb-badge panel" }, [
        _c("div", { staticClass: "mb-badge-header", style: _vm.style }, [
          _vm._v(
            "\n      " + _vm._s(_vm.evaluateSlot(_vm.slots.title)) + "\n    "
          )
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "mb-badge-body" }, [
          _c("h1", [_vm._v(_vm._s(_vm.evaluateSlot(_vm.slots.value)))]),
          _vm._v(" "),
          _c("strong", [
            _vm._v(_vm._s(_vm.evaluateSlot(_vm.slots.description)))
          ])
        ])
      ]),
      _vm._v(" "),
      _vm.options && _vm.options.externalLink
        ? _c("external-link", {
            attrs: { options: _vm.options.externalLink, type: "badge" }
          })
        : _vm._e()
    ],
    1
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-54a4ea54_0", { source: "\n.mb-badge[data-v-54a4ea54] {\n  /*width: 300px;*/\n  padding: 0;\n  margin: 0 auto;\n  margin-bottom: inherit;\n}\n@media (max-width: 640px) {\n.mb-badge[data-v-54a4ea54] {\n    width: 100%;\n}\n}\n\n/*REVIEW this should use foundation classes*/\n@media (min-width: 640px) {\n.mb-badge[data-v-54a4ea54] {\n    width: 325px;\n}\n}\n.mb-badge-header[data-v-54a4ea54] {\n  color: #fff;\n  font-weight: bold;\n  text-align: center;\n  padding-top: 2px;\n  padding-bottom: 2px;\n}\n.mb-badge-body[data-v-54a4ea54] {\n  padding: 12px;\n}\n.mb-badge-body > h1[data-v-54a4ea54] {\n  margin: 0;\n  margin-bottom: 5px;\n}\n", map: {"version":3,"sources":["C:\\Users\\andy.rothwell\\Projects\\comps_01/C:\\Users\\andy.rothwell\\Projects\\comps_01\\src\\Badge.vue"],"names":[],"mappings":";AAmIA;EACA,gBAAA;EACA,UAAA;EACA,cAAA;EACA,sBAAA;AACA;AAEA;AACA;IACA,WAAA;AACA;AACA;;AAEA,4CAAA;AACA;AACA;IACA,YAAA;AACA;AACA;AAEA;EACA,WAAA;EACA,iBAAA;EACA,kBAAA;EACA,gBAAA;EACA,mBAAA;AACA;AAEA;EACA,aAAA;AACA;AAEA;EACA,SAAA;EACA,kBAAA;AACA","file":"Badge.vue","sourcesContent":["<template>\r\n  <!-- REVIEW this uses patterns -->\r\n  <div class=\"center\">\r\n    <div class=\"mb-badge panel\">\r\n      <div class=\"mb-badge-header\" :style=\"style\">\r\n        {{ evaluateSlot(slots.title) }}\r\n      </div>\r\n      <div class=\"mb-badge-body\">\r\n        <h1>{{ evaluateSlot(slots.value) }}</h1>\r\n        <strong>{{ evaluateSlot(slots.description) }}</strong>\r\n      </div>\r\n    </div>\r\n    <external-link v-if=\"options && options.externalLink\"\r\n                   :options=\"options.externalLink\"\r\n                   :type=\"'badge'\"\r\n    />\r\n    <!-- <div class=\"external-link\">\r\n      <a v-if=\"options && options.externalLink\"\r\n      :href=\"externalLinkHref\"\r\n      class=\"external external-link\"\r\n      target=\"_blank\"\r\n      >\r\n      {{ externalLinkText }}\r\n      </a>\r\n    </div> -->\r\n  </div>\r\n</template>\r\n\r\n<script>\r\n\r\n  export default {\r\n    name: 'Badge',\r\n    props: {\r\n      'slots': {\r\n        type: Object,\r\n        default: function() { return {} }\r\n      },\r\n      'options': {\r\n        type: Object,\r\n        default: function() { return {} }\r\n      },\r\n      'item': {\r\n        type: Object,\r\n        default: function() { return {} }\r\n      },\r\n    },\r\n    computed: {\r\n      nullValue() {\r\n        const options = this.options || {};\r\n        return options.nullValue;\r\n      },\r\n      style() {\r\n        const titleBackgroundValOrFn = (this.options || {}).titleBackground;\r\n        let titleBackground;\r\n\r\n        if (titleBackgroundValOrFn) {\r\n          if (typeof titleBackgroundValOrFn === 'function') {\r\n            titleBackground = titleBackgroundValOrFn(this.$store.state);\r\n          } else {\r\n            titleBackground = titleBackgroundValOrFn;\r\n          }\r\n        } else {\r\n          titleBackground = '#444';\r\n        }\r\n\r\n        return { background: titleBackground };\r\n      },\r\n    },\r\n    methods: {\r\n      evaluateSlot(valOrGetter, transforms = [], nullValue = '') {\r\n        // console.log('evaluateSlot is running, valOrGetter:', valOrGetter);\r\n        // check for null val/getter\r\n        if (!valOrGetter) {\r\n          return valOrGetter;\r\n        }\r\n\r\n        const valOrGetterType = typeof valOrGetter;\r\n        let val;\r\n\r\n        // fn\r\n        if (valOrGetterType === 'function') {\r\n          const state = this.$store.state;\r\n          const controller = this.$controller;\r\n          const getter = valOrGetter;\r\n          const item = this.item;\r\n\r\n          if (item) {\r\n            val = getter(state, item, controller);\r\n          } else {\r\n            // console.log('evaluateSlot, about to get value');\r\n            val = getter(state);\r\n            // console.log('state:', state, 'val:', val);\r\n          }\r\n        } else {\r\n          val = valOrGetter;\r\n        }\r\n\r\n        // format nulls but not falses\r\n        if (val === false) {\r\n\r\n        } else if (!val) {\r\n          return nullValue;\r\n        }\r\n\r\n        // apply transforms\r\n        for (let transformKey of transforms) {\r\n          // get transform definition from config by name\r\n          const transform = this.$config.transforms[transformKey];\r\n          // make object of (relevant) globals by filtering window object\r\n          let globals;\r\n          const globalKeys = transform.globals;\r\n          if (globalKeys) {\r\n            globals = Object.keys(window)\r\n                          .filter(key => globalKeys.includes(key))\r\n                          .reduce((obj, key) => {\r\n                              obj[key] = window[key];\r\n                              return obj;\r\n                          }, {});\r\n          }\r\n          // run transform\r\n          const fn = transform.transform;\r\n          val = fn(val, globals);\r\n        }\r\n\r\n        return val;\r\n      },\r\n    },\r\n  };\r\n</script>\r\n\r\n<style scoped>\r\n  .mb-badge {\r\n    /*width: 300px;*/\r\n    padding: 0;\r\n    margin: 0 auto;\r\n    margin-bottom: inherit;\r\n  }\r\n\r\n  @media (max-width: 640px) {\r\n    .mb-badge {\r\n      width: 100%;\r\n    }\r\n  }\r\n\r\n  /*REVIEW this should use foundation classes*/\r\n  @media (min-width: 640px) {\r\n    .mb-badge {\r\n      width: 325px;\r\n    }\r\n  }\r\n\r\n  .mb-badge-header {\r\n    color: #fff;\r\n    font-weight: bold;\r\n    text-align: center;\r\n    padding-top: 2px;\r\n    padding-bottom: 2px;\r\n  }\r\n\r\n  .mb-badge-body {\r\n    padding: 12px;\r\n  }\r\n\r\n  .mb-badge-body > h1 {\r\n    margin: 0;\r\n    margin-bottom: 5px;\r\n  }\r\n</style>\r\n"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = "data-v-54a4ea54";
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var component = normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    createInjector,
    undefined
  );

// Import vue component
console.log('component:', component);

// Declare install function executed by Vue.use()
function install(Vue) {
	if (install.installed) { return; }
	install.installed = true;
	Vue.component('MyComponent', component);
}

console.log('install:', install);

// Create module definition for Vue.use()
var plugin = {
	install: install,
};

// Auto-install when vue is found (eg. in browser via <script> tag)
var GlobalVue = null;
if (typeof window !== 'undefined') {
	GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue;
}
if (GlobalVue) {
	console.log('yes GlobalVue, plugin:', plugin);
	GlobalVue.use(plugin);
} else {
	console.log('no GlobalVue');
}

export default component;
export { install };
