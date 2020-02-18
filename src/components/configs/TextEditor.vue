<template>
  <div>
    <div class="field has-addons">
      <div class="control">
        <button
          class="button is-info is-outlined"
          @click="addTag('text', '', true)"
        >
          Add Text
        </button>
      </div>
      <div class="control">
        <button
          class="button is-info is-outlined"
          @click="addTag('ip', 'IP', false)"
        >
          IP Address
        </button>
      </div>
      <div class="control">
        <button
          class="button is-info is-outlined"
          @click="addTag('freq', 'FREQ', false)"
        >
          Frequency
        </button>
      </div>
      <div class="control">
        <button
          class="button is-danger is-outlined"
          @click="line.splice(0, line.length)"
        >
          <span>
            Empty Line
          </span>
          <b-icon icon="times" />
        </button>
      </div>
    </div>
    <!-- Unsaved editor line -->
    <div class="field has-addons">
      <div class="control" v-for="(elem, index) in line" :key="index">
        <input
          v-if="elem.edit"
          class="input is-info"
          @keydown.enter.prevent
          v-model="elem.text"
          placeholder="Example Label Text"
        />
        <button class="button is-info is-outlined" v-else>
          <span>
            {{ elem.text }}
          </span>
        </button>
      </div>
      <div class="control">
        <button class="button is-info is-outlined" @click="addLine()">
          <b-icon icon="plus" />
        </button>
      </div>
    </div>
    <!-- Saved Lines -->
    <div
      class="field has-addons"
      v-for="(line, lineIndex) in self.lines"
      v-bind:key="lineIndex"
    >
      <div
        class="control"
        v-for="(elem, index) in self.lines[lineIndex]"
        :key="index"
      >
        <input
          v-if="elem.edit"
          class="input is-info"
          @keydown.enter.prevent
          v-model="elem.text"
        />
        <button class="button is-info is-outlined" v-else>
          <span>
            {{ elem.text }}
          </span>
        </button>
      </div>
      <div class="control">
        <button
          class="button is-danger is-outlined"
          @click="deleteLine(lineIndex)"
        >
          <b-icon icon="times" />
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "TextEditor",
  props: ["self", "data"],
  data() {
    return {
      offset: 0,
      divIndex: 0,
      lineIndex: 0,
      line: []
    };
  },
  methods: {
    deleteLine(lineIndex) {
      this.self.lines.splice(lineIndex, 1);
    },
    updateLine(index) {
      this.lineIndex = index;
    },
    addTag(name, label, editable) {
      let tag = { type: name, text: label, edit: editable };
      this.line.push(tag);
    },
    addLine() {
      this.self.lines.push(this.line);
    }
  },
  mounted() {
    if (!this.self.lines[0]) {
      this.self.lines.push([
        {
          edit: false,
          text: "IP",
          type: "ip"
        }
      ]);
    }
    if (this.line.length == 0) {
      this.line.push({
        edit: true,
        text: "",
        type: "text"
      });
    }
  }
};
</script>
<style scoped>
.textline:focus {
  outline: none;
}
</style>
