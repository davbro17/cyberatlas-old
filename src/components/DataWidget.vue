<template>
  <div
    class="column"
    v-bind:class="{
      'is-half': isOpen && configOpen,
      'is-full': !isOpen || !configOpen
    }"
    style="padding-bottom:0em;"
  >
    <!-- Panel Header -->
    <div class="panel-heading pointer" @click="togglePanel">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <strong><slot name="title"/></strong>
          </div>
          <slot name="dynamicTitle" />
        </div>
        <div class="level-right">
          <div class="level-item">
            <b-icon :icon="isOpen ? 'angle-down' : 'angle-up'" size="is-small">
            </b-icon>
          </div>
        </div>
      </div>
    </div>
    <!-- Panel Body -->
    <div
      class="panel-block"
      v-bind:style="{ display: isOpen ? 'block' : 'none' }"
    >
      <!-- Upload Widget -->
      <div class="container has-text-centered table-container">
        <b-upload
          v-model="files"
          drag-drop
          multiple
          v-if="!outputOnly && data.sheets.length == 0"
          type="is-info"
        >
          <section class="section">
            <div class="content has-text-centered">
              <p>
                <b-icon icon="upload" size="is-large"> </b-icon>
              </p>
              <p>Drop your file here or click to upload</p>
            </div>
          </section>
        </b-upload>
        <!-- Toolbar -->
        <div class="level" v-if="data.files.length > 0">
          <div class="level-left">
            <div class="level-item">
              <span class="tag is-info is-medium">
                {{ data.files[0].name.slice(0, 25) }}
                <button
                  class="delete is-small"
                  type="button"
                  @click="removeFile()"
                />
              </span>
            </div>
          </div>
          <div class="level-right">
            <!-- Custom Headers Checkbox -->
            <div class="level-item">
              <b-checkbox v-model="customHeaders" type="is-info">
                Headers
              </b-checkbox>
            </div>
            <div class="level-item">
              <button class="button is-info is-outlined" @click="exportExcel">
                <b-icon icon="download" />
              </button>
            </div>
          </div>
        </div>
        <!-- Excel Table -->
        <div style="height:400px;overflow:auto;" v-if="data.sheets.length">
          <table class="table is-bordered is-striped is-hoverable">
            <!-- Table Header -->
            <thead>
              <!-- Check if the Custom Headers are NOT enabled -->
              <tr
                v-if="
                  !data.customHeaders[data.sheetIndex] ||
                    !data.customHeaders[data.sheetIndex].length
                "
                content
              >
                <td />
                <th
                  v-for="(row, index) in data.sheets[data.sheetIndex][0]"
                  v-bind:key="index"
                >
                  {{ data.headers[index] }}
                </th>
              </tr>
              <!-- Custom Headers
                The custom headers are the first row of the data -->
              <tr v-else>
                <td />
                <th
                  v-for="(header, index) in data.customHeaders[data.sheetIndex]"
                  v-bind:key="index"
                  contenteditable="true"
                  @blur="updateHeader(index, $event.target.innerText)"
                >
                  {{ header }}
                </th>
              </tr>
            </thead>
            <!-- Table Body -->
            <tbody>
              <tr
                v-for="(row, rowindex) in data.sheets[data.sheetIndex]"
                v-bind:key="rowindex"
              >
                <th>{{ rowindex + 1 }}</th>
                <td v-for="(entry, colindex) in row" v-bind:key="colindex">
                  <span
                    contenteditable="true"
                    @blur="
                      updateDataCell(
                        rowindex,
                        colindex,
                        $event.target.innerText
                      )
                    "
                  >
                    {{ entry }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import XLSX from "xlsx";

export default {
  props: {
    configOpen: Boolean,
    outputOnly: Boolean,
    data: {
      type: Object,
      default() {
        return {
          sheets: [],
          headers: [],
          customHeaders: [],
          sheetIndex: 0,
          files: []
        };
      }
    }
  },
  data() {
    return {
      isOpen: true,
      customHeaders: false,
      files: [],
      isLoading: false
    };
  },
  methods: {
    // @vuese
    // Removes current file data from Data Object
    removeFile: function() {
      this.data.files.splice(0, this.data.files.length);
      this.data.sheets.splice(0, this.data.sheets.length);
      this.data.customHeaders.splice(0, this.data.headers.length);
    },
    // @vuese
    // Update a custom header
    // @arg (index, text) [Number, String] : header index, replacement string
    updateHeader: function(index, text) {
      this.data.customHeaders[this.data.sheetIndex].splice(index, 1, text);
    },
    // @vuese
    // Update a data entry
    // @arg (row, col, text) [Number, Number, String]: entry row, entry column, replacement string
    updateDataCell: function(row, col, text) {
      this.data.sheets[this.data.sheetIndex][row].splice(col, 1, text);
    },
    // @vuese
    // Swap the first row with the headers
    swapHeaders: function() {
      let index = this.data.sheetIndex;
      if (this.customHeaders) {
        let firstrow = this.data.sheets[index].shift();
        this.data.customHeaders.splice(index, 1, firstrow);
      } else {
        let headers = this.data.customHeaders.splice(index, 1, []);
        this.data.sheets[index].unshift(...headers);
      }
    },
    // @vuese
    // Downloads Data as Excel Sheet
    exportExcel: function() {
      if (this.data.sheets.length > 0) {
        let data = this.data.sheets;
        let custom = this.data.customHeaders;
        let wb = XLSX.utils.book_new();
        var ws;
        for (let i = 0; i < custom.length; i++) {
          if (custom[i].length) {
            let tmp = [].concat(data[i]);
            tmp.unshift(custom[i]);
            ws = XLSX.utils.aoa_to_sheet(tmp);
          } else {
            ws = XLSX.utils.aoa_to_sheet(data[i]);
          }
          XLSX.utils.book_append_sheet(wb, ws, "Test");
        }
        XLSX.writeFile(wb, this.data.files[0].name);
      }
    },
    loadExcel: function(e) {
      /*eslint no-console: ["error", {"allow": ["log"]}] */
      var reader = new FileReader();
      reader.readAsArrayBuffer(e);
      var headers = this.data.headers;
      var data = this.data.sheets;
      let customHeaders = this.data.customHeaders;
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
        data.push(tmp);
        for (var column in json[0]) {
          headers.push(column);
        }
        customHeaders.push([]);
      };
    },
    togglePanel() {
      this.isOpen = !this.isOpen;
    }
  },
  watch: {
    files() {
      if (this.files.length > 0){
        for (let i = 0; i < this.files.length; i++) {
          this.loadExcel(this.files[i]);
          this.data.files.push({
            name: this.files[i].name
          });
        }
        this.files.splice(0, this.files.length);
      }
    },
    customHeaders() {
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
.panel-heading.pointer {
  cursor: pointer;
}
</style>
