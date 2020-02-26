import { textBoxConfig } from "../configs/textbox";

let subnetConfig = {
  name: "Subnet",
  icon: "network-wired",
  component: "SubnetConfig",
  connections: [],
  commands: [],
  singleton: false,
  conditionalRender: false,
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
  multipleLines: true,
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
      aspect: "fixed",
      html: 1,
      fillColor: "none",
      strokeColor: "none",
      align: "center",
      outlineConnect: 0
    }
  }
};

let networksConfig = JSON.parse(JSON.stringify(subnetConfig));
networksConfig.name = "Networks";
networksConfig.icon = "project-diagram";
networksConfig.lines = [[{ type: "ip", text: "NETWORK", edit: false }]];
networksConfig.background = {
  background: {
    html: 1,
    verticalAlign: "middle",
    fillColor: "#FFFFFF",
    strokeColor: "#000000",
    rounded: 0,
    fontStyle: 1
  }
};
networksConfig.device.style = {
  shape: "none",
  aspect: "fixed",
  html: 1,
  verticalAlign: "middle",
  outlineConnect: 0
};
networksConfig.device.width = 100;
networksConfig.device.height = 50;

let cloudConfig = JSON.parse(JSON.stringify(subnetConfig));
cloudConfig.name = "Cloud";
cloudConfig.icon = "cloud";
cloudConfig.multipleLines = false;
cloudConfig.singleton = true;
cloudConfig.autowidth = true;
cloudConfig.lines = [[{ type: "text", text: "Cumulus", edit: true }]];
cloudConfig.background = {
  background: {
    html: 1,
    fillColor: "none",
    strokeColor: "none",
    rounded: 0,
    fontStyle: 1
  }
};
cloudConfig.device.style = {
  shape: "cloud",
  aspect: "fixed",
  elipse: "elipse",
  html: 1,
  verticalAlign: "middle",
  outlineConnect: 0
};
cloudConfig.device.width = 150;
cloudConfig.device.height = 100;
cloudConfig.style = {
  fillColor: "none",
  rounded: 0,
  fontStyle: 1,
  strokeColor: "none"
};

let netDeviceConfig = JSON.parse(JSON.stringify(subnetConfig));
netDeviceConfig.name = "Network Device";
netDeviceConfig.icon = "ethernet";
netDeviceConfig.multipleLines = false;
netDeviceConfig.singleton = true;
netDeviceConfig.autowidth = true;
netDeviceConfig.lines = [[{ type: "text", text: "WindowsXP", edit: true }]];
netDeviceConfig.background = {
  background: {
    html: 1,
    fillColor: "none",
    strokeColor: "none",
    rounded: 0,
    fontStyle: 1
  }
};
netDeviceConfig.style = {
  fillColor: "none",
  rounded: 0,
  fontStyle: 1,
  strokeColor: "none"
};

let options = [
  subnetConfig,
  textBoxConfig,
  cloudConfig,
  netDeviceConfig,
  networksConfig
];

for (let opt of options) {
  opt.title = opt.name;
}

export default options;
