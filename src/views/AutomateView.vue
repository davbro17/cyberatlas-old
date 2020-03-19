<template>
  <!-- Main Application -->
  <div class="columns is-multiline add-space">
    <!-- Data Widget -->
    <PanelBlock>
      <template #title>
        Automate A Workflow!
      </template>
    </PanelBlock>
  </div>
</template>
<script>
import PanelBlock from "../components/templates/PanelBlock.vue";

export default {
  components: {
    PanelBlock
  }
};
</script>
