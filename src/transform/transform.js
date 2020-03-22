import { transformTextBox } from "./configs/textbox";
import cidrTools from "cidr-tools";
import isCidr from "is-cidr";
import isIp from "is-ip";
import { transformSubnet } from "./configs/subnet";

let pageStartTag =
  '<mxGraphModel dx="1186" dy="781" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">' +
  "<root>" +
  '<mxCell id="0"/>' +
  '<mxCell id="1" parent="0"/>';

let pageEndTag = "</root></mxGraphModel>";

const thresholdBuilder = (limit, operator) => {
  if (operator === ">") {
    return value => value > limit;
  } else {
    return value => value < limit;
  }
};

function updateLayout(layout, state) {
  const shiftLeft =
    layout.spacing === "Fixed" ? layout.fixedWidth : state.prevWidth;
  const shiftDown =
    layout.spacing === "Fixed" ? layout.fixedHeight : state.prevHeight;
  if (layout.formationType === "Cup") {
    console.log("Handling Cup");
  } else {
    if (layout.units === "rows") {
      if (layout.spacing !== "Fixed") {
        state.rowHeight = Math.max(state.rowHeight, state.prevHeight);
      }
      if (state.layoutCounter < layout.count) {
        state.offsetx += shiftLeft + layout.margin.right;
        state.layoutCounter++;
      } else {
        state.offsetx = state.startx;
        state.offsety += state.rowHeight + layout.margin.bottom;
        state.layoutCounter = 1;
      }
    } else {
      if (layout.spacing !== "Fixed") {
        state.colWidth = Math.max(state.colWidth, state.prevWidth);
      }
      if (state.layoutCounter < layout.count) {
        state.offsety += shiftDown + layout.margin.bottom;
        state.layoutCounter++;
      } else {
        state.offsety = state.starty;
        state.offsetx += state.colWidth + layout.margin.right;
        state.layoutCounter = 1;
      }
    }
  }
}

export default function(configs, layout, data, unknownHandler) {
  let output = pageStartTag;
  let state = {
    id: 2,
    parent: 1,
    // Parent of the document page
    docparent: 1,
    vertex: 1,
    startx: 0,
    starty: 0,
    offsetx: 0,
    offsety: 0,
    prevWidth: 0,
    prevHeight: 0,
    colWidth: layout.spacing === "Fixed" ? layout.fixedWidth : 0,
    rowHeight: layout.spacing === "Fixed" ? layout.fixedHeight : 0,
    layoutCounter: 1
  };
  // Create Filter object w/ Array for each sheet
  let filters = new Array(data.sheets.length);
  for (let i = 0; i < data.sheets.length; i++) {
    filters[i] = new Array(data.sheets[i][0].length);
    for (let j = 0; j < filters[i].length; j++) {
      filters[i][j] = [];
    }
  }
  // Fill Filter Object with filters
  for (let i = 0; i < configs.length; i++) {
    if ("commands" in configs[i]) {
      let commands = configs[i].commands;
      for (let j = 0; j < commands.length; j++) {
        let f = commands[j];
        if (isCidr.v4(f.cidr) || isIp(f.cidr)) {
          const ret = data.files.indexOf(f.sheet);
          const start = ret > -1 ? ret : 0;
          const end = ret > -1 ? ret + 1 : filters.length;
          for (var a = start; a < end; a++) {
            const ret2 = Math.max(
              data.customHeaders[a].indexOf(f.column),
              data.headers.indexOf(f.column)
            );
            const start2 = ret2 > -1 ? ret2 : 0;
            const end2 = ret2 > -1 ? ret2 + 1 : filters[a].length;
            for (var b = start2; b < end2; b++) {
              filters[a][b].push(f);
            }
          }
        }
      }
    }
  }
  // Create devices object
  let devices = {};
  // Filter all the data pulling devices
  for (let a = 0; a < data.sheets.length; a++) {
    const sheet = data.sheets[a];
    const sheetFilters = filters[a];
    for (let b = 0; b < sheet.length; b++) {
      const row = sheet[b];
      for (let c = 0; c < row.length; c++) {
        const colFilters = sheetFilters[c];
        const entry = row[c];
        if (isCidr.v4(entry) || isIp(entry)) {
          for (let d = 0; d < colFilters.length; d++) {
            const filter = colFilters[d];
            if (cidrTools.overlap(filter.cidr, entry)) {
              devices[entry] = devices[entry] || { filters: {} };
              devices[entry].filters[filter.id] =
                devices[entry].filters[filter.id] + 1 || 1;
            }
          }
        }
      }
    }
  }
  let configOutput = [];
  // Build Diagram Objects
  for (let i = 0; i < configs.length; i++) {
    let conf = configs[i];
    const component = conf.component;
    if (component === "TextBoxConfig") {
      configOutput.push(transformTextBox(conf, data, state, unknownHandler));
    }
    if (component === "SubnetConfig") {
      let confDevices = {};
      for (let device in devices) {
        if (conf.id in devices[device].filters) {
          confDevices[device] = devices[device];
        }
      }
      const tmp = transformSubnet(conf, data, state, confDevices);
      conf.calcWidth = tmp.width;
      conf.calcHeight = tmp.height;
      configOutput.push(tmp.xml);
    }
  }
  if (layout.formationType === "cup") {
    layout.cupHeight =
      layout.units === "rows" ? layout.count : layout.cup.minimum;
    layout.cupWidth =
      layout.units === "columns" ? layout.count : layout.cup.minimum;
    layout.cupThresholds = {
      Left: thresholdBuilder(layout.cupHeight),
      Bottom: thresholdBuilder(layout.cupWidth),
      Right: thresholdBuilder(layout.cupHeight)
    };
  }
  // Configure Layout
  output += configOutput.reduce((accum, curr, index) => {
    const test = configs[index].autoposition;
    const ret = test
      ? (accum += curr
          .replace(/ x="[0-9]+"/, ` x="${state.offsetx}"`)
          .replace(/ y="[0-9]+"/, ` y="${state.offsety}"`))
      : (accum += curr);
    if (test) updateLayout(layout, state);
    return ret;
  }, "");

  // Close out the Drawio xml
  output += pageEndTag;
  /*eslint no-console: ["error", {"allow": ["log"]}] */
  //console.log(output);
  return output;
}
