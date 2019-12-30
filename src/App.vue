<template>
  <div id="app">
    <section class="hero is-info">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">
            CYBER ATLAS
          </h1>
          <h2>
            Charting The Far Reaches Of Blue Space
          </h2>
        </div>
      </div>
    </section>
    <section class="section">
      <ConfigWidget />
    </section>
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
