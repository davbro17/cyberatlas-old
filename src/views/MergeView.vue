<template>
  <!-- Main Application -->
  <div class="columns is-multiline add-space">
    <!-- Original Data Widget -->
    <PanelBlock
      @toggle="bool => (dataAOpen = bool)"
      :widthClass="dataBOpen && dataAOpen ? 'is-half' : 'is-full'"
    >
      <template #title>
        Step 1: Upload Excel Sheet
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
        Step 2: Upload Excel With Additional Fields
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
            <strong>Merge</strong>
          </span>
        </div>
        <div class="level-item">
          <strong>Excel Sheets</strong>
        </div>
        <div class="level-item">
          <span class="button is-info is-outlined is-fullwidth" @click.stop>
            <b-icon icon="sliders-h" />
          </span>
        </div>
      </template>
      <template #content>
        <DataWidget :data.sync="output" outputOnly />
      </template>
    </PanelBlock>
  </div>
</template>

<script>
import DataWidget from "../components/DataWidget.vue";
import PanelBlock from "../components/templates/PanelBlock.vue";
import * as ExtractWorker from "worker-loader!../transform/workers/extract_worker";

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
      dataBOpen: true
    };
  },
  methods: {
    // @vuese
    // Pulls IP Address that fall into a list of subnets
    extractIPAdresses() {
      /*eslint no-console: ["error", {"allow": ["log"]}] */
      if (this.ips.sheets.length == 0 || this.subnets.sheets.length == 0) {
        console.log("MISSING DATA");
      } else {
        this.output.files.splice(0, this.output.files.length);
        this.output.sheets.splice(0, this.output.sheets.length);
        this.output.headers.splice(0, this.output.headers.length);
        this.output.customHeaders.splice(0, this.output.headers.length);
        this.myWorker.postMessage([this.subnets.sheets, this.ips]);
      }
    },
    updateOutput(result) {
      let tmp = result.data[0];
      this.cidrs = result.data[1];
      this.output.headers.push(...tmp.headers);
      this.output.customHeaders.push(...tmp.customHeaders);
      this.output.files.push(...tmp.files);
      this.output.sheets.push(tmp.sheets);
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
