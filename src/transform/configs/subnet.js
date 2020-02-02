import { transformGeometry } from "../utility/drawio_helper.js";
import { cidrTools } from "cidr-tools";
import { isCidr } from "is-cidr";
import { isIP } from "is-ip";
import { transformBox, transformGroup, transformDevice } from "./textbox.js";

function Filter(data, cidr, column) {
  // Filter data for selected cidr
  // Returns an array of IPs
  let output = {};
  if (!isCidr.v4(cidr)) {
    return output;
  }
  let tmp = cidrTools.expand([cidr]);
  let iprange = {};
  tmp.map(x => (iprange[x] = true));
  for (let i; i < data.sheets.length; i++) {
    for (let j; j < data.sheets[i].length; j++) {
      let ip = data.sheets[i][j];
      if (isIP.v4(ip) && iprange[ip]) {
        output[ip] = output[ip] + 1 || 1;
      }
    }
  }
  return output;
}

function expandCidr(cidr) {
  if (isCidr.v4(cidr)) {
    return cidrTools.expand([cidr]);
  }
}
function mergeCidrs(cidrs, cidr) {
  if (isCidr.v4(cidr)) {
    return cidrTools.expand([cidr]);
  }
}

function processData(subnet, data) {
  // Filter all the commands
  let filters = subnet.commands.filter(f => f.action === "Filter");
  let excludes = subnet.commands.filter(f => f.action === "Exclude");
  let creates = subnet.commands.filter(f => f.action === "Create");

  // Merge all created networks
  let networks = creates.reduce((accum, curr) =>
    accum.concat(expandCidr(curr.cidr))
  );
  let output = {};
  networks.forEach(x => (output[x] = 0));
  // Merge filters into one filter
  let filter = filters.reduce((accum, curr) => mergeCidrs(accum, curr.cidr));
  // Filter out created
  return [];
}

function transformSubnet(subnet, data, state) {
  state = state || { id: 2, parent: 1, vertex: 1 };
  let output = "";
  // Create the BIG box
  output += transformBox(subnet.layout, state, subnet.style);
  let devices = processData(subnet, data);
  let oldParent = state.parent;
  let x0 = subnet.layout.geometry.x;
  let x = x0;
  let y = subnet.layout.geometry.x;
  let width = subnet.layout.device.width;
  let height = subnet.layout.device.height;
  let padding = subnet.layout.device.padding;
  let deviceCount = 0;
  let devicesPerRow = subnet.layout.device.columns;
  for (let i; i < devices; i++) {
    // Create Group
    output += transformGroup(state, subnet.layout, oldParent);
    // Create Device Background
    output += transformBox(state, subnet.layout, subnet.style);
    // change geometry
    if (deviceCount < devicesPerRow) {
      x = x + width + padding;
    } else {
      x = x0;
      y = y + height + padding;
    }
    deviceCount += 1;
    // Create Device
    output += transformDevice(
      state,
      { x, y, width, height },
      subnet.style.shape,
      devices[i].value
    );
  }
  return output;
}

export { transformSubnet };
