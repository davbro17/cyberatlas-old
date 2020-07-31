<template>
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
          <span class="button is-info is-outlined" @click="mergeData">
            <strong>Generate</strong>
          </span>
        </div>
        <div class="level-item">
          <span class="button is-info is-outlined" @click="toggleSettings">
            <b-icon :icon="settingsWidget ? 'align-justify' : 'sliders-h'" />
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
          v-if="output.sheets.length == 0 && !isLoading && !settingsWidget"
        >
          Empty &#128577;
        </div>
        <!-- DataWidget for Output -->
        <DataWidget
          :data.sync="output"
          outputOnly
          v-if="!settingsWidget"
          :actions="actions"
        />
        <div class="container" v-else>
          <div class="field">
            <label class="label"> Merge </label>
          </div>
          <b-field>
            <b-radio-button
              type="is-info"
              v-model="selected"
              v-for="(option, index) in options"
              :native-value="option"
              :key="index"
            >
              <span> {{ option }} </span>
            </b-radio-button>
          </b-field>
        </div>
      </template>
    </PanelBlock>
  </div>
</template>

<script>
import DataWidget from "../components/DataWidget.vue";
import PanelBlock from "../components/templates/PanelBlock.vue";
import * as MergeWorker from "worker-loader!../transform/workers/merge_worker";

export default {
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
      selected: "Columns",
      options: ["Columns", "Sheets"],
      dataAOpen: true,
      dataBOpen: true,
      outputOpen: false,
      settingsWidget: false,
      isLoading: false
    };
  },
  methods: {
    // @vuese
    // Takes two excel sheet of network objects and gets similarities & differences
    mergeData(event) {
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
          type: "is-danger",
          hasIcon: true
        });
      } else {
        this.settingsWidget = false;
        this.isLoading = true;
        const index = this.options.findIndex(o => o === this.selected);
        this.output.files.splice(0, this.output.files.length);
        this.output.fileName = "";
        this.output.sheetIndex = 0;
        this.output.sheets.splice(0, this.output.sheets.length);
        this.output.customHeaders.splice(0, this.output.customHeaders.length);
        this.output.headers.splice(0, this.output.headers.length);
        this.myWorker.postMessage([index, this.excelA, this.excelB]);
      }
    },
    // @vuese
    // Receive the output from the web worker and update the Output Excel Widget
    updateOutput(result) {
      this.isLoading = false;
      let tmp = result.data;
      this.output.headers.push(...tmp.headers);
      this.output.customHeaders.push(...tmp.customHeaders);
      this.output.files.push(...tmp.files);
      this.output.fileName = tmp.fileName;
      this.output.sheets.push(...tmp.sheets);
    },
    toggleSettings(event) {
      if (this.outputOpen) {
        event.stopPropagation();
      }
      this.settingsWidget = !this.settingsWidget;
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
      this.myWorker = new MergeWorker();
      this.myWorker.onmessage = this.updateOutput;
      this.myWorker.onerror = this.handleError;
    }
  },
  beforeDestroy() {
    this.myWorker.terminate();
  }
};
</script>
