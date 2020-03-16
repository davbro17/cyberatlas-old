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
        <DataWidget :data.sync="ips" :actions="actions" />
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
        <DataWidget :data.sync="subnets" :actions="actions" />
      </template>
    </PanelBlock>
    <!-- Output Data Widget -->
    <PanelBlock :Open="false" @toggle="bool => (outputOpen = bool)">
      <template #dynamicTitle>
        <div class="level-item">
          <strong>Step 3:</strong>
        </div>
        <div class="level-item">
          <span class="button is-info is-outlined" @click="extract">
            <strong>Extract</strong>
          </span>
        </div>
        <div class="level-item" @click="toggleSettings($event, true)">
          <span>
            <b-dropdown aria-role="list" v-model="settings.selected">
              <button class="button is-info is-outlined" slot="trigger">
                <span
                  ><strong>{{ settings.selected }}</strong>
                </span>
                <b-icon icon="caret-down"></b-icon>
              </button>
              <b-dropdown-item
                aria-role="listitem"
                v-for="(item, index) in settings.options.filter(
                  (e, i) => e != settings.selected
                )"
                :key="index"
                :value="item"
              >
                {{ item }}
              </b-dropdown-item>
            </b-dropdown>
          </span>
        </div>
        <div class="level-item" v-if="output.sheets.length > 0">
          <span class="button is-info is-outlined" @click="downloadConfigs">
            <strong>Download Map Configurations</strong>
            <b-icon icon="download" />
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
          v-if="
            output.sheets.length == 0 &&
              !isLoading &&
              !settingsWidget &&
              settings.selected != 'Map Configurations'
          "
        >
          Empty &#128577;
        </div>
        <!-- Output Content -->
        <DataWidget
          :data.sync="output"
          outputOnly
          v-if="!settingsWidget && settings.selected != 'Map Configurations'"
          :actions="actions"
        />
        <!-- Output Content for Map Configurations -->
        <ConfigWidget
          v-else-if="
            !settingsWidget && settings.selected === 'Map Configurations'
          "
          v-bind.sync="mapConfigs"
          :data="subnets"
        />
        <!-- Extract Settings -->
        <div class="columns is-centered" v-else style="width:100%">
          <div class="column is-narrow has-text-centered">
            <label class="label">Settings</label>
            <b-field class="file">
              <b-upload v-model="file" type="is-info" accept=".json">
                <a
                  class="button is-info is-outlined"
                  style="padding-left:20px; padding-right:20px;"
                >
                  <span>Upload Settings</span>
                  <b-icon icon="upload" />
                </a>
              </b-upload>
            </b-field>
            <button
              class="button is-info is-outlined"
              @click.stop="downloadSettings"
            >
              <span>Download Settings</span>
              <b-icon icon="download" />
            </button>
          </div>
          <div class="column is-narrow">
            <label class="label"> Select or Ignore Data </label>
            <div class="field has-addons">
              <div class="control">
                <div class="select is-info">
                  <select v-model="dataFilter.action">
                    <option value="Ignore">Ignore</option>
                    <option v-if="dataFilter.from != 'Output'" value="Select"
                      >Select</option
                    >
                  </select>
                </div>
              </div>
              <div class="control">
                <input
                  v-model="dataFilter.sheet"
                  class="input is-info"
                  placeholder="Sheet"
                  style="width:100px;"
                />
              </div>
              <div class="control">
                <input
                  v-model="dataFilter.column"
                  class="input is-info"
                  placeholder="Column"
                  width="50%"
                  style="width:100px;"
                />
              </div>
              <div class="control">
                <a
                  class="button is-active is-info is-outlined"
                  style="pointerEvents:none; color: black;"
                >
                  From
                </a>
              </div>
              <div class="control">
                <div class="select is-info">
                  <select v-model="dataFilter.from" @change="checkOutputFilter">
                    <option value="Input1">Input1</option>
                    <option value="Input2">Input2</option>
                    <option value="Output">Output</option>
                  </select>
                </div>
              </div>
              <div class="control">
                <button
                  class="button is-info is-outlined"
                  @click="addDataFilter"
                >
                  <b-icon icon="plus" />
                </button>
              </div>
            </div>
          </div>
          <div class="column is-narrow">
            <div v-if="settings.selected === settings.options[0]">
              <b-field horizontal grouped label="Filter:">
                <b-checkbox v-model="settings.filterIps" type="is-info">
                  IPs
                </b-checkbox>
                <b-checkbox v-model="settings.filterCidrs" type="is-info">
                  CIDRs
                </b-checkbox>
              </b-field>
            </div>
            <div v-else-if="settings.selected === settings.options[1]">
              <b-field label="Filter If Cell" type="is-info">
                <b-select v-model="settings.stringOperation">
                  <option value="equals"> Equals String </option>
                  <option value="contains"> Contains String </option>
                </b-select>
              </b-field>
            </div>
            <div v-else-if="settings.selected === settings.options[2]">
              <b-field label="Action:" type="is-info">
                <b-select v-model="settings.regexOperation">
                  <option value="filter"> Filter Rows </option>
                  <option value="apply"> Apply Regex </option>
                </b-select>
              </b-field>
              <div v-if="settings.regexOperation === 'apply'">
                <label class="label">Regex Options</label>
                <b-field type="is-info">
                  <b-checkbox
                    v-model="settings.multipleRegexMatches"
                    type="is-info"
                  >
                    Allow Multiple Matches
                  </b-checkbox>
                </b-field>
                <b-field>
                  <b-checkbox v-model="settings.combineRegexes" type="is-info">
                    Combine Expressions
                  </b-checkbox>
                </b-field>
                <label class="label">Output Options</label>
                <b-field>
                  <b-checkbox v-model="settings.showMatch" type="is-info">
                    Show Match
                  </b-checkbox>
                </b-field>
                <b-field>
                  <b-checkbox
                    v-model="settings.showUnnamedGroups"
                    type="is-info"
                  >
                    Show Unnamed Groups
                  </b-checkbox>
                </b-field>
                <b-field>
                  <b-checkbox v-model="settings.showNamedGroups" type="is-info">
                    Show Named Groups
                  </b-checkbox>
                </b-field>
              </div>
            </div>
            <div v-else>
              <label class="label">Replacement Strings </label>
              <b-field horizontal label="Sheet">
                <input
                  style="margin-left:15px"
                  class="input is-info"
                  v-model="settings.replacementStringSheet"
                />
              </b-field>
              <b-field horizontal label="Column">
                <input
                  style="margin-left:8px"
                  class="input is-info"
                  v-model="settings.replacementStringColumn"
                />
              </b-field>
              <b-field horizontal label="Delimiter">
                <input
                  class="input is-info"
                  v-model="settings.replacementStringDelimiter"
                />
              </b-field>
            </div>
          </div>
        </div>
      </template>
    </PanelBlock>
    <a ref="configdownloader" style="display:none" />
  </div>
</template>

<script>
import DataWidget from "../components/DataWidget.vue";
import ConfigWidget from "../components/ConfigWidget.vue";
import PanelBlock from "../components/templates/PanelBlock.vue";
import * as ExtractWorker from "worker-loader!../transform/workers/extract_worker";
import configOptions from "../transform/defaults/configs.js";
import GenerateSchema from "generate-schema";
import JSONschema from "jsonschema";
import options from "../transform/defaults/configs.js";
import defaultLayout from "../transform/defaults/layout.js";

export default {
  name: "ExtractView",
  components: { DataWidget, PanelBlock, ConfigWidget },
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
      mapConfigs: {
        configs: [],
        defaults: options,
        tracker: {},
        layout: defaultLayout
      },
      myWorker: null,
      cidrs: null,
      dataAOpen: true,
      dataBOpen: true,
      outputOpen: false,
      settingsWidget: false,
      isLoading: false,
      file: null,
      schema: null,
      dataFilter: {
        action: "Ignore",
        sheet: "",
        column: "",
        from: "Input1"
      },
      settings: {
        options: [
          "IP Addresses",
          "Strings",
          "Regular Expression",
          "Regex and Replace",
          "MAC Addresses",
          "Map Configurations"
        ],
        selected: "IP Addresses",
        dataFilters: {
          input1: {
            select: [],
            ignore: []
          },
          input2: {
            select: [],
            ignore: []
          },
          output: {
            ignore: []
          }
        },
        filterIps: true,
        filterCidrs: true,
        stringOperation: "equals",
        regexOperation: "filter",
        multipleRegexMatches: false,
        combineRegexes: false,
        replacementString: false,
        replacementStringSheet: "1",
        replacementStringColumn: "B",
        replacementStringDelimiter: ",",
        showNamedGroups: true,
        showMatch: true,
        showUnnamedGroups: true
      }
    };
  },
  methods: {
    // @vuese
    // Pulls IP Address that fall into a list of subnets
    extract(event) {
      /*eslint no-console: ["error", {"allow": ["log"]}] */
      if (this.ips.sheets.length == 0) {
        this.$buefy.notification.open({
          duration: 3000,
          message: `Missing Data For Input 1`,
          type: "is-danger",
          hasIcon: true
        });
      } else if (this.subnets.sheets.length == 0) {
        this.$buefy.notification.open({
          duration: 3000,
          message: `Missing Data For Input 2`,
          type: "is-danger",
          hasIcon: true
        });
      } else {
        if (this.outputOpen) {
          event.stopPropagation();
        }
        this.isLoading = true;
        this.settingsWidget = false;
        this.output.files.splice(0, this.output.files.length);
        this.output.fileName = "";
        this.output.sheetIndex = 0;
        this.output.sheets.splice(0, this.output.sheets.length);
        this.output.customHeaders.splice(0, this.output.customHeaders.length);
        this.output.headers.splice(0, this.output.headers.length);
        this.myWorker.postMessage([
          this.settings,
          this.subnets.sheets,
          this.ips
        ]);
      }
    },
    updateOutput(result) {
      this.isLoading = false;
      let tmp = result.data[0];
      if (tmp.sheets.length == 0) {
        this.$buefy.notification.open({
          duration: 3000,
          message: `CyberAtlas Found Nothing To Extract`,
          type: "is-primary",
          hasIcon: true
        });
      } else {
        this.cidrs = result.data[1];
        this.output.headers.push(...tmp.headers);
        this.output.customHeaders.push(...tmp.customHeaders);
        this.output.files.push(...tmp.files);
        this.output.fileName = tmp.fileName;
        this.output.sheets.push(tmp.sheets);
      }
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
    },
    downloadSettings() {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(this.settings));
      this.$refs.configdownloader.setAttribute("href", dataStr);
      this.$refs.configdownloader.setAttribute("download", "configs.json");
      this.$refs.configdownloader.click();
    },
    toggleSettings(event, force) {
      if (this.outputOpen) {
        event.stopPropagation();
      }
      this.settingsWidget = !this.settingsWidget || force;
    },
    loadJSON() {
      try {
        let newConfigs = JSON.parse(event.target.result);
        let validation = JSONschema.validate(newConfigs, this.schema);
        if (validation.valid) {
          for (let key in newConfigs) {
            this.$set(this.settings, key, newConfigs[key]);
          }
        } else {
          for (let i = 0; i < validation.errors.length; i++) {
            let error = validation.errors[i];
            console.log(`${error.property} ${error.message}`);
          }
        }
      } catch {
        console.log("JSON FILE ERROR!");
      }
    },
    // @vuese
    // Handle error from web worker by generating Buefy notification
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
    // Add data filter to settings.dataFilters
    addDataFilter() {
      // Quick reference to data filter
      let f = this.dataFilter;
      // Add the filter
      this.settings.dataFilters[f.from][f.action].append([f.sheet, f.column]);
    },
    checkOutputFilter() {
      if (this.dataFilter.from === "Output") {
        this.dataFilter.action = "Ignore";
      }
    },
    // @vuese
    // Transfer both data inputs to parent App
    transferData(destination) {
      this.actions.openWith(destination, {
        input1: this.ips,
        input2: this.subnets
      });
    }
  },
  watch: {
    file() {
      let file = this.file;
      let reader = new FileReader();
      reader.onload = this.loadJSON;
      reader.readAsText(file);
    }
  },
  created() {
    if (window.Worker) {
      this.myWorker = new ExtractWorker();
      this.myWorker.onmessage = this.updateOutput;
      this.myWorker.onerror = this.handleError;
    }
  },
  mounted() {
    // Generate JSON schema from this.options
    this.schema = GenerateSchema.json("Configurations", this.options);
    // Add action to transfer two inputs, instead of just one
    this.$set(this.actions, "transferBothInputs", this.transferData);
    if (this.transfer.input1 != null) {
      let data = this.ips;
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
      let data = this.subnets;
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
  beforeDestroy() {
    this.myWorker.terminate();
  }
};
</script>
