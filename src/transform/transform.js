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

export default function(configs, data, unknownHandler) {
  let output = pageStartTag;
  let state = {
    id: 2,
    parent: 1,
    // Parent of the document page
    docparent: 1,
    vertex: 1
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
        // TODO add sheet seperation
        let f = commands[j];
        if (isCidr.v4(f.cidr)) {
          for (var a = 0; a < filters.length; a++) {
            for (var b = 0; b < filters[a].length; b++) {
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
        if (isIp(entry) || isCidr(entry) != 0) {
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
  // Copy configurations for possible modification during build process
  let confs = JSON.parse(JSON.stringify(configs));
  // Build Diagram Objects
  for (let i = 0; i < confs.length; i++) {
    let conf = confs[i];
    const component = conf.component;
    if (component === "TextBoxConfig") {
      output += transformTextBox(conf, data, state, unknownHandler);
    }
    if (conf.component === "SubnetConfig") {
      let confDevices = {};
      for (let device in devices) {
        if (conf.id in devices[device].filters) {
          confDevices[device] = devices[device];
        }
      }
      output += transformSubnet(conf, data, state, confDevices);
    }
  }
  // Close out the Drawio xml
  output += pageEndTag;
  /*eslint no-console: ["error", {"allow": ["log"]}] */
  console.log(output);
  return output;
}
