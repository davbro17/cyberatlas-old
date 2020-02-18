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
          <DataWidget :data.sync="data" />
        </template>
      </PanelBlock>
      <!-- Configuration Widget -->
      <PanelBlock widthClass="" @toggle="bool => (configOpen = bool)">
        <template #title>
          Step 2: Filter Data and Configure Diagram
        </template>
        <template #content>
          <ConfigWidget :configs.sync="configs" :data="data" />
        </template>
      </PanelBlock>
      <!-- Preview Widget -->
      <PreviewWidget :getData="sendData" :getConfigs="sendConfigs" />
    </div>
  </div>
</template>

<script>
import ConfigWidget from "../components/ConfigWidget.vue";
import DataWidget from "../components/DataWidget.vue";
import PreviewWidget from "../components/PreviewWidget.vue";
import PanelBlock from "../components/templates/PanelBlock.vue";

export default {
  name: "app",
  components: {
    DataWidget,
    ConfigWidget,
    PreviewWidget,
    PanelBlock
  },
  data() {
    return {
      configs: [],
      data: {
        sheets: [],
        headers: [],
        customHeaders: [],
        sheetIndex: 0,
        files: []
      },
      configOpen: true,
      dataOpen: true
    };
  },
  methods: {
    // @vuese
    // Returns pointer to network data object, App.data
    sendData() {
      /*eslint no-console: ["error", {"allow": ["log"]}] */
      return this.data;
    },
    // @vuese
    // Returns pointer to configurations object, App.configs
    sendConfigs() {
      return this.configs;
    }
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
