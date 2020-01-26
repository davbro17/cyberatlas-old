<template>
  <div id="app">
    <!-- Navigation Bar -->
    <nav
      class="navbar is-info add-space has-shadow"
      role="navigation"
      aria-label="main navigation"
    >
      <!-- CyberAtlas Logo -->
      <div class="navbar-brand">
        <figure class="image is-64x64">
          <img src="./assets/cyberatlas.png" />
        </figure>
        <a class="navbar-item">
          <h1 class="title" style=";color:#fff;">
            CyberAtlas
          </h1>
        </a>
      </div>
      <div class="navbar-end">
        <!-- Documentation Link Button -->
        <div class="navbar-item">
          <button class="button is-info is-medium">
            <strong>
              Documentation
            </strong>
          </button>
        </div>
      </div>
    </nav>
    <!-- Main Application -->
    <div class="columns is-multiline add-space">
      <!-- Data Widget -->
      <DataWidget :configOpen="configOpen" ref="dataWidget" />
      <!-- Configuration Widget -->
      <ConfigWidget
        :configs.sync="configs"
        @toggleConfigPanel="configOpen = !configOpen"
      />
      <!-- Preview Widget -->
      <PreviewWidget :getData="sendData" :getConfigs="sendConfigs" />
    </div>
    <!-- Footer -->
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <strong>CyberAtlas</strong> by
          <!-- Personal Webpage Link -->
          <a href="https://davbro.me">1LT David Brownfield</a>. The source code
          is licensed
          <!-- Source Code License -->
          <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The
          website content is licensed
          <!-- Website License -->
          <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
            >CC BY NC SA 4.0</a
          >.
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import ConfigWidget from "./components/ConfigWidget.vue";
import DataWidget from "./components/DataWidget.vue";
import PreviewWidget from "./components/PreviewWidget.vue";

export default {
  name: "app",
  components: {
    DataWidget,
    ConfigWidget,
    PreviewWidget
  },
  data() {
    return {
      configs: [],
      configOpen: true
    };
  },
  methods: {
    // @vuese
    // Returns pointer to network data object, App.data
    sendData() {
      /*eslint no-console: ["error", {"allow": ["log"]}] */
      return this.$refs.dataWidget.getData();
    },
    // @vuese
    // Returns pointer to configurations object, App.configs
    sendConfigs() {
      return this.configs;
    }
  }
};
</script>

<style>
.add-space {
  padding: 0.5em 1em;
}
p > a {
  color: #167df0 !important;
}
</style>
