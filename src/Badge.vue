<template>
  <!-- REVIEW this uses patterns -->
  <div class="center">
    <div class="mb-badge panel">
      <div class="mb-badge-header" :style="style">
        {{ evaluateSlot(slots.title) }}
      </div>
      <div class="mb-badge-body">
        <h1>{{ evaluateSlot(slots.value) }}</h1>
        <strong>{{ evaluateSlot(slots.description) }}</strong>
      </div>
    </div>
    <external-link v-if="options && options.externalLink"
                   :options="options.externalLink"
                   :type="'badge'"
    />
    <!-- <div class="external-link">
      <a v-if="options && options.externalLink"
      :href="externalLinkHref"
      class="external external-link"
      target="_blank"
      >
      {{ externalLinkText }}
      </a>
    </div> -->
  </div>
</template>

<script>

  export default {
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
      nullValue() {
        const options = this.options || {};
        return options.nullValue;
      },
      style() {
        const titleBackgroundValOrFn = (this.options || {}).titleBackground;
        let titleBackground;

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
      evaluateSlot(valOrGetter, transforms = [], nullValue = '') {
        // console.log('evaluateSlot is running, valOrGetter:', valOrGetter);
        // check for null val/getter
        if (!valOrGetter) {
          return valOrGetter;
        }

        const valOrGetterType = typeof valOrGetter;
        let val;

        // fn
        if (valOrGetterType === 'function') {
          const state = this.$store.state;
          const controller = this.$controller;
          const getter = valOrGetter;
          const item = this.item;

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
        if (val === false) {

        } else if (!val) {
          return nullValue;
        }

        // apply transforms
        for (let transformKey of transforms) {
          // get transform definition from config by name
          const transform = this.$config.transforms[transformKey];
          // make object of (relevant) globals by filtering window object
          let globals;
          const globalKeys = transform.globals;
          if (globalKeys) {
            globals = Object.keys(window)
                          .filter(key => globalKeys.includes(key))
                          .reduce((obj, key) => {
                              obj[key] = window[key];
                              return obj;
                          }, {});
          }
          // run transform
          const fn = transform.transform;
          val = fn(val, globals);
        }

        return val;
      },
    },
  };
</script>

<style scoped>
  .mb-badge {
    /*width: 300px;*/
    padding: 0;
    margin: 0 auto;
    margin-bottom: inherit;
  }

  @media (max-width: 640px) {
    .mb-badge {
      width: 100%;
    }
  }

  /*REVIEW this should use foundation classes*/
  @media (min-width: 640px) {
    .mb-badge {
      width: 325px;
    }
  }

  .mb-badge-header {
    color: #fff;
    font-weight: bold;
    text-align: center;
    padding-top: 2px;
    padding-bottom: 2px;
  }

  .mb-badge-body {
    padding: 12px;
  }

  .mb-badge-body > h1 {
    margin: 0;
    margin-bottom: 5px;
  }
</style>
