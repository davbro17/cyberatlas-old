<template>
  <div id="app">
    <!-- Main Application -->
    <div class="columns is-multiline add-space">
      <!-- Original Data Widget -->
      <DataWidget :configOpen="configOpen" :data.sync="excelA">
        <template #title>
          Step 1: Upload Excel 1
        </template>
      </DataWidget>
      <!-- Subnet Ranges Data Widget -->
      <DataWidget :configOpen="configOpen" :data.sync="excelB">
        <template #title>
          <strong>Step 2: Upload Excel 2</strong>
        </template>
      </DataWidget>
      <!-- Output Data Widget -->
      <DataWidget :data.sync="same" outputOnly>
        <template #dynamicTitle>
          <div class="level-item">
            <strong>Step 3:</strong>
          </div>
          <div class="level-item">
            <span class="button is-info is-outlined" @click.stop="compareData">
              <strong>Generate</strong>
            </span>
          </div>
          <div class="level-item">
            <strong>Similarities</strong>
          </div>
        </template>
      </DataWidget>
      <!-- Output Data Widget -->
      <DataWidget :data.sync="diffA" outputOnly>
        <template #dynamicTitle>
          <div class="level-item">
            <strong>Step 3:</strong>
          </div>
          <div class="level-item">
            <span class="button is-info is-outlined" @click.stop="handleClick">
              <strong>Generate</strong>
            </span>
          </div>
          <div class="level-item">
            <strong>Excel 1 Differences</strong>
          </div>
        </template>
      </DataWidget>
      <!-- Output Data Widget -->
      <DataWidget :data.sync="diffB" outputOnly>
        <template #dynamicTitle>
          <div class="level-item">
            <strong>Step 3:</strong>
          </div>
          <div class="level-item">
            <span class="button is-info is-outlined" @click.stop="handleClick">
              <strong>Generate</strong>
            </span>
          </div>
          <div class="level-item">
            <strong>Excel 2 Differences</strong>
          </div>
        </template>
      </DataWidget>
    </div>
  </div>
</template>

<script>
import DataWidget from "../components/DataWidget.vue";
import {
  extractNetObjs,
  filterRows,
  excludeRows
} from "../transform/utility/extract.js";

export default {
  name: "app",
  components: {
    DataWidget
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
      same: {
        sheets: [],
        headers: [],
        customHeaders: [],
        sheetIndex: 0,
        files: []
      },
      diffA: {
        sheets: [],
        headers: [],
        customHeaders: [],
        sheetIndex: 0,
        files: []
      },
      diffB: {
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
    // Takes two excel sheet of network objects and gets similarities & differences
    async handleClick() {
      try {
        await this.compareData();
      } catch {
        console.log("error with compare data");
      }
    },
    // @vuese
    // Takes two excel sheet of network objects and gets similarities & differences
    compareData() {
      return new Promise(resolve => {
        /*eslint no-console: ["error", {"allow": ["log"]}] */
        if (this.excelA.sheets.length == 0 || this.excelB.sheets.length == 0) {
          console.log("MISSING DATA");
        } else {
          const excelA = JSON.parse(JSON.stringify(this.excelA));
          const excelB = JSON.parse(JSON.stringify(this.excelB));
          this.same = JSON.parse(JSON.stringify(this.excelA));
          const netObjsA = extractNetObjs(excelA.sheets);
          const netObjsB = extractNetObjs(excelB.sheets);
          const outputA = excludeRows(excelA.sheets, netObjsB);
          const outputB = excludeRows(excelB.sheets, netObjsA);
          const outputSame = filterRows(excelA.sheets, netObjsB);
          this.diffA = excelA;
          this.diffB = excelB;
          this.diffA.sheets.splice(0, 1, outputA);
          this.diffB.sheets.splice(0, 1, outputB);
          this.same.sheets.splice(0, 1, outputSame);
          resolve();
        }
      });
    }
  }
};
</script>
