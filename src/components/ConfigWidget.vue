<template>
  <div class="column">
    <!-- Panel Heading -->
    <div class="panel-heading pointer" @click="togglePanel">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <strong>Step 2: Filter Data and Configure Diagram</strong>
          </div>
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
      <div class="columns">
        <!-- Config Select Interface -->
        <div class="column is-narrow">
          <b-table
            :data="configs"
            :selected.sync="selected"
            focusable
            narrowed
            bordered
          >
            <template slot-scope="props">
              <!-- Table Column -->
              <b-table-column
                field="name"
                label="Diagram Objects"
                width="100"
                centered
              >
                <!-- Table header -->
                <template #header>
                  <strong>Diagram Objects</strong>
                </template>
                <!-- Table Rows -->
                <button
                  class="button is-fullwidth"
                  :class="[
                    props.row.id == selected.id
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
              <div class="field has-addons">
                <p class="control">
                  <!-- Delete Diagram Object Button -->
                  <button
                    class="button is-danger is-outlined"
                    @click="deleteConfig"
                  >
                    <b-icon icon="times" />
                    <span>
                      Delete
                    </span>
                  </button>
                </p>
                <!-- Download Configurations Button -->
                <p class="control is-expanded">
                  <button class="button is-info is-outlined is-fullwidth">
                    <span>Download</span>
                    <b-icon icon="download" />
                  </button>
                </p>
              </div>
            </template>
          </b-table>
        </div>
        <!-- Configuration Area -->
        <component
          v-bind:is="selected.component"
          :configs.sync="configs"
          :self="this.selected"
          :data="this.data"
        />
      </div>
    </div>
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
      // Is the Wiget's content visible?
      isOpen: true
    };
  },
  methods: {
    // @vuese
    // Toggle Widget to hide or show content
    togglePanel() {
      this.isOpen = !this.isOpen;
      // Inform other widget the Panel is hidden or visible
      this.$emit("toggleConfigPanel");
    },
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
    }
  },
  mounted() {
    // Check if the Configurations Array is empty
    // OR if the first config is not the CreateConfig
    if (
      this.configs.length == 0 ||
      this.configs[0].component != "CreateConfig"
    ) {
      // Add the `Create New Object` object to the configurations Array
      this.configs.unshift({
        title: "Create New Object!",
        icon: "plus-square",
        component: "CreateConfig"
      });
      this.selected = this.configs[0];
    }
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
.panel-heading.pointer {
  cursor: pointer;
}
.is-clear {
  background-color: #fff;
  border-color: transparent;
  color: #363636;
}
</style>
