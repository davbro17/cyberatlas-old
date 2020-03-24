<template>
  <!-- Main Application -->
  <div class="columns is-multiline add-space">
    <!-- Data Widget -->
    <PanelBlock>
      <template #title>
        Generate An Interactive Map
      </template>
      <template #content>
        <diagram-widget />
      </template>
    </PanelBlock>
  </div>
</template>
<script>
import PanelBlock from "../components/templates/PanelBlock.vue";
import DiagramWidget from "../components/DiagramWidget.vue";

export default {
  components: {
    PanelBlock,
    DiagramWidget
  }
};
</script>
