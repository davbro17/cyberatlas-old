<template>
  <div id="app">
    <section class="hero is-info">
      <div class="hero-body" style="padding-top:5px;padding-bottom:10px">
        <div class="container has-text-centered is-info">
          <div class="level-item">
            <figure class="image is-64x64 is-inline-block">
              <img src="./assets/cyberatlas.png" />
            </figure>
            <h1 class="title" style="margin-left:10px">
              CYBER ATLAS
            </h1>
          </div>
          <h2 class="subtitle">
            Charting The Far Reaches Of Cyberspace
          </h2>
        </div>
      </div>
    </section>
    <div style="padding:1.5rem 1.5rem;">
      <div class="columns is-multiline">
        <UploadWidget :configOpen="configOpen" :data.sync="data" />
        <ConfigWidget
          :configs.sync="configs"
          @toggleConfigPanel="configOpen = !configOpen"
        />
        <PreviewWidget :data="data" :configs="configs" />
      </div>
    </div>
  </div>
</template>

<script>
import ConfigWidget from "./components/ConfigWidget.vue";
import UploadWidget from "./components/UploadWidget.vue";
import PreviewWidget from "./components/PreviewWidget.vue";

export default {
  name: "app",
  components: {
    UploadWidget,
    ConfigWidget,
    PreviewWidget
  },
  data() {
    return {
      data: [],
      customHeaders: [],
      headers: [],
      configs: [],
      configOpen: true
    };
  },
  watch: {
    widgetData() {
      /*eslint no-console: ["error", {"allow": ["log"]}] */
      console.log(this.widgetData.config.configs);
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
