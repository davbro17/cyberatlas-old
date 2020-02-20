import { textBoxConfig } from "../../transform/configs/textbox";

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
    verticalLabelPosition: "bottom",
    html: 1,
    verticalAlign: "top",
    fillColor: "#FFFFFF",
    strokeColor: "#000000",
    align: "center",
    rounded: 0,
    fontStyle: 1
  }
};
networksConfig.device.style.shape = "none";

export default [
  subnetConfig,
  textBoxConfig,
  {
    name: "Cloud",
    icon: "cloud",
    component: "CloudConfig",
    id: Date.now()
  },
  {
    name: "Network Device",
    icon: "ethernet",
    component: "NetDeviceConfig",
    id: Date.now()
  },
  networksConfig,
  {
    name: "Collection",
    icon: "th",
    component: "CollectionConfig",
    id: Date.now()
  }
];
