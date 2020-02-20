<template>
  <!-- Main Application -->
  <div class="columns is-multiline add-space">
    <!-- Original Data Widget -->
    <PanelBlock
      @toggle="bool => (dataAOpen = bool)"
      :widthClass="dataBOpen && dataAOpen ? 'is-half' : 'is-full'"
    >
      <template #title>
        Step 1: Upload Scan file
      </template>
      <template #content>
        <DataWidget :data.sync="ips" />
      </template>
    </PanelBlock>
    <!-- Subnet Ranges Data Widget -->
    <PanelBlock
      :widthClass="dataBOpen && dataAOpen ? 'is-half' : 'is-full'"
      @toggle="bool => (dataBOpen = bool)"
    >
      <template #title>
        Step 2: Upload Subnet List
      </template>
      <template #content>
        <DataWidget :data.sync="subnets" />
      </template>
    </PanelBlock>
    <!-- Output Data Widget -->
    <PanelBlock>
      <template #dynamicTitle>
        <div class="level-item">
          <strong>Step 3:</strong>
        </div>
        <div class="level-item">
          <span
            class="button is-info is-outlined"
            @click.stop="extractIPAdresses"
          >
            <strong>Extract</strong>
          </span>
        </div>
        <div class="level-item">
          <strong>IP Addresses</strong>
        </div>
        <div class="level-item" v-if="output.sheets.length > 0">
          <span class="button is-info is-outlined" @click="downloadConfigs">
            <strong>Download Map Configurations</strong>
            <b-icon icon="download" />
          </span>
        </div>
        <div class="level-item" v-if="output.sheets.length > 0">
          <span class="button is-info is-outlined is-fullwidth" @click.stop>
            <b-icon icon="sliders-h" />
          </span>
        </div>
        <a ref="configdownloader" style="display:none" />
      </template>
      <template #content>
        <!-- Loading Data -->
        <div class="container has-text-right" v-if="isLoading">
          <b-icon icon="spinner" custom-class="fa-pulse" />
        </div>
        <DataWidget :data.sync="output" outputOnly />
      </template>
    </PanelBlock>
  </div>
</template>

<script>
import DataWidget from "../components/DataWidget.vue";
import PanelBlock from "../components/templates/PanelBlock.vue";
import * as ExtractWorker from "worker-loader!../transform/workers/extract_worker";
import configOptions from "../transform/configs/configs.js";

export default {
  name: "ExtractView",
  components: { DataWidget, PanelBlock },
  data() {
    return {
      ips: {
        sheets: [],
        headers: [],
        customHeaders: [],
        sheetIndex: 0,
        files: []
      },
      subnets: {
        sheets: [],
        headers: [],
        customHeaders: [],
        sheetIndex: 0,
        files: []
      },
      output: {
        sheets: [],
        headers: [],
        customHeaders: [],
        sheetIndex: 0,
        files: []
      },
      myWorker: null,
      cidrs: null,
      dataAOpen: true,
      dataBOpen: true,
      isLoading: false
    };
  },
  methods: {
    // @vuese
    // Pulls IP Address that fall into a list of subnets
    extractIPAdresses() {
      /*eslint no-console: ["error", {"allow": ["log"]}] */
      if (this.ips.sheets.length == 0) {
        this.$buefy.notification.open({
          duration: 3000,
          message: `Missing Data For Excel 1`,
          type: "is-danger",
          hasIcon: true
        });
      } else if (this.subnets.sheets.length == 0) {
        this.$buefy.notification.open({
          duration: 3000,
          message: `Missing Data For Excel 2`,
          type: "is-danger",
          hasIcon: true
        });
      } else {
        this.isLoading = true;
        this.output.files.splice(0, this.output.files.length);
        this.output.sheets.splice(0, this.output.sheets.length);
        this.output.headers.splice(0, this.output.headers.length);
        this.output.customHeaders.splice(0, this.output.headers.length);
        this.myWorker.postMessage([this.subnets.sheets, this.ips]);
      }
    },
    updateOutput(result) {
      this.isLoading = false;
      let tmp = result.data[0];
      this.cidrs = result.data[1];
      this.output.headers.push(...tmp.headers);
      this.output.customHeaders.push(...tmp.customHeaders);
      this.output.files.push(...tmp.files);
      this.output.fileName = tmp.fileName;
      this.output.sheets.push(tmp.sheets);
    },
    downloadConfigs() {
      let configs = [];
      let cidrs = this.cidrs;
      for (let i = 0; i < cidrs.length; i++) {
        const cidr = cidrs[i];
        let tmp = JSON.parse(JSON.stringify(configOptions[0]));
        tmp.id = Date.now() + i;
        tmp.label = cidr;
        tmp.title = cidr;
        tmp.commands.push({
          action: "Filter",
          cidr: cidr,
          sheet: "",
          column: "",
          id: tmp.id
        });
        configs.push(tmp);
      }
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(configs));
      this.$refs.configdownloader.setAttribute("href", dataStr);
      this.$refs.configdownloader.setAttribute("download", "configs.json");
      this.$refs.configdownloader.click();
    }
  },
  created() {
    if (window.Worker) {
      this.myWorker = new ExtractWorker();
      this.myWorker.onmessage = this.updateOutput;
    }
  },
  beforeDestroy() {
    this.myWorker.terminate();
  }
};
</script>
