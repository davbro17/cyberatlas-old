<template>
  <div class="column is-full">
    <!-- Panel Header -->
    <div class="panel-heading pointer" @click="togglePanel">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <strong>Step 3:</strong>
          </div>
          <!-- PREVIEW Button -->
          <div class="level-item">
            <a class="button is-info is-outlined" @click="preview">
              <span><strong>Preview</strong></span>
              <b-icon icon="sync" size="is-small" />
            </a>
          </div>
          <div class="level-item">
            <strong>and</strong>
          </div>
          <!-- GENERATE Button -->
          <div class="level-item">
            <a class="button is-info is-outlined" @click="generateDiagram">
              <span><strong>Generate Diagram</strong></span>
              <b-icon icon="external-link-alt" size="is-small" />
            </a>
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
    <!-- Panel Box -->
    <div
      class="box"
      v-bind:style="{
        'border-radius': '0px',
        margin: '1px',
        display: isOpen ? 'block' : 'none'
      }"
    >
      <!-- DRAWIO IFRAME -->
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
var testdata = `
<mxGraphModel dx="1426" dy="536" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="ZZeIv4ZfNzZEC-vSkkao-1" value="Hello World" style="rounded=0;whiteSpace=wrap;html=1;" parent="1" vertex="1">
      <mxGeometry x="120" y="60" width="190" height="110" as="geometry"/>
    </mxCell>
  </root>
</mxGraphModel>
`;

export default {
  props: ["getData", "getConfigs"],
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
        var win = window.open("./drawio/index.html");
        win.onload = function() {
          win.document.getElementById("mxfile").innerHTML = encodeURI(testdata);
          win.createGraph();
          win.edit();
        };
      }
    },
    togglePanel: function() {
      if (this.toggleLock) {
        this.toggleLock = false;
      } else {
        this.isOpen = !this.isOpen;
      }
    },
    preview() {
      /*eslint no-console: ["error", {"allow": ["log"]}] */
      console.log(this.getData());
      console.log(this.getConfigs());
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
