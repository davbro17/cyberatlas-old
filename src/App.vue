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
        <a
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          @click="burgerToggle = !burgerToggle"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div class="navbar-menu" v-bind:class="{ 'is-active': burgerToggle }">
        <div class="navbar-start">
          <div
            class="navbar-item has-dropdown"
            v-bind:class="{ 'is-active': appSelectMenu }"
          >
            <a
              class="navbar-link is-medium "
              @click="appSelectMenu = !appSelectMenu"
            >
              <strong>{{ selectedApp }}</strong>
            </a>
            <div class="navbar-dropdown is-boxed">
              <a class="navbar-item" @click="route('/', 'Map')">
                <strong>Map</strong>
              </a>
              <a class="navbar-item" @click="route('/extract', 'Extract')">
                <strong>Extract</strong>
              </a>
              <a class="navbar-item" @click="route('/compare', 'Compare')">
                <strong>Compare</strong>
              </a>
            </div>
          </div>
        </div>
        <div class="navbar-end">
          <!-- Documentation Link Button -->
          <div class="navbar-item">
            <button class="button is-info is-medium" @click="openDocs">
              <strong>
                Documentation
              </strong>
            </button>
          </div>
        </div>
      </div>
    </nav>
    <router-view />
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

export default {
  data() {
    return {
      selectedApp: "Map",
      appSelectMenu: false,
      burgerToggle: false
    };
  },
  methods: {
    // @vuese
    // Open a new tab to the Documentation
    openDocs() {
      window.open("./docs/index.html");
    },
    // @vuese
    // Open a new tab to the Documentation
    route(path, name) {
      this.selectedApp = name;
      this.appSelectMenu = !this.appSelectMenu;
      this.$router.push(path);
    }
  }
};
</script>

<style>
#app {
  font-family: Arial;
}
.add-space {
  padding: 0.5em 1em;
}
p > a {
  color: #167df0 !important;
}
</style>
