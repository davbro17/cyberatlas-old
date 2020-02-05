<template>
  <TemplateConfig :self.sync="self">
    <!-- Data Tab -->
    <template #data>
      <div class="field">
        <label class="label">
          Network Label
        </label>
        <input
          class="input is-info"
          type="text"
          placeholder="none"
          v-model="self.label"
        />
      </div>
      <div class="field">
        <label class="label">
          Network Devices
        </label>
      </div>
      <div class="field has-addons">
        <div class="control">
          <div class="select is-info">
            <select v-model="command.action">
              <option value="Filter">Filter</option>
              <option value="Exclude">Exclude</option>
              <option value="Create">Create</option>
            </select>
          </div>
        </div>
        <div class="control">
          <input
            class="input is-info"
            type="text"
            placeholder="192.168.0.0/24"
            v-model="command.cidr"
          />
        </div>
        <div class="control">
          <a class="button is-active">
            From
          </a>
        </div>
        <b-field>
          <b-autocomplete
            placeholder="Sheet"
            open-on-focus
            v-model="command.sheet"
          />
        </b-field>
        <b-field>
          <b-autocomplete
            placeholder="Column"
            open-on-focus
            :data="
              data.customHeaders[data.sheetIndex] &&
              data.customHeaders[data.sheetIndex].length
                ? data.customHeaders[data.sheetIndex]
                : data.headers
            "
            v-model="command.column"
          />
        </b-field>
        <div class="control">
          <button class="button is-info is-outlined" @click="addCommand">
            <b-icon icon="plus" />
          </button>
        </div>
      </div>
      <div
        class="field has-addons"
        v-for="(command, index) in self.commands"
        v-bind:key="index"
      >
        <div class="control">
          <div class="select is-info">
            <select v-model="self.commands[index].action">
              <option value="Filter">Filter</option>
              <option value="Exclude">Exclude</option>
              <option value="Create">Create</option>
            </select>
          </div>
        </div>
        <div class="control">
          <input
            class="input is-info"
            type="text"
            placeholder="192.168.0.0/24"
            v-model="self.commands[index].cidr"
          />
        </div>
        <div class="control">
          <a class="button is-active">
            From
          </a>
        </div>
        <div class="control">
          <input
            class="input is-info"
            type="text"
            placeholder="Sheet"
            v-model="self.commands[index].sheet"
          />
        </div>
        <div class="control">
          <input
            class="input is-info"
            type="text"
            placeholder="Column"
            v-model="self.commands[index].column"
          />
        </div>
        <div class="control">
          <button
            class="button is-danger is-outlined"
            @click="deleteCommand(index)"
          >
            <b-icon icon="times" />
          </button>
        </div>
      </div>
      <div class="field">
        <label class="label">
          Device Label
        </label>
      </div>
      <TextEditor :self.sync="self" :data.sync="data"></TextEditor>
    </template>
    <!-- Style Tab -->
    <template #style>
      <div class="field">
        <label class="label">
          Image
        </label>
        <input
          class="input is-info"
          type="text"
          placeholder="mxgraph.citrix.thin_client"
          v-model="self.device.style.shape"
        />
      </div>
      <div class="field">
        <label class="label">
          Background Color
        </label>
        <input
          class="input is-info"
          type="text"
          placeholder="green"
          v-model="self.style.fillColor"
        />
      </div>
      <div class="field">
        <label class="label">
          Rounded Border
        </label>
        <b-switch
          v-model.number="self.style.rounded"
          type="is-info"
          true-value="1"
          false-value="0"
        >
        </b-switch>
      </div>
    </template>
    <!-- Layout Tab -->
    <template #layout>
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">padding left</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control is-expanded has-icons-left">
              <input
                class="input is-info"
                type="text"
                placeholder="10"
                v-model.number="self.padding.left"
              />
            </p>
          </div>
        </div>
      </div>
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">padding top</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control is-expanded has-icons-left">
              <input
                class="input is-info"
                type="text"
                placeholder="10"
                v-model.number="self.padding.top"
              />
            </p>
          </div>
        </div>
      </div>
      <div class="field">
        <label class="label">Network Layout</label>
      </div>
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">Columns</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control is-expanded has-icons-left">
              <input
                class="input is-info"
                type="text"
                placeholder="10"
                v-model.number="self.device.columns"
              />
            </p>
          </div>
        </div>
      </div>
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">padding left</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control is-expanded has-icons-left">
              <input
                class="input is-info"
                type="text"
                placeholder="10"
                v-model.number="self.device.padding.left"
              />
            </p>
          </div>
        </div>
      </div>
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">padding top</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control is-expanded has-icons-left">
              <input
                class="input is-info"
                type="text"
                placeholder="10"
                v-model.number="self.device.padding.top"
              />
            </p>
          </div>
        </div>
      </div>
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">box width</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control is-expanded has-icons-left">
              <input
                class="input is-info"
                type="text"
                placeholder="10"
                v-model.number="self.device.width"
              />
            </p>
          </div>
        </div>
      </div>
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">box height</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control is-expanded has-icons-left">
              <input
                class="input is-info"
                type="text"
                placeholder="10"
                v-model.number="self.device.height"
              />
            </p>
          </div>
        </div>
      </div>
    </template>
  </TemplateConfig>
</template>

<script>
import TemplateConfig from "./TemplateConfig.vue";
import TextEditor from "./TextEditor.vue";

export default {
  props: ["configs", "self", "data"],
  data() {
    return {
      command: {
        action: "Filter",
        cidr: "",
        sheet: "",
        column: "",
        id: null
      }
    };
  },
  methods: {
    addCommand() {
      if (!this.self.commands) {
        this.$set(this.self, "commands", []);
      }
      let tmp = Object.assign({}, this.command);
      tmp.id = this.self.id;
      this.self.commands.unshift(tmp);
    },
    deleteCommand(index) {
      this.self.commands.splice(index, 1);
    }
  },
  components: {
    TemplateConfig,
    TextEditor
  },
  mounted() {
    if (!this.self.lines) {
      this.$set(this.self, "lines", []);
    }
    this.command.id = this.self.id;
  }
};
</script>
<style scoped>
::v-deep .input:active {
  border-color: #167df0;
}
::v-deep .input:focus {
  border-color: #167df0;
}
::v-deep .input:hover {
  border-color: #167df0;
}
::v-deep .input {
  border-color: #167df0;
}
::v-deep .button.is-active {
  border-color: #167df0;
}
::v-deep .field.has-addons .control:first-child .control .input {
  border-bottom-right-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-left-radius: 0px;
  border-top-left-radius: 0px;
}
</style>
