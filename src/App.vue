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
                  ><strong>{{ $route.name }}</strong>
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
          <!-- Performance Modal Button -->
          <div class="navbar-item">
            <button
              class="button is-info is-medium"
              @click="performanceModalActive = true"
            >
              <strong>
                Performance
              </strong>
            </button>
          </div>
          <!-- Performance Modal -->
          <div
            class="modal"
            v-bind:class="{ 'is-active': performanceModalActive }"
          >
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">Performance</p>
                <button
                  class="delete"
                  aria-label="close"
                  @click="performanceModalActive = false"
                />
              </header>
              <section class="modal-card-body">
                <!-- Content ... -->
                <b-field
                  label="Worker Count (Constraints: Browser, Max # of Threads)"
                >
                  <b-slider
                    :min="1"
                    :max="workers.concurrencyMax"
                    ticks
                    v-model.number="workers.count"
                    type="is-info"
                  >
                  </b-slider>
                </b-field>
                <b-field label="Chunk Size (KB)">
                  <input
                    class="input is-info"
                    placeholder="50"
                    v-model.number="workers.chunkSize"
                  />
                </b-field>
              </section>
            </div>
          </div>
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
    <router-view :transfer="transferData" :actions.sync="actions" />
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
      appOptions: [
        "Map",
        "Extract",
        "Compare",
        "Merge",
        "Interact",
        "Automate"
      ],
      burgerToggle: false,
      actions: {},
      transferData: {
        input1: null,
        input2: null,
        mapConfigs: null
      },
      workers: {
        concurrencyMax: 1,
        count: 1,
        chunkSize: 50
      },
      performanceModalActive: false
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
    },
    // @vuese
    // Allow tools to transfer data between each other
    openWith(appName, data) {
      if ("input1" in data) {
        this.$set(this.transferData, "input1", data.input1);
      }
      if ("input2" in data) {
        this.$set(this.transferData, "input2", data.input2);
      }
      if ("mapConfigs" in data) {
        this.$set(this.transferData, "mapConfigs", data.mapConfigs);
      }
      this.route(appName);
    }
  },
  mounted() {
    this.actions["openWith"] = this.openWith;
    this.workers.concurrencyMax = parseInt(
      window.navigator.hardwareConcurrency
    );
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
