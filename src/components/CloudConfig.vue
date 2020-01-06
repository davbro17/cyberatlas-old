<template>
  <div class="column is-narrow">
    <b-tabs type="is-boxed">
      <b-tab-item label="Data" icon="filter"></b-tab-item>
      <b-tab-item label="Style" icon="edit"></b-tab-item>
      <b-tab-item label="Layout" icon="object-group"></b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
export default {
  props: ["configs"]
};
</script>

<style lang="scss" scoped>
::v-deep .tabs li.is-active a {
  color: #167df0;
}
</style>