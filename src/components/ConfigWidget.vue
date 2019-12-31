<template>
  <div class="columns is-multiline">
    <UploadWidget v-bind:configOpen="isOpen" />
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
                <strong>Step 2: Filter Data and Configure Diagram</strong>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <b-icon
                  :icon="isOpen ? 'angle-down' : 'angle-up'"
                  size="is-small"
                >
                </b-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="panel-block" style="display:block">
          <div class="columns">
            <div class="column is-narrow">
              <button
                class="button is-fullwidth is-info is-outlined"
                style="margin-bottom:15px;"
              >
                Create a New Group
              </button>
              <b-select multiple native-size="4" v-model="selectedGroups">
                <option value="empty" v-if="groups.length == 0"
                  >&lt; No Groups Created Yet &gt;</option
                >
              </b-select>
            </div>
            <div class="column">
              <div class="container has-text-centered">
                <b-upload
                  v-model="file"
                  drag-drop
                  v-if="!file && groups.length == 0"
                  type="is-info"
                >
                  <section class="section">
                    <div class="content has-text-centered">
                      <p>
                        <b-icon icon="upload" size="is-large"> </b-icon>
                      </p>
                      <p>OR Upload a Configuration File</p>
                    </div>
                  </section>
                </b-upload>
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
      isOpen: true,
      groups: [],
      selectedGroups: [],
      file: null,
      displayedGroup: null
    };
  },
  components: {
    UploadWidget,
    PreviewWidget
  }
};
</script>
