<template>
  <!-- Add NEW OBJECT Interface -->
  <div class="column">
    <div class="field">
      <span class="decision">
        Create A New
      </span>
      <!-- Dropdown Select -->
      <div class="select is-info">
        <select v-model="selected">
          <option
            v-for="(option, index) in options"
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
        <strong>Add</strong>
      </span>
    </div>
    <!-- Drag N Drop Interface -->
    <div class="container has-text-centered" style="margin-top:1.5em;">
      <b-upload v-model="files" drag-drop multiple type="is-info">
        <div
          class="content has-text-centered"
          width="100%"
          style="padding-bottom:2.28em"
        >
          <p>
            <b-icon icon="upload" size="is-large"> </b-icon>
          </p>
          <p>OR Upload a Configuration File</p>
        </div>
      </b-upload>
    </div>
  </div>
</template>

<script>
import GenerateSchema from "generate-schema";
import JSONschema from "jsonschema";

export default {
  props: ["configs"],
  data() {
    return {
      files: [],
      options: [
        {
          name: "Subnet",
          icon: "network-wired",
          component: "SubnetConfig",
          id: Date.now(),
          lines: [],
          commands: [],
          style: {
            fillColor: "#d5e8d4",
            rounded: 1
          },
          geometry: {
            x: 0,
            y: 0,
            width: 810,
            height: 100
          },
          margin: {
            left: 0,
            top: 0,
            bottom: 0,
            right: 0
          },
          padding: {
            top: 10,
            left: 10
          },
          device: {
            columns: 10,
            width: 70,
            height: 70,
            padding: {
              top: 30,
              left: 10
            },
            style: {
              shape: "mxgraph.citrix.desktop",
              verticalLabelPosition: "bottom",
              aspect: "fixed",
              html: 1,
              verticalAlign: "top",
              align: "center",
              outlineConnect: 0
            },
            background: {
              verticalLabelPosition: "bottom",
              aspect: "fixed",
              html: 1,
              verticalAlign: "top",
              fillColor: "none",
              strokeColor: "none",
              align: "center",
              outlineConnect: 0
            }
          }
        },
        {
          name: "Text Box",
          icon: "comment-alt",
          component: "TextBoxConfig",
          id: Date.now(),
          elements: [],
          geometry: {
            x: 0,
            y: 0,
            width: 200,
            height: 100
          },
          style: {
            rounded: 1,
            whitespace: "wrap",
            html: 1
          }
        },
        {
          name: "Cloud",
          icon: "cloud",
          component: "CloudConfig",
          id: Date.now()
        },
        {
          name: "Network Device",
          icon: "ethernet",
          component: "NetDeviceConfig",
          id: Date.now()
        },
        {
          name: "Networks",
          icon: "project-diagram",
          component: "NetworksConfig",
          id: Date.now()
        },
        {
          name: "Collection",
          icon: "th",
          component: "CollectionConfig",
          id: Date.now()
        }
      ],
      selected: 0,
      schema: null
    };
  },
  methods: {
    createDiagramObject() {
      /* eslint-disable no-console */
      let tmp = JSON.parse(JSON.stringify(this.options[this.selected]));
      tmp.id = Date.now();
      tmp.title = tmp.name;
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
      for (let i = 0; i < this.files.length; i++) {
        let file = this.files[i];
        let reader = new FileReader();
        reader.onload = this.loadJSON;
        reader.readAsText(file);
        this.files.splice(i, 1);
      }
    }
  },
  mounted() {
    // Generate JSON schema from this.options
    this.schema = GenerateSchema.json("Configurations", this.options);
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
</style>
