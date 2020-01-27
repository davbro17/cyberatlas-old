<template>
  <div class="column is-narrow">
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
            placeholder="self.name"
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
        <slot name="layout">
          <p>Still Under Construction</p>
        </slot>
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
