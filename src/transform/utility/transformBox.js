import { transformGeometry, transformStyle } from "./drawio_helper.js";

function transformBox(state, geometry, style, parent, value) {
  let val = value || "";
  style = style || "rounded=1;whiteSpace=wrap;html=1;";
  /*eslint no-console: ["error", {"allow": ["log"]}] */
  state.id += 1;
  const boxStyle = transformStyle(style);
  let output = `<mxCell id="${state.id}" value="${val}" style="${boxStyle}" parent="${parent}" vertex="${state.vertex}">`;
  output += transformGeometry(geometry);
  output += `</mxCell>`;
  return output;
}

function transformGroup(state, geometry, oldParent) {
  state.id += 1;
  let output =
    `<mxCell id="${state.id}" value="" style="group" parent="${oldParent}" vertex="${state.vertex}" connectable="0">` +
    transformGeometry(geometry) +
    `</mxCell>`;
  state.parent = state.id;
  return output;
}

function transformDevice(state, geometry, style, value) {
  state.id += 1;
  const deviceStyle = transformStyle(style);
  let output = `<mxCell id="${state.id}" value="${value}" style="${deviceStyle}" parent="${state.parent}" vertex="${state.vertex}">`;
  output += transformGeometry(geometry);
  output += `</mxCell>`;
  return output;
}

export { transformBox, transformGroup, transformDevice };
