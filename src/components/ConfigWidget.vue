<template>
  <div class="columns is-multiline">
    <UploadWidget />
    <div class="column">
      <b-collapse aria-id="contentIDforWidget2" :open="true">
        <div
          class="panel-heading"
          slot="trigger"
          role="button"
          aria-controls="contentIDforWidget2"
          @click="isOpen = !isOpen"
        >
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                Step 2: Filter Data and Configure Diagram
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <b-icon
                  :icon="isOpen ? 'angle-up' : 'angle-down'"
                  size="is-small"
                >
                </b-icon>
              </div>
            </div>
          </div>
        </div>
      </b-collapse>
    </div>
    <PreviewWidget />
  </div>
</template>

<script>
import PreviewWidget from "./PreviewWidget.vue";
import UploadWidget from "./UploadWidget.vue";

export default {
  data() {
    return {
      isOpen: false
    };
  },
  components: {
    UploadWidget,
    PreviewWidget
  }
};
</script>
