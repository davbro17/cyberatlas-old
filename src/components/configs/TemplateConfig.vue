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
        <div class="field">
          <label class="label">Absolute Position</label>
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
                  v-model="self.geometry.x"
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
                  v-model="self.geometry.y"
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
            <div class="field">
              <p class="control is-expanded has-icons-left">
                <input
                  class="input is-info"
                  type="text"
                  placeholder="200"
                  v-model="self.geometry.width"
                />
              </p>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">height</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control is-expanded has-icons-left">
                <input
                  class="input is-info"
                  type="text"
                  placeholder="100"
                  v-model="self.geometry.height"
                />
              </p>
            </div>
          </div>
        </div>
        <slot name="layout"> </slot>
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
export default {
  props: ["self"]
};
</script>

<style lang="scss" scoped>
::v-deep .tabs li.is-active a {
  color: #167df0;
}
</style>
