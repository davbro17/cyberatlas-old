<template>
  <b-field type="is-info" grouped>
    <b-select
      placeholder="Select a Color"
      v-model="selected"
      @input="updateColor"
    >
      <option v-for="(value, name) in borderColors" :value="name" :key="value">
        {{ name }}
      </option>
      <option value="custom">
        custom
      </option>
    </b-select>
    <b-field>
      <input
        class="input is-info"
        :disabled="selected in borderColors"
        @input="customColor"
        v-model="custom"
      />
    </b-field>
    <button
      class="button is-text"
      :style="[
        selected === 'none'
          ? { 'border-color': 'none' }
          : selected === 'custom'
          ? { 'border-color': custom }
          : {
              'border-color': borderColors[selected]
            },
        fillColor === 'none'
          ? { 'background-color': '#ffffff' }
          : { 'background-color': fillColor },
        rounded ? {} : { 'border-radius': '0px' }
      ]"
    >
      Example
    </button>
  </b-field>
</template>
<script>
import { borderColors } from "../../transform/defaults/colors.js";

export default {
  props: ["value", "fillColor", "rounded"],
  data() {
    return {
      borderColors,
      selected: this.value,
      custom: this.value
    };
  },
  methods: {
    updateColor() {
      this.custom =
        this.selected === "custom"
          ? this.custom
          : this.borderColors[this.selected];
      this.$emit("input", this.custom);
    },
    customColor() {
      this.$emit("input", this.custom);
    }
  },
  mounted() {
    const val = Object.keys(this.borderColors).find(
      c => this.borderColors[c] === this.value
    );
    if (val) {
      this.selected = val;
    } else {
      this.selected = "custom";
    }
  },
  watch: {
    value() {
      const val = Object.keys(this.borderColors).find(
        c => this.borderColors[c] === this.value
      );
      if (val) {
        this.selected = val;
      } else {
        this.selected = "custom";
      }
    }
  }
};
</script>
