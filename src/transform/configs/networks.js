import isCidr from "is-cidr";
import { transformBox, transformGroup } from "../utility/transformBox.js";

let networksConfig = {
  name: "Networks",
  icon: "project-diagram",
  component: "NetworksConfig",
  id: Date.now(),
  lines: [],
  commands: [],
  style: {
    fillColor: "#d5e8d4",
    rounded: 0,
    verticalAlign: "top",
    fontStyle: 1
  },
  label: "",
  geometry: {
    x: 0,
    y: 0,
    width: 810,
    height: 200
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
    columns: 3,
    width: 200,
    height: 100,
    padding: {
      top: 10,
      left: 10
    },
    style: {
      shape: "",
      html: 1,
      rounded: 0,
      fontStyle: 1
    }
  }
};

function transformNetworks(networks, data, state, devices) {
  /*eslint no-console: ["error", {"allow": ["log"]}] */
  // Filter and sort all the ip addresses
  let sortedDevices = Object.keys(devices).filter(entry => isCidr(entry) > 0);
  // Create State
  state = state || { id: 2, parent: 1, vertex: 1 };
  let output = "";
  // Create the BIG box group
  // Set the parent to the document parent
  output += transformGroup(state, networks.geometry, state.docparent);
  let oldParent = state.id;
  // Check if the networks has a label, if so adjust top padding
  if (networks.label.length) {
    networks.padding.top += 20;
    networks.geometry.height += 20;
  }
  // Create big box
  output += transformBox(
    state,
    {
      x: 0,
      y: 0,
      width: networks.geometry.width,
      height: networks.geometry.height
    },
    networks.style,
    state.parent,
    networks.label
  );
  let x0 = networks.padding.left;
  let x = x0;
  let y = networks.padding.top;
  let width = networks.device.width;
  let height = networks.device.height;
  let paddingx = networks.device.padding.left;
  let paddingy = networks.device.padding.top;
  let deviceCount = 1;
  let devicesPerRow = networks.device.columns;
  for (let i = 0; i < sortedDevices.length; i++) {
    // Create Geometry
    let geometry = {
      x: x,
      y: y,
      width: width,
      height: height
    };
    // Create Network Box
    const cidr = sortedDevices[i];
    output += transformBox(
      state,
      geometry,
      networks.device.style,
      oldParent,
      cidr
    );
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

export { transformNetworks, networksConfig };
