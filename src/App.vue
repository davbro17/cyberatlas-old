<template>
  <div id="app">
    <section class="hero is-info">
      <div class="hero-body" style="padding-top:20px;padding-bottom:25px">
        <div class="container has-text-centered is-info">
          <div class="level-item">
            <figure class="image is-96x96 is-inline-block">
              <img src="./assets/cyberatlas.png" />
            </figure>
            <h1 class="title" style="margin-left:10px">
              CYBER ATLAS
            </h1>
          </div>
          <h2 class="subtitle">
            Charting The Far Reaches Of Blue Space
          </h2>
        </div>
      </div>
    </section>
    <div style="padding:1.5rem 1.5rem;">
      <ConfigWidget />
    </div>
  </div>
</template>

<script>
import ConfigWidget from "./components/ConfigWidget.vue";

export default {
  name: "app",
  components: {
    ConfigWidget
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
