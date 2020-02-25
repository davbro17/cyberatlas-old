<template>
  <b-field grouped>
    <b-checkbox
      type="is-info"
      v-if="defaults && initialized"
      v-model="defaults[config]"
    />
    <label
      class="label is-marginless"
      style="padding-right:10px;white-space:nowrap;padding-top: 0.375em;"
      >{{ title }}</label
    >
    <slot name="extra" />
  </b-field>
</template>
<script>
export default {
  props: {
    defaults: {
      type: Object,
      default() {
        return null;
      }
    },
    label: {
      type: String,
      required: true
    },
    config: {
      type: String,
      required: true
    },
    force: Boolean
  },
  data() {
    return {
      title: "",
      initialized: false
    };
  },
  mounted() {
    const layers = this.label.split(".");
    this.title = layers[layers.length - 1];
    if (this.defaults) {
      this.$set(this.defaults, this.config, this.force);
    }
    this.initialized = true;
  }
};
</script>
