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
          <DataWidget :data.sync="excelA" :actions="actions" />
        </template>
      </PanelBlock>
      <!-- Subnet Ranges Data Widget -->
      <PanelBlock
        @toggle="bool => (dataAOpen = bool)"
        :widthClass="dataBOpen && dataAOpen ? 'is-half' : 'is-full'"
      >
        <template #title>
          Step 2: Upload Excel 2
        </template>
        <template #content>
          <DataWidget :data.sync="excelB" :actions="actions" />
        </template>
      </PanelBlock>
      <!-- Output Data Widget -->
      <PanelBlock :Open="outputOpen" @toggle="bool => (outputOpen = bool)">
        <template #dynamicTitle>
          <div class="level-item">
            <strong>Step 3:</strong>
          </div>
          <div class="level-item">
            <span class="button is-info is-outlined" @click="compareData">
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
          <!-- Loading Data -->
          <div class="container has-text-centered" v-if="isLoading">
            <b-icon icon="spinner" custom-class="fa-pulse" />
          </div>
          <!-- Empty Data -->
          <div
            class="container has-text-centered"
            v-if="output.sheets.length == 0 && !isLoading"
          >
            Empty &#128577;
          </div>
          <DataWidget :data.sync="output" outputOnly :actions="actions" />
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
  data() {
    return {
      excelA: {
        sheets: [],
        headers: [],
        customHeaders: [],
        sheetIndex: 0,
        fileName: "",
        files: []
      },
      excelB: {
        sheets: [],
        headers: [],
        customHeaders: [],
        sheetIndex: 0,
        fileName: "",
        files: []
      },
      output: {
        sheets: [],
        headers: [],
        customHeaders: [],
        sheetIndex: 0,
        fileName: "",
        files: []
      },
      myWorker: null,
      selected: "Similarities",
      options: ["Similarities", "Excel 1 Differences", "Excel 2 Differences"],
      dataAOpen: true,
      dataBOpen: true,
      outputOpen: false,
      isLoading: false
    };
  },
  methods: {
    // @vuese
    // Takes two excel sheet of network objects and gets similarities & differences
    compareData(event) {
      /*eslint no-console: ["error", {"allow": ["log"]}] */
      if (this.outputOpen) {
        event.stopPropagation();
      }
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
          hasIcon: true
        });
      } else {
        this.isLoading = true;
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
      this.isLoading = false;
      let tmp = result.data;
      if (tmp.sheets.length == 0) {
        this.$buefy.notification.open({
          duration: 3000,
          message: `CyberAtlas Did Not Find Any ${this.selected}`,
          type: "is-primary",
          hasIcon: true
        });
      } else {
        this.output.headers.push(...tmp.headers);
        this.output.customHeaders.push(...tmp.customHeaders);
        this.output.files.push(...tmp.files);
        this.output.fileName = tmp.fileName;
        this.output.sheets.push(tmp.sheets);
      }
    },
    handleError(event) {
      this.isLoading = false;
      this.$buefy.notification.open({
        duration: 3000,
        message: event.message,
        type: "is-danger",
        hasIcon: true
      });
    },
    // @vuese
    // Transfer both data inputs to parent App
    transferData(destination) {
      this.actions.openWith(destination, {
        input1: this.excelA,
        input2: this.excelB
      });
    }
  },
  mounted() {
    // Add action to transfer two inputs, instead of just one
    this.$set(this.actions, "transferBothInputs", this.transferData);
    if (this.transfer.input1 != null) {
      let data = this.excelA;
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
    if (this.transfer.input2 != null) {
      let data = this.excelB;
      let input = this.transfer.input2;
      this.$set(data, "sheets", input.sheets);
      this.$set(data, "headers", input.headers);
      this.$set(data, "customHeaders", input.customHeaders);
      this.$set(data, "sheetIndex", input.sheetIndex);
      this.$set(data, "files", input.files);
      this.$set(data, "fileName", input.fileName);
      // Delete the old references to the transferred data
      this.$set(this.transfer, "input2", null);
    }
  },
  created() {
    if (window.Worker) {
      this.myWorker = new CompareWorker();
      this.myWorker.onmessage = this.updateOutput;
      this.myWorker.onerror = this.handleError;
    }
  },
  beforeDestroy() {
    this.myWorker.terminate();
  }
};
</script>
