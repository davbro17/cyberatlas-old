<template>
  <div class="column" style="padding-bottom:0em;">
    <label class="label"> Formation </label>
    <b-field>
      <b-radio-button
        type="is-info"
        v-model="layout.formationType"
        v-for="option in formationOptions"
        :key="option"
        :native-value="option"
      >
        {{ option }}
      </b-radio-button>
    </b-field>
    <label class="label"> Organize Map By </label>
    <b-field grouped>
      <p class="control is-expanded">
        <input
          class="input is-info"
          type="text"
          placeholder="5"
          v-model.number="layout.count"
        />
      </p>
      <b-field>
        <b-radio-button
          v-model="layout.units"
          type="is-info"
          native-value="columns"
        >
          Columns
        </b-radio-button>
        <b-radio-button
          v-model="layout.units"
          type="is-info"
          native-value="rows"
        >
          Rows
        </b-radio-button>
      </b-field>
    </b-field>
    <div v-if="layout.formationType === 'Cup'">
      <b-field label="Fill Object Name">
        <input class="input is-info" v-model="layout.fillObjectName" />
      </b-field>
    </div>
    <label class="label"> Spacing </label>
    <b-field>
      <b-radio-button
        type="is-info"
        v-model="layout.spacing"
        v-for="option in spacingOptions"
        :key="option"
        :native-value="option"
      >
        {{ option }}
      </b-radio-button>
    </b-field>
    <div v-if="layout.spacing === 'Fixed'">
      <b-field label="Fixed Width">
        <input class="input is-info" v-model.number="layout.fixedWidth" />
      </b-field>
      <b-field label="Fixed Height">
        <input class="input is-info" v-model.number="layout.fixedHeight" />
      </b-field>
    </div>
    <b-field label="Right Margin">
      <input class="input is-info" v-model.number="layout.margin.right" />
    </b-field>
    <b-field label="Bottom Margin">
      <input class="input is-info" v-model.number="layout.margin.bottom" />
    </b-field>
  </div>
</template>

<script>
import defaultLayout from "../../transform/defaults/layout.js";

export default {
  props: {
    layout: {
      type: Object,
      default() {
        return defaultLayout;
      }
    }
  },
  data() {
    return {
      formationOptions: ["Grid", "Cup"],
      spacingOptions: ["Auto", "Fixed"]
    };
  }
};
</script>
