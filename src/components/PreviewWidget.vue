<template>
  <div class="column is-full">
    <!-- Panel Header -->
    <div
      class="panel-heading pointer"
      style="padding:.25em .75em"
      @click="togglePanel"
    >
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <strong>Step 3:</strong>
          </div>
          <!-- PREVIEW Button -->
          <div class="level-item">
            <a class="button is-info is-outlined" @click="preview">
              <span><strong>Preview</strong></span>
              <b-icon icon="sync" size="is-small" />
            </a>
          </div>
          <div class="level-item">
            <strong>and</strong>
          </div>
          <!-- GENERATE Button -->
          <div class="level-item">
            <a class="button is-info is-outlined" @click="generateDiagram">
              <span><strong>Generate Diagram</strong></span>
              <b-icon icon="external-link-alt" size="is-small" />
            </a>
          </div>
        </div>
        <!-- Panel Icons -->
        <div class="level-right">
          <div class="level-item">
            <b-icon :icon="isOpen ? 'angle-down' : 'angle-up'" size="is-small">
            </b-icon>
          </div>
        </div>
      </div>
    </div>
    <!-- Panel Box -->
    <div
      class="box"
      v-bind:style="{
        'border-radius': '0px',
        margin: '1px',
        display: isOpen ? 'block' : 'none'
      }"
    >
      <!-- DRAWIO IFRAME -->
      <div class="iframe-container">
        <iframe
          ref="preview"
          src="./drawio/index.html"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import * as MapWorker from "worker-loader!../transform/workers/map_worker";

export default {
  props: ["getData", "getConfigs"],
  data() {
    return {
      isOpen: true,
      toggleLock: false,
      iframe: null,
      myWorker: null
    };
  },
  methods: {
    // @vuese
    // Generates a new diagram in a new tab with Drawio
    generateDiagram: function() {
      this.toggleLock = true;
      let configs = this.getConfigs();
      let data = this.getData();
      this.myWorker.postMessage([configs, data, "generate"]);
    },
    togglePanel: function() {
      if (this.toggleLock) {
        this.toggleLock = false;
      } else {
        this.isOpen = !this.isOpen;
      }
    },
    receiveXML(result) {
      if (result.data[0] === "preview" && this.iframe) {
        this.iframe.createGraph(result.data[1]);
      } else {
        let win = window.open("./drawio/index.html");
        win.onload = function() {
          win.createGraph(result.data[1]);
          win.edit();
        };
      }
    },
    preview() {
      /*eslint no-console: ["error", {"allow": ["log"]}] */
      if (this.isOpen) {
        this.toggleLock = true;
      }
      let configs = this.getConfigs();
      let data = this.getData();
      this.myWorker.postMessage([configs, data, "preview"]);
    }
  },
  mounted: function() {
    this.iframe = this.$refs.preview.contentWindow;
  },
  created() {
    if (window.Worker) {
      this.myWorker = new MapWorker();
      this.myWorker.onmessage = this.receiveXML;
    }
  },
  beforeDestroy() {
    this.myWorker.terminate();
  }
};
</script>
<style>
.panel-heading.pointer {
  cursor: pointer;
}

.iframe-container {
  overflow: hidden;
  padding-top: 56.25%;
  position: relative;
}

.iframe-container iframe {
  border: 0;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

/* 4x3 Aspect Ratio */
.iframe-container-4x3 {
  padding-top: 75%;
}
</style>
