<template>
  <!-- Main Application -->
  <div class="columns is-multiline add-space">
    <!-- Data Widget -->
    <PanelBlock>
      <template #title>
        Automate A Workflow!
      </template>
      <template #content>
        <!-- Action Bar -->
        <div class="level">
          <div class="level-left">
            <!-- 'Check All Steps' Checkbox -->
            <div class="level-item">
              <b-checkbox type="is-info" v-model="checkAll" />
            </div>
            <div class="level-item">
              <button class="button is-info is-outlined" @click="addStep">
                <b-icon icon="plus" />
                <span> Add Step </span>
              </button>
            </div>
            <div class="level-item">
              <button class="button is-danger is-outlined" @click="deleteSteps">
                <b-icon icon="times" />
                <span> Delete Step </span>
              </button>
            </div>
            <div class="level-item">
              <button class="button is-dark is-outlined">
                <b-icon icon="upload" />
                <span> Upload Steps </span>
              </button>
            </div>
            <div class="level-item">
              <button class="button is-dark is-outlined">
                <b-icon icon="upload" />
                <span> Upload Input </span>
              </button>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <button class="button is-info is-outlined">
                <b-icon icon="download" />
                <span> Download Steps </span>
              </button>
            </div>
            <div class="level-item">
              <button class="button is-info is-outlined">
                <b-icon icon="rocket" />
                <span>LAUNCH </span>
              </button>
            </div>
          </div>
        </div>
        <draggable tag="div" :list="steps" class="list-group" handle=".handle">
          <div
            class="field is-grouped list-group-item"
            v-for="element in steps"
            :key="element.id"
          >
            <!-- Step Selector Checkbox -->
            <b-field>
              <b-checkbox
                type="is-info"
                style="vertical-align:middle"
                v-model="element.checked"
              />
            </b-field>
            <div class="field has-addons">
              <div class="control">
                <button class="button is-dark is-outlined">
                  <b-icon icon="bars" class="handle" />
                </button>
              </div>
              <!-- Operation Dropdown -->
              <div class="control">
                <div class="select is-info">
                  <select v-model="element.op">
                    <option v-for="op in operations" :key="op" :value="op">
                      {{ op }}
                    </option>
                  </select>
                </div>
              </div>
              <!-- Input 1 Dropdown -->
              <b-dropdown v-model="element.inputA" multiple class="control">
                <button
                  class="button is-active is-info is-outlined"
                  style="pointerEvents:none; color: black;"
                  type="button"
                  slot="trigger"
                >
                  <span
                    >{{ "Input A (" + element.inputA.length.toString() + ")" }}
                  </span>
                  <b-icon icon="chevron-down" size="is-small" type="is-info" />
                </button>
                <b-dropdown-item value="input1"> Ips.csv</b-dropdown-item>
                <b-dropdown-item value="input2"> PPI.csv</b-dropdown-item>
              </b-dropdown>
              <!-- Input 2 Dropdown -->
              <b-dropdown
                v-model="element.inputB"
                multiple
                class="control"
                style="margin-left:0px;"
              >
                <button
                  class="button is-active is-info is-outlined"
                  style="pointerEvents:none; color: black;"
                  type="button"
                  slot="trigger"
                >
                  <span
                    >{{ "Input B (" + element.inputB.length.toString() + ")" }}
                  </span>
                  <b-icon icon="chevron-down" size="is-small" type="is-info" />
                </button>
                <b-dropdown-item value="input1"> Ips.csv</b-dropdown-item>
                <b-dropdown-item value="input2"> PPI.csv</b-dropdown-item>
              </b-dropdown>
              <!-- Configurations Dropdown -->
              <b-dropdown multiple class="control" style="margin-left:0px;">
                <button
                  class="button is-active is-info is-outlined"
                  style="pointerEvents:none; color: black;"
                  type="button"
                  slot="trigger"
                >
                  <span>Configurations</span>
                  <b-icon icon="chevron-down" size="is-small" type="is-info" />
                </button>
                <b-dropdown-item> configs1.csv</b-dropdown-item>
                <b-dropdown-item> configs2.csv</b-dropdown-item>
              </b-dropdown>
              <div class="control">
                <a
                  class="button is-active is-info is-outlined"
                  style="pointerEvents:none; color: black;"
                >
                  Output Name:
                </a>
              </div>
              <div class="control">
                <input class="input is-info" v-model="element.name" />
              </div>
            </div>
          </div>
        </draggable>
      </template>
    </PanelBlock>
  </div>
</template>
<script>
import PanelBlock from "../components/templates/PanelBlock.vue";
import draggable from "vuedraggable";

export default {
  components: {
    PanelBlock,
    draggable
  },
  data() {
    return {
      steps: [
        {
          op: "Extract",
          inputA: [],
          inputB: [],
          name: "John",
          text: "",
          id: 0
        },
        {
          op: "Merge",
          checked: false,
          inputA: [],
          inputB: [],
          name: "Joao",
          text: "",
          id: 1
        },
        {
          op: "Map",
          checked: false,
          inputA: [],
          inputB: [],
          name: "Jean",
          text: "",
          id: 2
        }
      ],
      checkAll: false,
      operations: [
        "Extract",
        "Merge",
        "Compare",
        "Map",
        "Download",
        "Interact"
      ],
      id: 3
    };
  },
  methods: {
    deleteSteps() {
      for (let i = 0; i < this.steps.length; i++) {
        if (this.steps[i].checked) {
          this.steps.splice(i, 1);
          i--;
        }
      }
    },
    addStep() {
      this.id++;
      this.steps.push({
        op: "Map",
        checked: this.checkAll,
        inputA: [],
        inputB: [],
        name: "Jean",
        text: "",
        id: Date.now() + this.id
      });
    }
  },
  watch: {
    checkAll() {
      const bool = this.checkAll;
      this.steps.forEach(s => (s.checked = bool));
    }
  }
};
</script>
<style scoped>
.close {
  float: right;
  padding-top: 8px;
  padding-bottom: 8px;
}
input {
  display: inline-block;
  width: 50%;
}
.text {
  margin: 20px;
}
</style>
