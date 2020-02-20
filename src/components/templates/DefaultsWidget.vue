<template>
  <div>
    <div class="column" style="padding-bottom:0em;">
      <b-field grouped>
        <b-field
          label="Configure"
          horizontal
          type="is-info"
          message="Object"
          grouped
        >
          <b-select v-model="selected">
            <option
              v-for="(config, index) in configDefaults"
              :value="config"
              :key="index"
            >
              {{ config.name }}
            </option>
          </b-select>
        </b-field>
        <div class="field">
          <p class="control">
            <button
              class="button is-info is-outlined"
              @click="forceChanges(selected)"
            >
              Force
            </button>
          </p>
          <p class="help is-info">Changes</p>
        </div>
        <div class="field">
          <p class="control">
            <button class="button is-info is-outlined" @click="forceAllChanges">
              Force All
            </button>
          </p>
          <p class="help is-info">Object Changes</p>
        </div>
      </b-field>
      <hr />
    </div>
    <component
      :is="selected.component"
      v-if="selected"
      :self.sync="this.selected"
    />
  </div>
</template>

<script>
import SubnetConfig from "../../components/configs/SubnetConfig.vue";

export default {
  components: { SubnetConfig },
  props: {
    configDefaults: {
      type: Array,
      required: true
    },
    force: {
      type: Boolean,
      default: false
    },
    configs: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      selected: null
    };
  },
  methods: {
    forceChanges(config) {
      for (let i = 0; i < this.configs.length; i++) {
        if (this.configs[i].name === this.selected.name) {
          this.configs.splice(i, 1, JSON.parse(JSON.stringify(config)));
        }
      }
    },
    forceAllChanges() {
      for (let i = 0; i < this.configDefaults.length; i++) {
        this.forceChanges(this.configDefaults[i]);
      }
    }
  }
};
</script>
