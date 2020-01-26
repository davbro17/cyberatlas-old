<template>
  <div class="column">
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
    <div
      class="panel-block"
      v-bind:style="{ display: isOpen ? 'block' : 'none' }"
    >
      <div class="columns">
        <div class="column is-narrow">
          <b-table
            :data="configs"
            :selected.sync="selected"
            focusable
            narrowed
            bordered
          >
            <template slot-scope="props">
              <b-table-column
                field="name"
                label="Diagram Objects"
                width="100"
                centered
              >
                <template slot="header" slot-scope="{ column }">
                  <strong>{{ column.label }}</strong>
                </template>
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
                    <strong>{{ props.row.name }}</strong>
                  </span>
                </button>
              </b-table-column>
            </template>
            <template #footer>
              <div class="field has-addons">
                <p class="control">
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
        <component
          v-bind:is="selected.component"
          :configs.sync="configs"
          :self="this.selected"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CreateConfig from "./CreateConfig";
import CloudConfig from "./CloudConfig";

export default {
  props: ["configs"],
  data() {
    return {
      selected: {},
      column: [{ field: "name", label: "Diagram Objects", width: "40" }],
      file: null,
      displayedGroup: null,
      isOpen: true
    };
  },
  components: {
    CreateConfig,
    CloudConfig
  },
  methods: {
    togglePanel() {
      this.isOpen = !this.isOpen;
      this.$emit("toggleConfigPanel");
    },
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
    if (this.configs.length == 0) {
      this.configs.push({
        name: "Create New Object!",
        icon: "plus-square",
        component: "CreateConfig"
      });
    }
    this.selected = this.configs[0];
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
