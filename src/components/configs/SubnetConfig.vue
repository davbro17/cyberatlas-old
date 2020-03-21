<template>
  <TemplateConfig :self.sync="self" autosizing :defaults.sync="defaults">
    <!-- Data Tab -->
    <template #data>
      <div v-if="!self.singleton" class="field">
        <config-title
          label="Object Label"
          config="label"
          :defaults.sync="defaults"
        />
        <div class="field">
          <input
            class="input is-info"
            type="text"
            placeholder="none"
            v-model="self.label"
          />
        </div>
      </div>
      <div v-if="self.singleton">
        <config-title
          :label="'Conditional Render'"
          config="commands"
          :defaults.sync="defaults"
        >
          <template #extra>
            <b-checkbox
              v-if="self.singleton"
              type="is-info"
              v-model="self.conditionalRender"
            />
          </template>
        </config-title>
      </div>
      <div v-if="!self.singleton">
        <config-title
          :label="'Network Devices'"
          config="commands"
          :defaults.sync="defaults"
        />
      </div>
      <div class="field has-addons">
        <div class="control">
          <div class="select is-info">
            <select v-model="command.action">
              <option value="Filter">Filter</option>
              <option v-if="!self.singleton" value="Exclude">Exclude</option>
              <option v-if="!self.singleton" value="Create">Create</option>
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
            :disabled="command.action !== 'Filter'"
            :data="data.files"
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
            :disabled="command.action !== 'Filter'"
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
              <option v-if="!self.singleton" value="Exclude">Exclude</option>
              <option v-if="!self.singleton" value="Create">Create</option>
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
            :disabled="command.action !== 'Filter'"
          />
        </div>
        <div class="control">
          <input
            class="input is-info"
            type="text"
            placeholder="Column"
            v-model="self.commands[index].column"
            :disabled="command.action !== 'Filter'"
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
      <config-title
        label="Render If Empty"
        config="renderEmpty"
        :defaults.sync="defaults"
        v-if="!self.singleton"
      >
        <template #extra>
          <b-checkbox type="is-info" v-model="self.renderEmpty" />
        </template>
      </config-title>
      <config-title
        label="Device Label"
        config="lines"
        :defaults.sync="defaults"
      />
      <TextEditor :self.sync="self" :data.sync="data" />
    </template>
    <!-- Style Tab -->
    <template #style>
      <div v-if="!self.singleton">
        <config-title
          label="Background Color"
          config="style.fillColor"
          :defaults.sync="defaults"
        />
        <color-select
          v-model="self.style.fillColor"
          :rounded="self.style.rounded"
        />
        <config-title
          label="Border Color"
          config="style.strokeColor"
          :defaults.sync="defaults"
        />
        <border-color
          :fillColor="self.style.fillColor"
          v-model="self.style.strokeColor"
          :rounded="self.style.rounded"
        />
        <config-title
          label="Rounded Border"
          config="style.rounded"
          :defaults.sync="defaults"
        />
        <div class="field">
          <b-switch
            v-model="self.style.rounded"
            type="is-info"
            true-value="1"
            false-value="0"
          >
          </b-switch>
        </div>
      </div>
      <config-title
        label="Device Image"
        config="device.style.shape"
        :defaults.sync="defaults"
      />
      <device-stencil v-model="self.device.style.shape" />
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">width</label>
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
          <label class="label">height</label>
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
      <config-title
        label="Device Background Color"
        config="device.background.fillColor"
        :defaults.sync="defaults"
      />
      <color-select v-model="self.device.background.fillColor" rounded />
      <config-title
        label="Device Border Color"
        config="device.background.strokeColor"
        :defaults.sync="defaults"
      />
      <border-color
        :fillColor="self.device.background.fillColor"
        v-model="self.device.background.strokeColor"
        rounded
      />
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
        <label class="label">Device Layout</label>
      </div>
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">columns</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control has-icons-left">
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
          <label class="label">line height</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control is-expanded has-icons-left">
              <input
                class="input is-info"
                type="text"
                placeholder="10"
                v-model.number="self.device.lineHeight"
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
import ConfigTitle from "../templates/ConfigTitle.vue";
import ColorSelect from "../templates/ColorSelect.vue";
import BorderColor from "../templates/BorderColor.vue";
import DeviceStencil from "../templates/DeviceStencil.vue";

export default {
  props: {
    configs: {
      type: Array,
      default() {
        return [];
      }
    },
    data: {
      type: Object,
      default() {
        return {
          sheets: [],
          headers: [],
          files: [],
          customHeaders: [],
          fileName: ""
        };
      }
    },
    self: {
      type: Object,
      required: true
    },
    defaults: {
      type: Object,
      default() {
        return null;
      }
    }
  },
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
    TextEditor,
    ConfigTitle,
    BorderColor,
    ColorSelect,
    DeviceStencil
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
