import { transformGeometry } from "./drawio_helper.js";

function transformBox(state, layout, style) {
  style = style || "rounded=1;whiteSpace=wrap;html=1;";
  let { id, parent, vertex } = state || { id: 2, parent: 1, vertex: 1 };
  state.id += 1;
  let output = `<mxCell id="${id}" value="" style="${style}" parent="${parent}" vertex="${vertex}">`;
  output += transformGeometry(layout.geometry);
  output += `</mxCell>`;
  return output;
}

function transformGroup(state, layout, oldParent) {
  let { id, vertex } = state || { id: 2, vertex: 1 };
  state.id += 1;
  let parent = oldParent || 1;
  let output = `<mxCell id="${id}" value="" style="group" parent="${parent}" vertex="${vertex}" connectable="0">`;
  +transformGeometry(layout.geometry);
  +`</mxCell>`;
  state.parent += 1;
  return output;
}

function transformDevice(state, geometry, shape, value) {
  let style = `verticalLabelPosition=bottom;aspect=fixed;html=1;verticalAlign=top;strokeColor=none;align=center;outlineConnect=0;shape=${shape};rounded=1;shadow=0;glass=0;comic=0;labelBackgroundColor=#67AB9F;fillColor=#1C2F45;`;
  let { id, parent, vertex } = state || { id: 2, parent: 1, vertex: 1 };
  state.id += 1;
  let output = `<mxCell id="${id}" value="${value}" style="${style}" parent="${parent}" vertex="${vertex}">`;
  output += transformGeometry(geometry);
  output += `</mxCell>`;
  return output;
}

export { transformBox, transformGroup, transformDevice };
