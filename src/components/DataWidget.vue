<template>
  <div class="container has-text-centered table-container">
    <!-- Upload Widget -->
    <b-upload
      v-model="files"
      drag-drop
      multiple
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,.csv,text/plain"
      v-if="!outputOnly && data.sheets.length == 0 && !isLoading"
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
    <div
      class="level"
      v-if="data.sheets.length > 0"
      style="margin-bottom:0.75em"
    >
      <div class="level-left">
        <!-- Filename -->
        <div class="level-item clickable">
          <span
            class="tag is-info is-medium"
            @click="fileNameModalActive = true"
          >
            {{ data.fileName.slice(0, 25) }}
            <button
              class="delete is-small"
              type="button"
              @click.stop="removeFile()"
            />
          </span>
        </div>
        <!-- Filename Modal -->
        <div class="modal" v-bind:class="{ 'is-active': fileNameModalActive }">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">Filename</p>
              <button
                class="delete"
                aria-label="close"
                @click="fileNameModalActive = false"
              />
            </header>
            <section class="modal-card-body">
              <!-- Content ... -->
              <input
                class="input is-info"
                v-model="data.fileName"
                @keydown.enter="fileNameModalActive = false"
              />
            </section>
          </div>
        </div>
      </div>
      <div class="level-right">
        <!-- Custom Headers Checkbox -->
        <div class="level-item">
          <b-checkbox
            v-model="customHeaders"
            @input="swapHeaders()"
            type="is-info"
          >
            Headers
          </b-checkbox>
        </div>
        <!-- Open in Different App -->
        <div class="level-item">
          <b-tooltip type="is-light" position="is-bottom" label="Open With">
            <b-dropdown
              aria-role="list"
              v-model="openWithApp.app"
              trap-focus
              position="is-bottom-left"
              @active-change="openWithApp.click = 'null'"
              :close-on-click="false"
            >
              <button class="button is-info is-outlined" slot="trigger">
                <b-icon icon="external-link-alt" />
              </button>
              <b-dropdown-item
                aria-role="listitem"
                value="Map"
                v-if="$route.name != 'Map'"
              >
                Map
              </b-dropdown-item>
              <div
                v-for="opt in openWithApp.options.filter(o => o != $route.name)"
                :key="opt"
              >
                <b-dropdown-item
                  aria-role="listitem"
                  has-link
                  @click="openMenu(opt)"
                >
                  <a>
                    {{ opt }}
                  </a>
                </b-dropdown-item>
                <b-dropdown-item
                  aria-role="listitem"
                  v-if="openWithApp.click === opt"
                  style="padding-left:3em"
                  :value="opt.concat('_Input1')"
                  >Input 1</b-dropdown-item
                >
                <b-dropdown-item
                  aria-role="listitem"
                  v-if="openWithApp.click === opt"
                  style="padding-left:3em"
                  :value="opt.concat('_Input2')"
                  >Input 2</b-dropdown-item
                >
                <b-dropdown-item
                  aria-role="listitem"
                  v-if="openWithApp.click === opt && $route.name != 'Map'"
                  style="padding-left:3em"
                  :value="opt.concat('_Both')"
                  >Both</b-dropdown-item
                >
              </div>
            </b-dropdown>
          </b-tooltip>
        </div>
        <!-- Download -->
        <div class="level-item">
          <b-tooltip type="is-light" position="is-left" label="Download">
            <button class="button is-info is-outlined" @click="exportExcel">
              <b-icon icon="download" />
            </button>
          </b-tooltip>
        </div>
      </div>
    </div>
    <!-- Loading Data -->
    <b-icon v-if="isLoading" icon="spinner" custom-class="fa-pulse" />
    <!-- Excel Table -->
    <div
      style="height:400px;overflow:auto;border: 1px solid #dbdbdb;"
      v-if="data.sheets.length"
    >
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
            v-for="(row, rowindex) in data.sheets[data.sheetIndex].slice(
              (currentPage - 1) * perPage,
              currentPage * perPage
            )"
            v-bind:key="rowindex"
          >
            <th>{{ (currentPage - 1) * perPage + rowindex + 1 }}</th>
            <td
              class="is-paddingless"
              v-for="(entry, colindex) in row"
              v-bind:key="colindex"
            >
              <textarea
                :rows="entry.toString().split(/\r\n|\r|\n/).length"
                :cols="
                  Math.max(
                    ...entry
                      .toString()
                      .split(/\r\n|\r|\n/)
                      .map(e => e.length),
                    1
                  )
                "
                v-model="row[colindex]"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="level" v-if="data.sheets.length > 0" style="padding-top:10px">
      <div class="level-left">
        <div class="level-item">
          <span style="margin-right:10px;">Rows/Page</span>
          <div class="field">
            <div class="control" style="width:45px;">
              <input
                class="input is-info has-text-centered"
                type="text"
                placeholder="25"
                v-model.number="perPage"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- Sheet Pagination -->
      <div class="level-item">
        <span
          class="button is-info is-outlined"
          :disabled="data.sheetIndex == 0"
          @click="decrementSheetIndex"
        >
          <b-icon icon="angle-left" />
        </span>
        <span style="margin:0px 10px 0px 10px">
          {{ data.files[data.sheetIndex] }}
        </span>
        <span
          class="button is-info is-outlined"
          :disabled="data.sheetIndex == data.sheets.length - 1"
          @click="incrementSheetIndex"
        >
          <b-icon icon="angle-right" />
        </span>
      </div>
      <div class="level-right">
        <div class="level-item">
          <b-pagination
            :total="data.sheets[data.sheetIndex].length"
            :current.sync="currentPage"
            order="is-centered"
            style="margin-right:3px;"
            simple
            :per-page="perPage"
            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import XLSX from "xlsx";
import * as DataWorker from "worker-loader!../transform/workers/data_worker";

export default {
  props: {
    outputOnly: Boolean,
    data: {
      type: Object,
      default() {
        return {
          sheets: [],
          headers: [],
          customHeaders: [],
          sheetIndex: 0,
          fileName: "",
          files: []
        };
      }
    },
    actions: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      customHeaders: false,
      files: [],
      isLoading: false,
      myWorker: null,
      currentPage: 1,
      perPage: 25,
      fileNameModalActive: false,
      openWithApp: {
        click: null,
        app: null,
        options: ["Extract", "Compare", "Merge"]
      }
    };
  },
  methods: {
    // @vuese
    // Removes current file data from Data Object
    removeFile: function() {
      this.data.files.splice(0, this.data.files.length);
      this.data.fileName = "";
      this.data.sheetIndex = 0;
      this.data.sheets.splice(0, this.data.sheets.length);
      this.data.customHeaders.splice(0, this.data.customHeaders.length);
      this.data.headers.splice(0, this.data.headers.length);
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
          XLSX.utils.book_append_sheet(wb, ws, this.data.files[i]);
        }
        XLSX.writeFile(wb, this.data.fileName);
      }
    },
    // @vuese
    // Opens submenu in OpenWithApp Dropdown
    openMenu(menuName) {
      if (this.openWithApp.click != menuName) {
        this.openWithApp.click = menuName;
      } else {
        this.openWithApp.click = null;
      }
    },
    loadExcel(event) {
      /*eslint no-console: ["error", {"allow": ["log"]}] */
      this.isLoading = true;
      this.myWorker.postMessage([event.target.result, this.fileName]);
    },
    updateData(result) {
      this.data.sheets.push(...result.data.sheets);
      this.data.customHeaders.push(...result.data.customHeaders);
      this.data.headers.push(...result.data.headers);
      this.data.files.push(...result.data.sheetNames);
      this.isLoading = false;
    },
    decrementSheetIndex() {
      if (this.data.sheetIndex > 0) {
        this.data.sheetIndex -= 1;
        this.customHeaders =
          this.data.customHeaders[this.data.sheetIndex].length > 0;
      }
    },
    incrementSheetIndex() {
      if (this.data.sheetIndex < this.data.sheets.length - 1) {
        this.data.sheetIndex += 1;
        this.customHeaders =
          this.data.customHeaders[this.data.sheetIndex].length > 0;
      }
    }
  },
  watch: {
    files() {
      if (this.files.length > 0) {
        for (let i = 0; i < this.files.length; i++) {
          let file = this.files[i];
          this.data.fileName = file.name;
          let reader = new FileReader();
          reader.onload = this.loadExcel;
          if (file.type === "text/plain") {
            reader.readAsText(file);
          } else {
            reader.readAsArrayBuffer(file);
          }
        }
        this.files.splice(0, this.files.length);
      }
    },
    // @vuese
    // Transfer data to another CyberAtlas tool leveraging props.actions
    "openWithApp.app": function() {
      let app = this.openWithApp.app;
      if ("openWith" in this.actions && app != null) {
        if (app === "Map") {
          this.actions.openWith("Map", { input1: this.data });
        } else {
          let parts = app.split("_");
          if (parts[1] === "Input1") {
            this.actions.openWith(parts[0], { input1: this.data });
          } else if (parts[1] === "Input2") {
            this.actions.openWith(parts[0], { input2: this.data });
          } else {
            this.actions.transferBothInputs(parts[0]);
          }
        }
      } else {
        console.log("HELP!");
      }
    }
  },
  created() {
    if (window.Worker) {
      this.myWorker = new DataWorker();
      this.myWorker.onmessage = this.updateData;
    }
  },
  beforeDestroy() {
    this.myWorker.terminate();
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
.clickable {
  cursor: pointer;
}
v-deep .pagination-previous:focus,
.pagination-next:focus,
.pagination-link:focus {
  border-color: #167df0;
}
td textarea {
  background-color: inherit;
  min-width: 100%;
  padding: 0.6em 0.75em;
  border-width: 0px;
  font-size: 1em;
  resize: none;
  vertical-align: middle;
}
</style>
