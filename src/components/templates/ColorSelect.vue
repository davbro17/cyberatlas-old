<template>
  <b-field type="is-info" grouped>
    <b-select
      placeholder="Select a Color"
      v-model="selected"
      @input="updateColor"
    >
      <option v-for="(value, name) in colors" :value="name" :key="value">
        {{ name }}
      </option>
      <option value="none">
        none
      </option>
      <option value="custom">
        custom
      </option>
    </b-select>
    <b-field>
      <input
        class="input is-info"
        :disabled="selected in colors"
        @input="customColor"
        v-model="custom"
      />
    </b-field>
    <button
      class="button is-text"
      :style="[
        selected === 'none'
          ? { 'background-color': '#ffffff' }
          : selected === 'custom'
          ? { 'background-color': custom }
          : { 'background-color': colors[selected] },
        rounded ? {} : { 'border-radius': '0px' }
      ]"
    >
      Example
    </button>
  </b-field>
</template>
<script>
import { colors } from "../../transform/defaults/colors.js";

export default {
  props: ["value", "rounded"],
  data() {
    return {
      colors,
      selected: this.value,
      custom: this.value
    };
  },
  methods: {
    updateColor() {
      this.custom =
        this.selected === "custom" ? this.custom : this.colors[this.selected];
      this.$emit("input", this.custom);
    },
    customColor() {
      this.$emit("input", this.custom);
    }
  },
  mounted() {
    const val = Object.keys(this.colors).find(
      c => this.colors[c] === this.value
    );
    if (val) {
      this.selected = val;
    } else {
      this.selected = "custom";
    }
  }
};
</script>
