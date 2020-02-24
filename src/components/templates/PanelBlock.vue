<template>
  <div class="column" v-bind:class="widthClass" style="padding-bottom:0em;">
    <article class="panel">
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
              <b-icon
                :icon="isOpen ? 'angle-down' : 'angle-up'"
                size="is-small"
              >
              </b-icon>
            </div>
          </div>
        </div>
      </div>
      <!-- Panel Body -->
      <div class="panel-body" v-show="isOpen">
        <slot name="content" />
      </div>
    </article>
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: Number,
      default: 530
    },
    widthClass: {
      type: String,
      default: "is-full"
    },
    Open: {
      type: Boolean,
      default: true
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
  },
  mounted() {
    this.isOpen = this.Open;
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
.panel-body {
  max-height: 523px;
  overflow: auto;
  border: 1px solid #dbdbdb;
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
    0 0 0 1px rgba(10, 10, 10, 0.02);
  padding: 0.5em 0.75em;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}
</style>
