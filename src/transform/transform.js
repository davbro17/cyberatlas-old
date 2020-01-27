import { transformTextBox } from "./configs/textbox";

let pageStartTag =
  '<mxGraphModel dx="1186" dy="781" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">' +
  "<root>" +
  '<mxCell id="0"/>' +
  '<mxCell id="1" parent="0"/>';

let pageEndTag = "</root></mxGraphModel>";

export default function(configs, data, unknownHandler) {
  let output = pageStartTag;
  let state = {
    id: 2,
    parent: 1,
    vertex: 1
  };
  for (let i = 0; i < configs.length; i++) {
    let conf = configs[i];
    if (conf.component === "TextBoxConfig") {
      output += transformTextBox(conf, data, state, unknownHandler);
    }
  }
  output += pageEndTag;
  return output;
}
