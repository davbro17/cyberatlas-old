<template>
  <div id="app">
    <!-- Main Application -->
    <div class="columns is-multiline add-space">
      <!-- Data Widget -->
      <PanelBlock
        @toggle="bool => (dataOpen = bool)"
        :widthClass="configOpen && dataOpen ? 'is-half' : 'is-full'"
      >
        <template #title>
          Step 1: Upload Scan File
        </template>
        <template #content>
          <DataWidget :data.sync="data" :actions="actions" />
        </template>
      </PanelBlock>
      <!-- Configuration Widget -->
      <PanelBlock widthClass="" @toggle="bool => (configOpen = bool)">
        <template #title>
          Step 2: Filter Data and Configure Diagram
        </template>
        <template #content>
          <ConfigWidget v-bind.sync="settings" :data="data" />
        </template>
      </PanelBlock>
      <!-- Preview Widget -->
      <PanelBlock>
        <template #dynamicTitle>
          <div class="level-item">
            <strong>Step 3:</strong>
          </div>
          <!-- PREVIEW Button -->
          <div class="level-item">
            <a class="button is-info is-outlined" @click.stop="preview">
              <span><strong>Preview</strong></span>
              <b-icon
                icon="sync"
                size="is-small"
                :custom-class="previewLoading ? 'fa-spin' : ''"
              />
            </a>
          </div>
          <div class="level-item">
            <strong>and</strong>
          </div>
          <!-- GENERATE Button -->
          <div class="level-item">
            <a class="button is-info is-outlined" @click.stop="generateDiagram">
              <span><strong>Generate Diagram</strong></span>
              <b-icon
                icon="external-link-alt"
                size="is-small"
                :custom-class="generateLoading ? 'fa-spin' : ''"
              />
            </a>
          </div>
        </template>
        <template #content>
          <!-- Loading Data -->
          <PreviewWidget :input="output" :configs="settings.configs" />
        </template>
      </PanelBlock>
    </div>
  </div>
</template>

<script>
import ConfigWidget from "../components/ConfigWidget.vue";
import DataWidget from "../components/DataWidget.vue";
import PreviewWidget from "../components/PreviewWidget.vue";
import PanelBlock from "../components/templates/PanelBlock.vue";
import * as MapWorker from "worker-loader!../transform/workers/map_worker";
import options from "../transform/defaults/configs.js";
import defaultLayout from "../transform/defaults/layout.js";

export default {
  name: "Map",
  props: {
    actions: {
      type: Object,
      default() {
        return {};
      }
    },
    transfer: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  components: {
    DataWidget,
    ConfigWidget,
    PreviewWidget,
    PanelBlock
  },
  data() {
    return {
      settings: {
        configs: [],
        defaults: options,
        tracker: {},
        layout: defaultLayout
      },
      data: {
        sheets: [],
        headers: [],
        customHeaders: [],
        sheetIndex: 0,
        fileName: "",
        files: []
      },
      configOpen: true,
      dataOpen: true,
      myWorker: null,
      output: "",
      previewLoading: false,
      generateLoading: false
    };
  },
  methods: {
    // @vuese
    // Generates a new diagram in a new tab with Drawio
    generateDiagram: function() {
      this.generateLoading = true;
      this.myWorker.postMessage([this.settings, this.data, "generate"]);
    },
    receiveXML(result) {
      if (result.data[0] === "preview") {
        this.previewLoading = false;
        this.output = result.data[1];
      } else {
        this.generateLoading = false;
        let win = window.open("./drawio/index.html");
        win.onload = function() {
          win.createGraph(result.data[1]);
          win.edit();
        };
      }
    },
    preview() {
      /*eslint no-console: ["error", {"allow": ["log"]}] */
      this.previewLoading = true;
      this.myWorker.postMessage([this.settings, this.data, "preview"]);
    }
  },
  created() {
    if (window.Worker) {
      this.myWorker = new MapWorker();
      this.myWorker.onmessage = this.receiveXML;
    }
  },
  mounted() {
    if (this.transfer.input1 != null) {
      let data = this.data;
      let input = this.transfer.input1;
      this.$set(data, "sheets", input.sheets);
      this.$set(data, "headers", input.headers);
      this.$set(data, "customHeaders", input.customHeaders);
      this.$set(data, "sheetIndex", input.sheetIndex);
      this.$set(data, "files", input.files);
      this.$set(data, "fileName", input.fileName);
      // Delete the old references to the transferred data
      this.$set(this.transfer, "input1", null);
    }
    // Double check for unintended data transfers
    if ("input2" in this.transfer) {
      // Delete the data
      this.$set(this.transfer, "input2", null);
    }
    window.scrollTo(0, 0);
  },
  beforeDestroy() {
    this.myWorker.terminate();
  }
};
</script>

<style>
.add-space {
  padding: 0.5em 1em;
}
p > a {
  color: #167df0 !important;
}
</style>
