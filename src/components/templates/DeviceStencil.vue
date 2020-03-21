<template>
  <b-field>
    <b-autocomplete
      v-model="name"
      :data="filteredDataArray"
      placeholder="cloud"
      clearable
      @input="updateStencil"
      width="100%"
    >
      <template slot="empty">No results found</template>
    </b-autocomplete>
  </b-field>
</template>
<script>
import { deviceStencils } from "../../transform/defaults/device_stencils.js";

export default {
  props: ["value"],
  data() {
    return {
      deviceStencils,
      name: this.value
    };
  },
  methods: {
    updateStencil(option) {
      const tmp = option in deviceStencils ? deviceStencils[option] : option;
      this.$emit("input", tmp);
    }
  },
  computed: {
    filteredDataArray() {
      return Object.keys(this.deviceStencils).filter(option => {
        return (
          option
            .toString()
            .toLowerCase()
            .indexOf(this.name) >= 0
        );
      });
    }
  },
  mounted() {
    const val = Object.keys(this.deviceStencils).find(
      c => this.deviceStencils[c] === this.value
    );
    if (val) {
      this.name = val;
    }
  }
};
</script>
