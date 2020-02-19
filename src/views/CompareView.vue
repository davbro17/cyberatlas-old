<template>
  <div id="app">
    <!-- Main Application -->
    <div class="columns is-multiline add-space">
      <!-- Original Data Widget -->
      <PanelBlock
        @toggle="bool => (dataAOpen = bool)"
        :widthClass="dataBOpen && dataAOpen ? 'is-half' : 'is-full'"
      >
        <template #title>
          Step 1: Upload Excel 1
        </template>
        <template #content>
          <DataWidget :data.sync="excelA" />
        </template>
      </PanelBlock>
      <!-- Subnet Ranges Data Widget -->
      <PanelBlock
        @toggle="bool => (dataAOpen = bool)"
        :widthClass="dataBOpen && dataAOpen ? 'is-half' : 'is-full'"
      >
        <template #title>
          Step 1: Upload Excel 2
        </template>
        <template #content>
          <DataWidget :data.sync="excelB" />
        </template>
      </PanelBlock>
      <!-- Output Data Widget -->
      <PanelBlock>
        <template #dynamicTitle>
          <div class="level-item">
            <strong>Step 3:</strong>
          </div>
          <div class="level-item">
            <span class="button is-info is-outlined" @click.stop="compareData">
              <strong>Generate</strong>
            </span>
          </div>
          <div class="level-item" @click.stop>
            <span>
              <b-dropdown aria-role="list" v-model="selected">
                <button class="button is-info is-outlined" slot="trigger">
                  <span
                    ><strong>{{ selected }}</strong>
                  </span>
                  <b-icon icon="caret-down"></b-icon>
                </button>
                <b-dropdown-item
                  aria-role="listitem"
                  v-for="(item, index) in options.filter(
                    (e, i) => e != selected
                  )"
                  :key="index"
                  :value="item"
                >
                  {{ item }}
                </b-dropdown-item>
              </b-dropdown>
            </span>
          </div>
        </template>
        <template #content>
          <DataWidget :data.sync="output" outputOnly />
        </template>
      </PanelBlock>
    </div>
  </div>
</template>

<script>
import DataWidget from "../components/DataWidget.vue";
import PanelBlock from "../components/templates/PanelBlock.vue";
import * as CompareWorker from "worker-loader!../transform/workers/compare_worker";

export default {
  name: "app",
  components: {
    DataWidget,
    PanelBlock
  },
  data() {
    return {
      excelA: {
        sheets: [],
        headers: [],
        customHeaders: [],
        sheetIndex: 0,
        files: []
      },
      excelB: {
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
      selected: "Similarities",
      options: ["Similarities", "Excel 1 Differences", "Excel 2 Differences"],
      dataAOpen: true,
      dataBOpen: true
    };
  },
  methods: {
    // @vuese
    // Takes two excel sheet of network objects and gets similarities & differences
    compareData() {
      /*eslint no-console: ["error", {"allow": ["log"]}] */
      if (this.excelA.sheets.length == 0) {
        this.$buefy.notification.open({
          duration: 3000,
          message: `Missing Data For Excel 1`,
          type: "is-danger",
          hasIcon: true
        });
      } else if (this.excelB.sheets.length == 0) {
        this.$buefy.notification.open({
          duration: 3000,
          message: `Missing Data For Excel 2`,
          type: "is-danger",
          hasIcon: true
        });
      } else {
        const index = this.options.findIndex(o => o === this.selected);
        this.output.files.splice(0, this.output.files.length);
        this.output.sheets.splice(0, this.output.sheets.length);
        this.output.headers.splice(0, this.output.headers.length);
        this.output.customHeaders.splice(0, this.output.headers.length);
        this.myWorker.postMessage([index, this.excelA, this.excelB]);
      }
    },
    // @vuese
    // Receive the output from the web worker and update the Output Excel Widget
    updateOutput(result) {
      let tmp = result.data;
      this.output.headers.push(...tmp.headers);
      this.output.customHeaders.push(...tmp.customHeaders);
      this.output.files.push(...tmp.files);
      this.output.fileName = tmp.fileName;
      this.output.sheets.push(tmp.sheets);
    }
  },
  created() {
    if (window.Worker) {
      this.myWorker = new CompareWorker();
      this.myWorker.onmessage = this.updateOutput;
    }
  },
  beforeDestroy() {
    this.myWorker.terminate();
  }
};
</script>
