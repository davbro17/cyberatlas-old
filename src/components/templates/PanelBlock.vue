<template>
  <div class="column" v-bind:class="widthClass" style="padding-bottom:0em;">
    <!-- Panel Header -->
    <div class="panel-heading pointer" @click="isOpen = !isOpen">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <strong><slot name="title"/></strong>
          </div>
          <slot name="dynamicTitle" />
        </div>
        <div class="level-right">
          <div class="level-item">
            <b-icon :icon="isOpen ? 'angle-down' : 'angle-up'" size="is-small">
            </b-icon>
          </div>
        </div>
      </div>
    </div>
    <!-- Panel Body -->
    <div class="panel-block" v-show="isOpen">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: Number,
      default: 48
    },
    widthClass: {
      type: String,
      default: "is-full"
    }
  },
  data() {
    return {
      isOpen: true
    };
  },
  methods: {
    togglePanel() {
      this.isOpen = !this.isOpen;
    }
  },
  watch: {
    // @vuese
    // Monitor the isOpen Boolean and emit events for parent components
    isOpen() {
      // Check if the panel is Open, yes -> emit "opened" event, else emit "closed" event
      this.$emit("toggle", this.isOpen);
    }
  }
};
</script>
<style>
.panel-heading.pointer {
  cursor: pointer;
}
.panel-heading > .level {
  height: 35px;
}
.panel-heading {
  padding: 0.25em 0.75em;
}
</style>
