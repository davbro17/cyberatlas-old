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
    <PanelBlock :Open="false" @toggle="bool => (outputOpen = bool)">
      <template #dynamicTitle>
        <div class="level-item">
          <strong>Step 3:</strong>
        </div>
        <div class="level-item">
          <span class="button is-info is-outlined" @click="extractIPAdresses">
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
        <!-- Output Content -->
        <DataWidget :data.sync="output" outputOnly v-if="!settingsWidget" />
        <!-- Extract Settings -->
        <div class="columns is-centered" v-else style="width:100%">
          <div class="column is-narrow">
            <label class="label">Settings</label>
            <span
              class="button is-info is-outlined"
              @click.stop="downloadSettings"
            >
              <strong>Download Setting Configurations</strong>
            </span>
            <hr />
            <b-upload
              v-model="file"
              drag-drop
              type="is-info"
              accept=".json"
              style="height:135px"
            >
              <div class="content has-text-centered" width="100%">
                <p />
                <p>
                  <b-icon icon="upload" size="is-large" />
                </p>
                <span>Upload a Configuration File</span>
              </div>
            </b-upload>
          </div>
          <div class="column is-narrow">
            <div class="field">
              <label class="label"> Extract From [Excel A] </label>
            </div>
            <b-field grouped>
              <b-checkbox
                v-model="settings.allSheets"
                type="is-info"
                style="margin-right:23px;"
              >
                All Sheets
              </b-checkbox>
              <p class="control has-icons-left">
                <input
                  class="input is-info"
                  type="text"
                  placeholder="1, Sheet2, 3.."
                  :disabled="settings.allSheets"
                  v-model="settings.fromSheets"
                />
              </p>
            </b-field>
            <b-field grouped>
              <b-checkbox
                v-model="settings.allColumns"
                type="is-info"
                style="margin-right:10px;"
              >
                All Columns
              </b-checkbox>
              <p class="control has-icons-left">
                <input
                  class="input is-info"
                  type="text"
                  placeholder="A, ColB, C.."
                  :disabled="settings.allColumns"
                  v-model="settings.fromColumns"
                />
              </p>
            </b-field>
            <div class="field">
              <label class="label"> Remove Output </label>
            </div>
            <b-field grouped>
              <b-checkbox
                v-model="settings.removeSheets"
                type="is-info"
                style="margin-right:23px;"
              >
                Sheets
              </b-checkbox>
              <p class="control has-icons-left">
                <input
                  class="input is-info"
                  type="text"
                  placeholder="1, Sheet2, 3.."
                  :disabled="!settings.removeSheets"
                  v-model="settings.removedSheets"
                />
              </p>
            </b-field>
            <b-field grouped>
              <b-checkbox
                v-model="settings.removeColumns"
                type="is-info"
                style="margin-right:10px;"
              >
                Columns
              </b-checkbox>
              <p class="control has-icons-left">
                <input
                  class="input is-info"
                  type="text"
                  placeholder="A, ColB, C.."
                  :disabled="!settings.removeColumns"
                  v-model.number="settings.removedColumns"
                />
              </p>
            </b-field>
          </div>
          <div class="column is-narrow">
            <label class="label"> Extract With [Excel B]</label>
            <b-field grouped>
              <b-checkbox
                v-model="settings.extractSheets"
                type="is-info"
                style="margin-right:23px;"
              >
                All Sheets
              </b-checkbox>
              <p class="control has-icons-left">
                <input
                  class="input is-info"
                  type="text"
                  placeholder="1, Sheet2, 3.."
                  :disabled="settings.extractSheets"
                  v-model="settings.extractedSheets"
                />
              </p>
            </b-field>
            <b-field grouped>
              <b-checkbox
                v-model="settings.extractColumns"
                type="is-info"
                style="margin-right:10px;"
              >
                All Columns
              </b-checkbox>
              <p class="control has-icons-left">
                <input
                  class="input is-info"
                  type="text"
                  placeholder="A, ColB, C.."
                  :disabled="settings.extractColumns"
                  v-model.number="settings.extractedColumns"
                />
              </p>
            </b-field>
            <div class="field">
              <label class="label"> Extract </label>
            </div>
            <b-field>
              <b-radio-button
                type="is-info"
                v-model="settings.selected"
                v-for="(option, index) in settings.options"
                :native-value="option"
                :key="index"
              >
                <span> {{ option }} </span>
              </b-radio-button>
            </b-field>
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
            <div v-else>
              <b-field label="Action:" type="is-info">
                <b-select v-model="settings.regexOperation">
                  <option value="filter"> Filter Rows </option>
                  <option value="apply"> Apply Regex </option>
                  <option value="replace"> Apply &amp; Replace </option>
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
              <div v-if="settings.regexOperation === 'replace'">
                <label class="label">Replacement String </label>
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
        </div>
      </template>
    </PanelBlock>
    <a ref="configdownloader" style="display:none" />
  </div>
</template>

<script>
import DataWidget from "../components/DataWidget.vue";
import PanelBlock from "../components/templates/PanelBlock.vue";
import * as ExtractWorker from "worker-loader!../transform/workers/extract_worker";
import configOptions from "../transform/defaults/configs.js";
import GenerateSchema from "generate-schema";
import JSONschema from "jsonschema";

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
      outputOpen: false,
      settingsWidget: false,
      isLoading: false,
      file: null,
      schema: null,
      settings: {
        options: ["IPs/Cidr", "Strings", "Regex"],
        selected: "IPs/Cidr",
        allSheets: true,
        allColumns: true,
        fromSheets: "",
        fromColumns: "",
        removeSheets: false,
        removeColumns: false,
        removedSheets: "",
        removedColumns: "",
        filterIps: true,
        filterCidrs: true,
        stringOperation: "equals",
        regexOperation: "filter",
        multipleRegexMatches: false,
        combineRegexes: false,
        extractColumns: true,
        extractSheets: true,
        extractedColumns: "",
        extractedSheets: "",
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
    extractIPAdresses(event) {
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
        if (this.outputOpen) {
          event.stopPropagation();
        }
        this.isLoading = true;
        this.output.files.splice(0, this.output.files.length);
        this.output.sheets.splice(0, this.output.sheets.length);
        this.output.headers.splice(0, this.output.headers.length);
        this.output.customHeaders.splice(0, this.output.headers.length);
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
    },
    downloadSettings() {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(this.settings));
      this.$refs.configdownloader.setAttribute("href", dataStr);
      this.$refs.configdownloader.setAttribute("download", "configs.json");
      this.$refs.configdownloader.click();
    },
    toggleSettings(event) {
      if (this.outputOpen) {
        event.stopPropagation();
      }
      this.settingsWidget = !this.settingsWidget;
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
    }
  },
  mounted() {
    // Generate JSON schema from this.options
    this.schema = GenerateSchema.json("Configurations", this.options);
  },
  beforeDestroy() {
    this.myWorker.terminate();
  }
};
</script>
