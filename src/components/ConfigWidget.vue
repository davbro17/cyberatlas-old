<template>
  <div class="column">
    <b-collapse aria-id="contentIDforWidget2" :open="true">
      <div
        class="panel-heading"
        slot="trigger"
        role="button"
        aria-controls="contentIDforWidget2"
        @click="isOpen = !isOpen"
      >
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <strong>Step 2: Filter Data and Configure Diagram</strong>
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
      <div class="panel-block" style="display:block">
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
                  width="80"
                  centered
                >
                  <template slot="header" slot-scope="{ column }">
                    <strong>{{ column.label }}</strong>
                  </template>
                  <button
                    class="button is-info is-fullwidth"
                    :class="[
                      props.row.id == selected.id
                        ? 'is-outlined'
                        : 'is-inverted'
                    ]"
                    style="justify-content:left"
                  >
                    <b-icon :icon="props.row.icon" />
                    <span style="margin-right=0.3em">
                      <strong>{{ props.row.name }}</strong>
                    </span>
                  </button>
                </b-table-column>
              </template>
            </b-table>
          </div>
          <component v-bind:is="selected.component" :configs.sync="configs" />
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import CreateConfig from "./CreateConfig";
import CloudConfig from "./CloudConfig";

export default {
  props: ["isOpen"],
  data() {
    return {
      configs: [
        {
          name: "Create New Object!",
          icon: "plus-square",
          component: "CreateConfig"
        }
      ],
      selected: {},
      column: [{ field: "name", label: "Diagram Objects", width: "40" }],
      file: null,
      displayedGroup: null
    };
  },
  components: {
    CreateConfig,
    CloudConfig
  },
  mounted() {
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
::v-deep .b-table .icon {
  position: relative;
}
::v-deep tbody {
  display: block;
  overflow: auto;
  height: 300px;
}
</style>
