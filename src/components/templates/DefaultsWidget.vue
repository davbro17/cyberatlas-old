<template>
  <div>
    <div class="column" style="padding-bottom:0em;">
      <b-field grouped>
        <b-field
          label="Configure"
          horizontal
          type="is-info"
          message="Object"
          grouped
        >
          <b-select v-model="selected">
            <option
              v-for="(config, index) in configDefaults"
              :value="config"
              :key="index"
            >
              {{ config.name }}
            </option>
          </b-select>
        </b-field>
        <div class="field">
          <p class="control">
            <button
              class="button is-info is-outlined"
              @click="forceChanges(selected)"
            >
              Force
            </button>
          </p>
          <p class="help is-info">Changes</p>
        </div>
        <div class="field">
          <p class="control">
            <button class="button is-info is-outlined" @click="forceAllChanges">
              Force All
            </button>
          </p>
          <p class="help is-info">Object Changes</p>
        </div>
      </b-field>
    </div>
    <component
      :is="selected.component"
      v-if="selected"
      :self.sync="selected"
      :defaults="defaults[selected.name]"
    />
  </div>
</template>

<script>
import SubnetConfig from "../../components/configs/SubnetConfig.vue";

// https://hackernoon.com/accessing-nested-objects-in-javascript-f02f1bd6387f
const getNestedObject = (nestedObj, pathArr) => {
  return pathArr.reduce(
    (obj, key) => (obj && obj[key] !== "undefined" ? obj[key] : undefined),
    nestedObj
  );
};

// https://stackoverflow.com/questions/6842795/dynamic-deep-setting-for-a-javascript-object
const setNestedObject = (obj, value, path) => {
  var i;
  for (i = 0; i < path.length - 1; i++) obj = obj[path[i]];
  if (obj[path[i]] instanceof Array) {
    obj[path[i]].push(...JSON.parse(JSON.stringify(value)));
  } else {
    obj[path[i]] = value;
  }
};

export default {
  components: { SubnetConfig },
  props: {
    configDefaults: {
      type: Array,
      required: true
    },
    defaults: {
      type: Object,
      required: true
    },
    force: {
      type: Boolean,
      default: false
    },
    configs: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      selected: null
    };
  },
  methods: {
    /*eslint no-console: ["error", {"allow": ["log"]}] */
    forceChanges(config) {
      for (let conf of this.configs) {
        if (conf.name === config.name) {
          const def = this.defaults[config.name];
          const desiredChanges = Object.keys(def).filter(k => def[k]);
          for (let path of desiredChanges) {
            const arrayPath = path.split(".");
            const confValue = getNestedObject(conf, arrayPath);
            const defValue = getNestedObject(config, arrayPath);
            if (confValue && defValue) {
              setNestedObject(conf, defValue, arrayPath);
            }
          }
        }
      }
    },
    forceAllChanges() {
      for (let config of this.configDefaults) {
        this.forceChanges(config);
      }
    }
  },
  mounted() {
    if (
      Object.entries(this.defaults).length === 0 &&
      this.defaults.constructor === Object
    ) {
      for (let config of this.configDefaults) {
        this.$set(this.defaults, config.name, {});
      }
    }
  }
};
</script>
