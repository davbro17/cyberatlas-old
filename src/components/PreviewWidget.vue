<template>
  <div class="column is-full">
    <b-field>
      <b-radio-button
        type="is-info"
        v-model="selected"
        v-for="(option, index) in options"
        :native-value="option"
        :key="index"
      >
        <span> {{ option }} </span>
      </b-radio-button>
    </b-field>
    <!-- DRAWIO IFRAME -->
    <div class="iframe-container" v-show="selected === options[0]">
      <iframe ref="preview" src="./drawio/index.html" allowfullscreen />
    </div>
    <textarea
      v-if="selected === options[1]"
      v-model="input"
      class="textarea is-info"
      rows="20"
    />
    <textarea
      v-if="selected === options[2]"
      v-model="configurations"
      class="textarea is-info"
      rows="20"
    />
  </div>
</template>

<script>
export default {
  props: {
    input: String,
    configs: Array
  },
  data() {
    return {
      iframe: null,
      options: ["Sketch", "XML", "Configs"],
      selected: "Sketch",
      configurations: "{}"
    };
  },
  watch: {
    input() {
      this.iframe.createGraph(this.input);
      this.configurations = JSON.stringify(this.configs);
    }
  },
  mounted: function() {
    this.iframe = this.$refs.preview.contentWindow;
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
