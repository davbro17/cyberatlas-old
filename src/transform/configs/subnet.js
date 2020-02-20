import isIp from "is-ip";
import isCidr from "is-cidr";
import cidrTools from "cidr-tools";
import {
  transformBox,
  transformGroup,
  transformDevice
} from "../utility/transformBox.js";

let subnetConfig = {
  name: "Subnet",
  icon: "network-wired",
  component: "SubnetConfig",
  commands: [],
  style: {
    fillColor: "#d5e8d4",
    rounded: 0,
    verticalAlign: "top",
    fontStyle: 1,
    strokeColor: "#000000"
  },
  label: "",
  lines: [[{ type: "ip", text: "IP", edit: false }]],
  autowidth: false,
  autoheight: true,
  autoposition: true,
  widthUnits: "device",
  heightUnits: "pixels",
  renderEmpty: true,
  geometry: {
    x: 0,
    y: 0,
    width: 10,
    height: 100
  },
  margin: {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  },
  padding: {
    top: 10,
    left: 10
  },
  device: {
    columns: 10,
    width: 70,
    height: 70,
    lineHeight: 13.5,
    padding: {
      top: 15,
      left: 25
    },
    style: {
      shape: "mxgraph.citrix.desktop",
      verticalLabelPosition: "bottom",
      aspect: "fixed",
      html: 1,
      verticalAlign: "top",
      align: "center",
      outlineConnect: 0
    },
    background: {
      verticalLabelPosition: "bottom",
      aspect: "fixed",
      html: 1,
      verticalAlign: "top",
      fillColor: "none",
      strokeColor: "none",
      align: "center",
      outlineConnect: 0
    }
  }
};

let tagTypes = {
  ip: (device, ip) => ip,
  freq: (device, ip, id) => device.filters[id] || 0,
  text: (device, ip, id, text) => text
};

function processLines(lines, device, ip, id) {
  let output = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      const tag = line[j];
      output += tagTypes[tag.type](device, ip, id, tag.text);
    }
    output += "&lt;br&gt;";
  }
  return output;
}

function transformSubnet(subnet, data, state, confDevices) {
  /*eslint no-console: ["error", {"allow": ["log"]}] */
  // Copy confDevices to devices, shallow copy
  let devices = Object.assign({}, confDevices);
  // Get all the commands with 'create' as its action
  const createCommands = subnet.commands.filter(c => c.action === "Create");
  // Expand the cidr, and add all the new devices to the devices Object
  createCommands.forEach(c => {
    if (isCidr(c.cidr) > 0) {
      cidrTools.expand(c.cidr).forEach(ip => {
        devices[ip] = devices[ip] || {};
      });
    }
  });
  // Get all the commands with 'create' as its action
  const excludeCommands = subnet.commands.filter(c => c.action === "Exclude");
  // Check if there were any exclude commands, if so remove excluded ips/cidrs
  let sortedDevices = Object.keys(devices);
  if (excludeCommands.length) {
    sortedDevices = sortedDevices.filter(
      entry =>
        !excludeCommands.reduce(
          (accum, filter) => cidrTools.overlap(filter.cidr, entry) || accum,
          false
        )
    );
  }
  // Filter and sort all the ip addresses
  sortedDevices = sortedDevices
    .filter(entry => isIp(entry))
    .sort((a, b) => {
      const num1 = Number(
        a
          .split(".")
          .map(num => `000${num}`.slice(-3))
          .join("")
      );
      const num2 = Number(
        b
          .split(".")
          .map(num => `000${num}`.slice(-3))
          .join("")
      );
      return num1 - num2;
    });
  // Create State
  state = state || { id: 2, parent: 1, vertex: 1 };
  let output = "";
  // Check if renderEmpty and if sortedDevices is Empty
  if (!subnet.renderEmpty && sortedDevices.length == 0) {
    return output;
  }
  // Set subnet width
  let width;
  if (subnet.autowidth) {
    width = subnet.padding.left * 2;
    const count =
      sortedDevices.length < subnet.device.columns
        ? sortedDevices.length
        : subnet.device.columns;
    width += count * subnet.device.width;
    width += (count - 1) * subnet.device.padding.left;
  } else {
    if (subnet.widthUnits === "pixels") {
      width = subnet.geometry.width;
    } else {
      width = subnet.device.width * subnet.geometry.width;
      width += (subnet.geometry.width - 1) * subnet.device.padding.left;
      width += subnet.padding.left * 2;
    }
  }
  // Set subnet height
  let height;
  if (subnet.autoheight) {
    // Check if the subnet has a label, if so adjust top padding
    height = subnet.padding.top * 2;
    if (subnet.label.length) {
      subnet.padding.top += 20;
      height += 10;
    }
    const count = Math.max(
      1,
      Math.ceil(sortedDevices.length / subnet.device.columns)
    );
    height += count * subnet.device.height;
    height += count * subnet.device.padding.top;
    height += count * subnet.device.lineHeight * subnet.lines.length;
  } else {
    if (subnet.heightUnits === "pixels") {
      height = subnet.geometry.height;
    } else {
      height = subnet.device.height * subnet.geometry.height;
      height +=
        subnet.geometry.height * subnet.device.lineHeight * subnet.lines.count;
    }
  }
  // Determine x and y position of subnet, check for autoposition
  const xpos = subnet.autoposition ? state.offsetx : subnet.geometry.x;
  const ypos = subnet.autoposition ? state.offsety : subnet.geometry.y;
  const topMargin =
    subnet.margin.top || false ? subnet.margin.top : state.margin.top;
  const leftMargin =
    subnet.margin.left || false ? subnet.margin.left : state.margin.left;
  // Create Group for Entire Subnet
  output += transformGroup(
    state,
    {
      x: xpos + leftMargin,
      y: ypos + topMargin,
      width: width,
      height: height
    },
    state.docparent
  );
  let oldParent = state.id;
  // Create big box
  output += transformBox(
    state,
    {
      x: 0,
      y: 0,
      width: width,
      height: height
    },
    subnet.style,
    oldParent,
    subnet.label
  );
  // If autoposition, update the state's x and y offsets for future objects
  if (subnet.autoposition) {
    state.prevWidth = width;
    state.prevHeight = height;
  }
  let x0 = subnet.padding.left;
  let x = x0;
  let y = subnet.padding.top;
  width = subnet.device.width;
  height = subnet.device.height;
  let paddingx = subnet.device.padding.left;
  let paddingy =
    subnet.device.padding.top + subnet.device.lineHeight * subnet.lines.length;
  let deviceCount = 1;
  let devicesPerRow = subnet.device.columns;
  for (let i = 0; i < sortedDevices.length; i++) {
    // Create Geometry
    let geometry = {
      x: x,
      y: y,
      width: width,
      height: height
    };
    // Create Group
    output += transformGroup(state, geometry, oldParent);
    geometry.x = 0;
    geometry.y = 0;
    // Create Device Background
    output += transformBox(
      state,
      geometry,
      subnet.device.background,
      state.parent
    );
    // Process Lines for Device
    const value = processLines(
      subnet.lines,
      devices[sortedDevices[i]],
      sortedDevices[i],
      subnet.id
    );
    // Create Device
    output += transformDevice(state, geometry, subnet.device.style, value);
    // Change Geometry
    if (deviceCount < devicesPerRow) {
      x += width + paddingx;
      deviceCount += 1;
    } else {
      x = x0;
      y += height + paddingy;
      deviceCount = 1;
    }
  }
  return output;
}

export { transformSubnet, subnetConfig };
