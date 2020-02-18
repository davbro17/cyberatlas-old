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
          <div class="navbar-item">
            <b-dropdown aria-role="list" v-model="selectedApp" @change="route">
              <button class="button is-info" slot="trigger">
                <span
                  ><strong>{{ selectedApp }}</strong>
                </span>
                <b-icon icon="angle-down"></b-icon>
              </button>
              <b-dropdown-item
                aria-role="listitem"
                v-for="(item, index) in appOptions.filter(
                  (e, i) => e != selectedApp
                )"
                :key="index"
                :value="item"
              >
                {{ item }}
              </b-dropdown-item>
            </b-dropdown>
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
          <!-- Personal Email Link -->
          <a href="mailto:david.c.brownfield3.mil@mail.mil"
            >1LT David Brownfield
          </a>
          . The source code is licensed
          <!-- Source Code License -->
          <a href="https://choosealicense.com/licenses/gpl-3.0/">GNU GPLv3</a>.
          The website content is licensed
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
      appOptions: ["Map", "Extract", "Compare", "Merge"],
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
    route(path) {
      if (path === "Map") {
        this.$router.push("/");
      } else {
        this.$router.push("/" + path);
      }
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
