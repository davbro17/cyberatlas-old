<template>
  <div class="columns">
    <!-- Config Select Interface -->
    <div class="column is-narrow">
      <b-table
        :data="configs"
        :selected.sync="selected"
        focusable
        narrowed
        bordered
        paginated
        pagination-simple
        :per-page="perPage"
      >
        <template slot-scope="props">
          <!-- Table Column -->
          <b-table-column
            field="title"
            label="Diagram Objects"
            width="100"
            centered
          >
            <!-- Table Rows -->
            <button
              class="button is-fullwidth"
              @click="createConfigOpen = false"
              :class="[
                props.row.id == selected.id && !createConfigOpen
                  ? 'is-outlined is-info is-active'
                  : 'is-inverted is-clear'
              ]"
              style="justify-content:left;"
            >
              <b-icon :icon="props.row.icon" />
              <span
                style="margin-right=0.3em; overflow:hidden; text-overflow:ellipsis; max-width: 165px;"
              >
                <strong>{{ props.row.title }}</strong>
              </span>
            </button>
          </b-table-column>
        </template>
        <!-- Table Footer -->
        <template #footer>
          <button
            class="button is-info is-outlined is-fullwidth"
            style="border-radius:0; border-bottom-style:none"
            @click.stop="createConfigOpen = true"
          >
            Create New Diagram Object
          </button>
          <div class="field has-addons">
            <p class="control">
              <!-- Delete Diagram Object Button -->
              <button
                class="button is-danger is-outlined"
                @click="deleteConfig"
                style="border-radius:0;"
              >
                <b-icon icon="times" />
                <span>
                  Delete
                </span>
              </button>
            </p>
            <!-- Download Configurations Button -->
            <p class="control is-expanded">
              <button
                class="button is-info is-outlined is-fullwidth"
                @click="downloadConfigs"
                style="border-radius:0;"
              >
                <span>Download</span>
                <b-icon icon="download" />
              </button>
            </p>
          </div>
          <a ref="configdownloader" style="display:none" />
        </template>
        <!-- Slot Left of Pagination -->
        <template #bottom-left>
          <input
            class="input is-info has-text-centered"
            type="text"
            placeholder="25"
            v-model.number="perPage"
            style="width:60%"
          />
        </template>
        <!-- Empty Table HTML -->
        <template slot="empty">
          <span class="has-text-centered">
            <p>Nothing Here Yet</p>
          </span>
        </template>
      </b-table>
    </div>
    <!-- Configuration Area -->
    <CreateConfig
      v-if="createConfigOpen || configs.length == 0"
      :configs.sync="configs"
    />
    <component
      v-else
      v-bind:is="selected.component"
      :configs.sync="configs"
      :self.sync="this.selected"
      :data="this.data"
    />
  </div>
</template>

<script>
import CreateConfig from "./configs/CreateConfig.vue";
import CloudConfig from "./configs/CloudConfig.vue";
import SubnetConfig from "./configs/SubnetConfig.vue";
import NetDeviceConfig from "./configs/NetDeviceConfig.vue";
import NetworksConfig from "./configs/NetworksConfig.vue";
import CollectionConfig from "./configs/CollectionConfig.vue";
import TextBoxConfig from "./configs/TextBoxConfig.vue";

export default {
  props: {
    // Configurations for creating Diagram Objects
    configs: {
      type: Array,
      default() {
        return [];
      }
    },
    data: {
      type: Object,
      required: true
    }
  },
  components: {
    CreateConfig,
    CloudConfig,
    SubnetConfig,
    NetworksConfig,
    CollectionConfig,
    NetDeviceConfig,
    TextBoxConfig
  },
  data() {
    return {
      // @vuese
      // Currently Selected Configuration
      selected: {},
      // @vuese
      // Uploaded Configuration File
      file: null,
      // @vuese
      // Boolean tracks if createConfig Widget is visible
      createConfigOpen: true,
      // @vuese
      // Number of config buttons show in diagram object table
      perPage: 10
    };
  },
  methods: {
    // @vuese
    // Delete the selected diagram object/configuration.
    // Does NOT delete the `Create Diagram Object` configuration.
    deleteConfig() {
      if (this.selected.component != "CreateConfig") {
        let id = this.selected.id;
        for (let i = 0; i < this.configs.length; i++) {
          if (this.configs[i].id === id) {
            this.configs.splice(i, 1);
            // decrement index by one to avoid index error with array
            i--;
            // Change the current config to one before the deleted config
            this.selected = this.configs[i];
          }
        }
      }
    },
    // @vuese
    // Download the configurations as a JSON file
    downloadConfigs() {
      let configs = [...this.configs];
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(configs));
      this.$refs.configdownloader.setAttribute("href", dataStr);
      this.$refs.configdownloader.setAttribute("download", "configs.json");
      this.$refs.configdownloader.click();
    }
  },
  mounted() {
    this.configs.push({ title: "test", icon: "times" });
    setTimeout(() => {
      this.configs.pop();
    }, 10);
  }
};
</script>
<style lang="scss" scoped>
::v-deep .table tr.is-selected {
  background-color: #fff;
}
::v-deep .b-table .table:focus {
  border-color: #dbdbdb;
}
::v-deep .table tr.is-selected:focus {
  border: 1px solid #dbdbdb;
}
::v-deep .table tr.is-selected td {
  border: 1px solid #dbdbdb;
}
::v-deep .table td {
  border: 1px solid #dbdbdb;
}
::v-deep .b-table .icon {
  position: relative;
}
::v-deep tbody {
  overflow: auto;
  max-height: 300px;
  border: 1px solid #dbdbdb;
}
::v-deep div > .level-left {
  width: 100px;
}
.is-clear {
  background-color: #fff;
  border-color: transparent;
  color: #363636;
}
</style>
