<template>
  <div class="column is-full">
    <div class="panel-heading pointer" @click="togglePanel">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <strong>Step 3:</strong>
          </div>
          <div class="level-item">
            <button class="button is-info is-outlined">
              <span><strong>Preview</strong></span>
              <b-icon icon="sync" size="is-small" />
            </button>
          </div>
          <div class="level-item">
            <strong>and</strong>
          </div>
          <div class="level-item">
            <button class="button is-info is-outlined" @click="generateDiagram">
              <span><strong>Generate Diagram</strong></span>
              <b-icon icon="external-link-alt" size="is-small" />
            </button>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <b-icon :icon="isOpen ? 'angle-down' : 'angle-up'" size="is-small">
            </b-icon>
          </div>
        </div>
      </div>
    </div>
    <div
      class="box"
      v-bind:style="{
        'border-radius': '0px',
        margin: '1px',
        display: isOpen ? 'block' : 'none'
      }"
    >
      <div class="iframe-container">
        <iframe
          ref="preview"
          src="./drawio/index.html?preview=true"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: true,
      toggleLock: false,
      iframe: null
    };
  },
  methods: {
    generateDiagram: function() {
      if (this.iframe) {
        this.toggleLock = true;
        window.open("./drawio/index.html");
      }
    },
    togglePanel: function() {
      if (this.toggleLock) {
        this.toggleLock = false;
      } else {
        this.isOpen = !this.isOpen;
      }
    }
  },
  mounted: function() {
    this.iframe = this.$refs.preview;
  }
};
</script>
<style>
.panel-heading.pointer {
  cursor: pointer;
}

.iframe-container {
  overflow: hidden;
  padding-top: 56.25%;
  position: relative;
}

.iframe-container iframe {
  border: 0;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

/* 4x3 Aspect Ratio */
.iframe-container-4x3 {
  padding-top: 75%;
}
</style>
