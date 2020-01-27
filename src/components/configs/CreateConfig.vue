<template>
  <!-- Add NEW OBJECT Interface -->
  <div class="column">
    <div class="field">
      <span class="decision">
        Create A New
      </span>
      <!-- Dropdown Select -->
      <div class="select is-info">
        <select v-model="selected">
          <option
            v-for="(option, index) in options"
            v-bind:key="index"
            :value="index"
          >
            {{ option.name }}
          </option>
        </select>
      </div>
      <!-- ADD Button -->
      <span
        class="button is-info is-outlined decision"
        @click="createDiagramObject"
      >
        <strong>Add</strong>
      </span>
    </div>
    <!-- Drag N Drop Interface -->
    <div class="container has-text-centered" style="margin-top:1.5em;">
      <b-upload v-model="file" drag-drop="" type="is-info">
        <div
          class="content has-text-centered"
          width="100%"
          style="padding-bottom:2.28em"
        >
          <p>
            <b-icon icon="upload" size="is-large"> </b-icon>
          </p>
          <p>OR Upload a Configuration File</p>
        </div>
      </b-upload>
    </div>
  </div>
</template>

<script>
export default {
  props: ["configs"],
  data() {
    return {
      file: null,
      options: [
        {
          name: "Subnet",
          icon: "network-wired",
          component: "SubnetConfig"
        },
        {
          name: "Text Box",
          icon: "comment-alt",
          component: "TextBoxConfig"
        },
        {
          name: "Cloud",
          icon: "cloud",
          component: "CloudConfig"
        },
        {
          name: "Network Device",
          icon: "ethernet",
          component: "NetDeviceConfig"
        },
        {
          name: "Networks",
          icon: "project-diagram",
          component: "NetworksConfig"
        },
        {
          name: "Collection",
          icon: "th",
          component: "CollectionConfig"
        }
      ],
      selected: 0
    };
  },
  methods: {
    createDiagramObject() {
      /* eslint-disable no-console */
      //console.log(this.options[this.selected]);
      let tmp = {};
      Object.assign(tmp, this.options[this.selected]);
      tmp.id = Date.now();
      tmp.title = tmp.name;
      //console.log(tmp);
      this.configs.push(tmp);
    }
  }
};
</script>
<style scoped>
.decision {
  display: inline-block;
  padding-top: calc(0.4em - 1px);
  margin-right: 0.4em;
  margin-left: 0.4em;
}
</style>
