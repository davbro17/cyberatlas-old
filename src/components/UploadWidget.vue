<template>
  <div
    class="column"
    v-bind:class="{
      'is-half': isOpen && configOpen,
      'is-full': !isOpen || !configOpen
    }"
  >
    <b-collapse aria-id="contentIDforWidget" :open="true">
      <div
        class="panel-heading"
        slot="trigger"
        role="button"
        aria-controls="contentIDforWidget"
        @click="isOpen = !isOpen"
      >
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <strong>Step 1: Upload Scan File</strong>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <b-icon
                :icon="isOpen ? 'angle-down' : 'angle-up'"
                size="is-small"
              >
              </b-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="panel-block">
        <div class="container has-text-centered table-container">
          <b-upload v-model="file" drag-drop v-if="!file" type="is-info">
            <section class="section">
              <div class="content has-text-centered">
                <p>
                  <b-icon icon="upload" size="is-large"> </b-icon>
                </p>
                <p>Drop your file here or click to upload</p>
              </div>
            </section>
          </b-upload>
          <div class="level" v-if="file">
            <div class="level-left">
              <div class="level-item">
                <span class="tag is-info is-medium">
                  {{ file.name.slice(0, 25) }}
                  <button
                    class="delete is-small"
                    type="button"
                    @click="removeFile()"
                  />
                </span>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <b-checkbox v-model="customHeaders" type="is-info">
                  Headers
                </b-checkbox>
              </div>
              <div class="level-item">
                <button class="is-button is-info" @click="exportExcel">
                  <b-icon icon="download" />
                </button>
              </div>
            </div>
          </div>
          <div style="height:400px;overflow:auto;" v-if="file">
            <table class="table is-bordered is-striped is-hoverable">
              <thead>
                <tr v-if="!customHeaders">
                  <td />
                  <th v-for="header in columns" v-bind:key="header">
                    {{ header }}
                  </th>
                </tr>
                <tr v-if="customHeaders">
                  <td />
                  <th
                    v-for="(header, index) in altHeaders"
                    v-bind:key="header"
                    contenteditable="true"
                    @focusout="updateHeader(index, $event.target.innerText)"
                  >
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowindex) in data" v-bind:key="rowindex">
                  <th>{{ rowindex + 1 }}</th>
                  <td
                    contenteditable="true"
                    v-for="(entry, colindex) in row"
                    v-bind:key="colindex"
                    style="overflow:hidden"
                    @focusout="
                      updateDataCell(
                        rowindex,
                        colindex,
                        $event.target.innerText
                      )
                    "
                  >
                    {{ entry }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import XLSX from "xlsx";

export default {
  props: {
    configOpen: Boolean
  },
  data() {
    return {
      isOpen: true,
      file: null,
      data: [],
      columns: [],
      altHeaders: [],
      customHeaders: false
    };
  },
  methods: {
    removeFile: function() {
      this.file = null;
      this.data.splice(0, this.data.length);
      this.columns.splice(0, this.columns.length);
      this.altHeaders.splice(0, this.altHeaders.length);
    },
    updateHeader: function(index, text) {
      this.altHeaders.splice(index, 1, text);
    },
    updateDataCell: function(row, col, text) {
      this.data[row].splice(col, 1, text);
    },
    swapHeaders: function() {
      if (this.customHeaders) {
        this.data.shift();
      } else {
        this.data.unshift(this.altHeaders);
      }
    },
    exportExcel: function() {
      if (this.file) {
        let tmp = this.data;
        if (this.customHeaders) {
          tmp.unshift(this.altHeaders);
        }
        let ws = XLSX.utils.aoa_to_sheet(tmp);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Test");
        XLSX.writeFile(wb, this.file.name);
      }
    },
    loadExcel: function(e) {
      /*eslint no-console: ["error", {"allow": ["log"]}] */
      var reader = new FileReader();
      reader.readAsArrayBuffer(e);
      var columns = this.columns;
      var data = this.data;
      let altHeaders = this.altHeaders;
      reader.onload = function() {
        var raw = new Uint8Array(reader.result);
        var wb = XLSX.read(raw, { type: "array" });
        var sheetList = wb.SheetNames;
        var json = XLSX.utils.sheet_to_json(wb.Sheets[sheetList[0]], {
          defval: "",
          header: "A"
        });
        var columnentries = json.map(function(obj) {
          return Object.keys(obj).length;
        });
        var colcount = Math.max(...columnentries);
        var rowcount = json.length;
        var tmp = Array.from(Array(rowcount), () => new Array(colcount));
        for (var i = 0; i < rowcount; i++) {
          var row = json[i];
          var cols = Object.values(row);
          for (var j = 0; j < colcount; j++) {
            tmp[i][j] = cols[j] || "";
          }
        }
        for (var column in json[0]) {
          columns.push(column);
        }
        for (row in tmp) {
          data.push(tmp[row]);
        }
        for (column in tmp[0]) {
          altHeaders.push(tmp[0][column]);
        }
      };
    }
  },
  watch: {
    file: function(e) {
      if (this.file) {
        this.loadExcel(e);
      }
    },
    customHeaders: function() {
      this.swapHeaders();
    }
  }
};
</script>
<style>
.upload {
  width: 100%;
}
.upload-draggable {
  width: 100%;
}
</style>
