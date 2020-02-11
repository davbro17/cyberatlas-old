<template>
  <div id="app">
    <!-- Main Application -->
    <div class="columns is-multiline add-space">
      <!-- Original Data Widget -->
      <DataWidget :configOpen="configOpen" :data.sync="ips">
        <template #title>
          Step 1: Upload Scan file
        </template>
      </DataWidget>
      <!-- Subnet Ranges Data Widget -->
      <DataWidget :configOpen="configOpen" :data.sync="subnets">
        <template #title>
          <strong>Step 2: Upload Subnet List</strong>
        </template>
      </DataWidget>
      <!-- Output Data Widget -->
      <DataWidget :data.sync="output" outputOnly>
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
        </template>
      </DataWidget>
    </div>
  </div>
</template>

<script>
import DataWidget from "../components/DataWidget.vue";
import * as ExtractWorker from "worker-loader!../transform/workers/extract_worker";

export default {
  name: "app",
  components: {
    DataWidget
  },
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
      configOpen: true
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
      let tmp = result.data;
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
