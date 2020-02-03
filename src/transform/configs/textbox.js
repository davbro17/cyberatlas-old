import {
  transformText,
  transformHTML,
  transformGeometry,
  transformStyle
} from "../utility/drawio_helper.js";

let textBoxElements = [
  {
    name: "Text",
    input: "",
    placeholder: "I'm A Text Box"
  },
  {
    name: "HTML",
    input: "",
    placeholder: "Advisory: Be Very Careful With HTML!"
  },
  {
    name: "Line",
    output: "&lt;hr&gt;"
  },
  {
    name: "Metadata",
    options: ["Filename", "Date", "CyberAtlas"],
    selected: "Date"
  }
];

let elementRules = {
  Line() {
    return "&lt;hr&gt;";
  },
  Text(elem) {
    return transformText(elem.input);
  },
  HTML(elem) {
    return transformHTML(elem.input);
  },
  Metadata(elem, data) {
    let option = elem.selected;
    let metaRules = {
      Date() {
        return new Date()
          .toJSON()
          .slice(0, 10)
          .replace(/-/g, "/");
      },
      CyberAtlas() {
        return "Generated with CyberAtlas";
      },
      Filename(data) {
        return data.files[0].name || "oof.txt";
      }
    };
    return option in metaRules
      ? metaRules[option](data)
      : metaRules["CyberAtlas"](data);
  }
};
/**
 * Transforms a TextBox config into Drawio XML
 * @param  {Object} textBox
 * @param  {Object} data
 * @param  {Object} state
 * @param  {Function} unknownHandler
 */
function transformTextBox(textBox, data, state, unknownHandler) {
  let transformRules = {};
  let elements = textBox.elements || [];
  let output = "";
  let value = "";
  let style = "";
  state.id += 1;

  for (let i; i < textBoxElements.length; i++) {
    let elem = textBoxElements[i];
    transformRules[elem.name] = unknownHandler("TextBox", elem.name);
  }
  for (let i = 0; i < elements.length; i++) {
    let elem = elements[i];
    console.log(elem.name);
    if (elem.name in elementRules) {
      console.log("Caught One1");
      value += elementRules[elem.name](elem, data);
    }
  }
  /*eslint no-console: ["error", {"allow": ["log"]}] */
  console.log(value);
  style = transformStyle(textBox.style);
  output += `<mxCell id="${state.Filenameid}" value="${value}" style="${style}" parent="${state.parent}" vertex="${state.vertex}">`;
  output += transformGeometry(textBox.geometry);
  output += `</mxCell>`;
  return output;
}

export { textBoxElements, transformTextBox };
