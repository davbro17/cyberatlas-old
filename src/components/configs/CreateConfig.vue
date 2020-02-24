<template>
  <div class="column">
    <!-- Tabs -->
    <b-tabs type="is-boxed">
      <!-- Create New Diagram Object Interface -->
      <b-tab-item label="Create" icon="hammer">
        <div class="field">
          <span class="decision">
            Create A New
          </span>
          <!-- Dropdown Select -->
          <div class="select is-info">
            <select v-model="selected">
              <option
                v-for="(option, index) in defaults"
                v-bind:key="index"
                :value="index"
              >
                {{ option.name }}
              </option>
            </select>
          </div>
          <!-- ADD Button -->
          <span
            class="button is-info is-outlined decision"
            @click="createDiagramObject"
          >
            <b-icon icon="plus" />
          </span>
        </div>
        <!-- Drag N Drop Interface -->
        <div class="container has-text-centered" style="margin-top:1.5em;">
          <b-upload
            v-model="files"
            drag-drop
            multiple
            type="is-info"
            accept=".json"
          >
            <div
              class="content has-text-centered"
              width="100%"
              style="padding-bottom:3px;"
            >
              <span>
                <b-icon icon="upload" size="is-large" />
              </span>
              <span>OR Upload a Configuration File</span>
            </div>
          </b-upload>
        </div>
      </b-tab-item>
      <b-tab-item label="Defaults" icon="sliders-h">
        <DefaultWidget
          :configDefaults.sync="defaults"
          :configs.sync="configs"
          :defaults.sync="tracker"
        />
      </b-tab-item>
      <b-tab-item label="Layout" icon="object-group"> </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import GenerateSchema from "generate-schema";
import JSONschema from "jsonschema";

import DefaultWidget from "../templates/DefaultsWidget.vue";

export default {
  props: {
    configs: {
      type: Array,
      required: true
    },
    defaults: {
      type: Array,
      required: true
    },
    tracker: {
      type: Object,
      required: true
    },
    layout: {
      type: Object,
      required: true
    }
  },
  components: { DefaultWidget },
  data() {
    return {
      files: [],
      selected: 0,
      schema: null
    };
  },
  methods: {
    createDiagramObject() {
      /* eslint-disable no-console */
      let tmp = JSON.parse(JSON.stringify(this.defaults[this.selected]));
      tmp.id = Date.now();
      this.configs.push(tmp);
    },
    loadJSON(event) {
      try {
        let newConfigs = JSON.parse(event.target.result);
        let validation = JSONschema.validate(newConfigs, this.schema);
        if (validation.valid) {
          for (let i = 0; i < newConfigs.length; i++) {
            this.sanitizeConfig(newConfigs[i], i);
          }
        } else {
          for (let i = 0; i < validation.errors.length; i++) {
            let error = validation.errors[i];
            console.log(`${error.property} ${error.message}`);
          }
        }
      } catch {
        console.log("JSON FILE ERROR!");
      }
    },
    // @vuese
    // Inspect new configuration for ID collision and fix collisions
    // @arg config[OBJECT]
    sanitizeConfig(config, offset) {
      let check = this.configs.filter(c => c.id == config.id);
      if (check.length) {
        console.log("ID HIT!");
        console.log(check);
        console.log(config.id);
        config.id = Date.now() + offset;
      }
      this.configs.push(config);
    },
    resetFiles() {
      this.files.splice(0, this.files.length);
    }
  },
  watch: {
    files() {
      if (this.files.length > 0) {
        for (let i = 0; i < this.files.length; i++) {
          let file = this.files[i];
          let reader = new FileReader();
          reader.onload = this.loadJSON;
          reader.readAsText(file);
        }
        this.files.splice(0, this.files.length);
      }
    }
  },
  mounted() {
    // Generate JSON schema from this.defaults
    this.schema = GenerateSchema.json("Configurations", this.defaults);
  }
};
</script>
<style scoped>
.decision {
  display: inline-block;
  padding-top: calc(0.4em - 1px);
  margin-right: 0.4em;
  margin-left: 0.4em;
}
::v-deep .tabs li.is-active a {
  color: #167df0;
}
</style>
