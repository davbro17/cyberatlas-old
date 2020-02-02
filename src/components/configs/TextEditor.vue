<template>
  <div>
    <div class="field has-addons">
      <div class="control">
        <button class="button is-info is-outlined" @click="newline">
          Add Line
        </button>
      </div>
      <div class="control">
        <button class="button is-info is-outlined" @click="addTag('ip', 'IP')">
          IP Address
        </button>
      </div>
      <div class="control">
        <button
          class="button is-info is-outlined"
          @click="addTag('freq', 'FREQ')"
        >
          Frequency
        </button>
      </div>
    </div>
    <div
      class="field has-addons"
      v-for="(line, lineIndex) in self.lines"
      v-bind:key="lineIndex"
    >
      <div class="control">
        <div class="input is-info">
          <span
            v-for="(elem, index) in self.lines[lineIndex]"
            v-bind:key="index"
            :contenteditable="elem.edit"
            :ref="`${lineIndex}${index}`"
            class="textline"
            v-bind:class="{ tag: !elem.edit, 'is-info': !elem.edit }"
            @focusout="updateElement(index, $event)"
            @focus="updateLine(lineIndex)"
            @keydown.enter.prevent
          >
            {{ elem.text }}
            <a
              class="delete"
              v-if="!elem.edit"
              @click="deleteTag(lineIndex, index)"
            />
          </span>
        </div>
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
      lineIndex: 0
    };
  },
  methods: {
    getCaretCharacterOffsetWithin(element) {
      var caretOffset = 0;
      var doc = element.ownerDocument || element.document;
      var win = doc.defaultView || doc.parentWindow;
      var sel;
      if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
          var range = win.getSelection().getRangeAt(0);
          var preCaretRange = range.cloneRange();
          preCaretRange.selectNodeContents(element);
          preCaretRange.setEnd(range.endContainer, range.endOffset);
          caretOffset = preCaretRange.toString().length;
        }
      } else if ((sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
      }
      return caretOffset;
    },
    updateElement(index, event) {
      let elem = event.target;
      this.self.lines[this.lineIndex][index].text = elem.innerText;
      this.offset = this.getCaretCharacterOffsetWithin(elem);
      this.divIndex = index;
      /*eslint no-console: ["error", {"allow": ["log"]}] */
      console.log(this.offset);
      console.log(this.divIndex);
    },
    newline() {
      this.self.lines.push([
        {
          edit: true,
          text: "Hello There",
          type: "text"
        }
      ]);
    },
    deleteLine(lineIndex) {
      this.self.lines.splice(lineIndex, 1);
    },
    updateLine(index) {
      this.lineIndex = index;
    },
    addTag(name, label) {
      let tag = { type: name, text: label, edit: false };
      let blankText = { type: "text", text: "", edit: true };
      let lineIndex = this.lineIndex;
      let divIndex = this.divIndex;
      let offset = this.offset;
      let div = this.self.lines[lineIndex][divIndex];

      if (offset == 0) {
        if (divIndex == 0) {
          this.self.lines[lineIndex].unshift(tag);
          this.self.lines[lineIndex].unshift(blankText);
        } else {
          this.self.lines[lineIndex].splice(divIndex - 1, 0, tag);
        }
      } else if (offset == div.text.length) {
        if (divIndex == this.self.lines[lineIndex].length - 1) {
          this.self.lines[lineIndex].push(tag);
          this.self.lines[lineIndex].push(blankText);
        } else {
          this.self.lines[lineIndex].splice(divIndex + 1, 0, tag);
        }
      } else {
        let newDiv = {
          type: "text",
          edit: true,
          text: div.text.substring(0, offset - 1)
        };
        div.text = div.text.substring(offset - 1);
        if (divIndex == 0) {
          this.self.lines[lineIndex].unshift(tag);
          this.self.lines[lineIndex].unshift(newDiv);
        } else {
          this.self.lines[lineIndex].splice(divIndex + 1, 0, tag);
        }
      }
    },
    deleteTag(lineIndex, index) {
      let line = this.self.lines[lineIndex];
      line.splice(index, 1);
      console.log(line[index].text);
      line[index - 1].text += line[index].text;
      line.splice(index, 1);
    }
  },
  mounted() {
    if (!this.self.lines[0]) {
      this.self.lines.push([
        {
          edit: true,
          text: "Hello There",
          type: "text"
        }
      ]);
    }
  }
};
</script>
<style scoped>
.textline:focus {
  outline: none;
}
</style>
