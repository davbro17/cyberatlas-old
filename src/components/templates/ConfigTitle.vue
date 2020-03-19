<template>
  <b-field grouped>
    <b-checkbox
      type="is-info"
      v-if="defaults && initialized"
      v-model="force"
      @input="updateTracker"
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
    }
  },
  data() {
    return {
      initialized: false,
      force: false
    };
  },
  methods: {
    updateTracker() {
      this.$set(this.defaults, this.config, this.force);
    }
  },
  mounted() {
    if (this.defaults) {
      this.force = this.defaults[this.config];
    }
    this.initialized = true;
  },
  computed: {
    title() {
      const layers = this.label.split(".");
      return layers[layers.length - 1];
    }
  }
};
</script>
