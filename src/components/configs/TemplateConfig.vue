<template>
  <div class="column is-full-width">
    <!-- Tabs -->
    <b-tabs type="is-boxed">
      <!-- Data Tab -->
      <b-tab-item label="Data" icon="filter">
        <div class="field">
          <label class="label">
            Object Name
          </label>
          <input
            class="input is-info"
            type="text"
            :placeholder="self.name"
            v-model="self.title"
          />
        </div>
        <slot name="data">
          <p>Still Under Construction</p>
        </slot>
      </b-tab-item>
      <!-- Style Tab -->
      <b-tab-item label="Style" icon="edit">
        <slot name="style">
          <p>Still Under Construction</p>
        </slot>
      </b-tab-item>
      <!-- Layout Tab -->
      <b-tab-item label="Layout" icon="object-group">
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Position</label>
          </div>
          <div class="field-body">
            <b-field grouped>
              <b-checkbox
                v-model="self.autoposition"
                type="is-info"
                style="margin-right:10px;"
              >
                Automatic
              </b-checkbox>
            </b-field>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">x pos</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control is-expanded has-icons-left">
                <input
                  class="input is-info"
                  type="text"
                  placeholder="10"
                  v-model.number="self.geometry.x"
                  :disabled="self.autoposition"
                />
              </p>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">y pos</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control is-expanded has-icons-left">
                <input
                  class="input is-info"
                  type="text"
                  placeholder="10"
                  v-model.number="self.geometry.y"
                  :disabled="self.autoposition"
                />
              </p>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">width</label>
          </div>
          <div class="field-body">
            <b-field grouped>
              <b-checkbox
                v-model="self.autowidth"
                type="is-info"
                style="margin-right:10px;"
                v-if="autosizing"
              >
                Automatic
              </b-checkbox>
              <p class="control is-expanded has-icons-left">
                <input
                  class="input is-info"
                  type="text"
                  placeholder="200"
                  :disabled="autosizing && self.autowidth"
                  v-model.number="self.geometry.width"
                />
              </p>
            </b-field>
            <b-field v-if="self.name === 'subnet'">
              <b-radio-button
                v-model="self.widthUnits"
                :type="self.autowidth ? '' : 'is-info'"
                native-value="pixels"
                :disabled="self.autowidth"
              >
                pixels
              </b-radio-button>
              <b-radio-button
                v-model="self.widthUnits"
                :type="self.autowidth ? '' : 'is-info'"
                native-value="device"
                :disabled="self.autowidth"
              >
                device widths
              </b-radio-button>
            </b-field>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">height</label>
          </div>
          <div class="field-body">
            <b-field grouped>
              <b-checkbox
                v-model="self.autoheight"
                type="is-info"
                style="margin-right:10px;"
                v-if="autosizing"
              >
                Automatic
              </b-checkbox>
              <p class="control is-expanded has-icons-left">
                <input
                  class="input is-info"
                  type="text"
                  placeholder="100"
                  :disabled="autosizing && self.autoheight"
                  v-model.number="self.geometry.height"
                />
              </p>
            </b-field>
            <b-field v-if="self.name === 'subnet'">
              <b-radio-button
                v-model="self.heightUnits"
                :type="self.autoheight ? '' : 'is-info'"
                native-value="pixels"
                :disabled="self.autoheight"
              >
                pixels
              </b-radio-button>
              <b-radio-button
                v-model="self.heightUnits"
                :type="self.autoheight ? '' : 'is-info'"
                native-value="device"
                :disabled="self.autoheight"
              >
                device heights
              </b-radio-button>
            </b-field>
          </div>
        </div>
        <slot name="layout"> </slot>
      </b-tab-item>
      <!-- Layout Tab -->
      <b-tab-item label="Connections" icon="exchange-alt">
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
export default {
  props: {
    self: Object,
    autosizing: Boolean
  }
};
</script>

<style lang="scss" scoped>
::v-deep .tabs li.is-active a {
  color: #167df0;
}
</style>
