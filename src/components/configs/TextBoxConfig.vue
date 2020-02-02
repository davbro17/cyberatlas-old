<template>
  <TemplateConfig :self.sync="self">
    <!-- Data Tab -->
    <template #data>
      <div class="field has-addons">
        <div class="control">
          <div class="select is-info">
            <select v-model="selected">
              <option
                v-for="(option, index) in options"
                v-bind:key="index"
                :value="index"
              >
                {{ option }}
              </option>
            </select>
          </div>
        </div>
        <div class="control">
          <button class="button is-info" @click="addElement">Add</button>
        </div>
      </div>
      <div
        v-for="(elem, index) in self.elements"
        class="field"
        v-bind:key="index"
      >
        <div class="control">
          <!-- Text & HTML Elements 
            Both are able to share a textarea-->
          <textarea
            v-if="elem.name === 'Text' || elem.name === 'HTML'"
            class="textarea is-info"
            v-model="self.elements[index].input"
            :placeholder="elem.placeholder"
          ></textarea>
          <!-- Line Element -->
          <hr style="background-color:black;" v-if="elem.name === 'Line'" />
          <!-- Metadata Element -->
          <div class="select is-info" v-if="elem.name === 'Metadata'">
            <select v-model="elem.selected">
              <option
                v-for="(option, index) in elem.options"
                v-bind:key="index"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </template>
    <!-- Style Tab -->
    <template #style>
      <div class="field">
        <label class="label">
          Rounded Border
        </label>
        <b-switch
          v-model="self.style.rounded"
          type="is-info"
          true-value="1"
          false-value="0"
        >
        </b-switch>
      </div>
    </template>
  </TemplateConfig>
</template>

<script>
import TemplateConfig from "./TemplateConfig.vue";
import { textBoxElements } from "../../transform/configs/textbox.js";

let elements = textBoxElements;

export default {
  props: ["configs", "self", "data"],
  data() {
    return {
      options: [],
      selected: 0
    };
  },
  components: {
    TemplateConfig
  },
  methods: {
    addElement() {
      if (!this.self.elements) {
        this.$set(this.self, "elements", []);
      }
      let elem = JSON.parse(JSON.stringify(elements[this.selected]));
      this.self.elements.push(elem);
    }
  },
  mounted() {
    if (!this.options.length) {
      for (let i = 0; i < elements.length; i++) {
        this.options.push(elements[i].name);
      }
    }
  }
};
</script>
