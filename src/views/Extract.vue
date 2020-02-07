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
import { filterRows, extractSubnets } from "../transform/utility/extract.js";

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
        const ipData = JSON.parse(JSON.stringify(this.ips));
        const subnets = extractSubnets(this.subnets.sheets);
        const tmp = filterRows(ipData.sheets, subnets);
        this.output = ipData;
        this.output.sheets.splice(0, tmp.length, tmp);
      }
    }
  }
};
</script>
