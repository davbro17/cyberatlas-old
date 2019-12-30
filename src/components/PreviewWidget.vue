<template>
  <div class="column is-full">
    <b-collapse aria-id="contentIDforWidget3" :open="true">
      <div
        class="panel-heading"
        slot="trigger"
        role="button"
        aria-controls="contentIDforWidget3"
      >
        <div class="level" @click="isOpen = !isOpen">
          <div class="level-left">
            <div class="level-item">
              Step 3: Preview and
            </div>
            <div class="level-item">
              <button class="button is-info is-outlined">
                Generate Diagram
              </button>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <b-icon
                :icon="isOpen ? 'angle-up' : 'angle-down'"
                size="is-small"
                @click="isOpen = !isOpen"
              >
              </b-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="panel-block"></div>
    </b-collapse>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isOpen: false
    };
  }
};
</script>
