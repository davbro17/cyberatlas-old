<template>
  <TemplateConfig :self.sync="self">
    <template #data>
      <p>Working</p>
    </template>
  </TemplateConfig>
</template>

<script>
import TemplateConfig from "./TemplateConfig.vue";

export default {
  props: ["configs", "self"],
  components: {
    TemplateConfig
  }
};
</script>
