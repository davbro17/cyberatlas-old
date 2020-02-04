import isIp from "is-ip";
import {
  transformBox,
  transformGroup,
  transformDevice
} from "../utility/transformBox.js";

function transformSubnet(subnet, data, state, devices) {
  /*eslint no-console: ["error", {"allow": ["log"]}] */
  // Filter and sort all the ip addresses
  let sortedDevices = Object.keys(devices)
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
  // Create the BIG box group
  // Set the parent to the document parent
  output += transformGroup(state, subnet.geometry, state.docparent);
  // Create big box
  output += transformBox(
    state,
    {
      x: 0,
      y: 0,
      width: subnet.geometry.width,
      height: subnet.geometry.height
    },
    subnet.style
  );
  let oldParent = state.id;
  let x0 = subnet.padding.left;
  let x = x0;
  let y = subnet.padding.top;
  let width = subnet.device.width;
  let height = subnet.device.height;
  let paddingx = subnet.device.padding.left;
  let paddingy = subnet.device.padding.top;
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
    output += transformBox(state, geometry, subnet.device.background);
    // Create Device

    const ip = sortedDevices[i];
    output += transformDevice(state, geometry, subnet.device.style, ip);
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

export { transformSubnet };
