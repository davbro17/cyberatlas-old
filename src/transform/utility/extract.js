import cidrTools from "cidr-tools";
import isCidr from "is-cidr";
import isIp from "is-ip";

function extract(filter) {
  return function(sheets) {
    let output = [];
    for (let i = 0; i < sheets.length; i++) {
      const s = sheets[i];
      for (let j = 0; j < s.length; j++) {
        const row = s[j];
        for (let k = 0; k < row.length; k++) {
          const entry = row[k];
          if (filter(entry)) {
            output.push(entry);
          }
        }
      }
    }
    return output;
  };
}

function extractIncludeRows(filter) {
  return function(sheets) {
    let output = {};
    for (let i = 0; i < sheets.length; i++) {
      const s = sheets[i];
      for (let j = 0; j < s.length; j++) {
        const row = s[j];
        for (let k = 0; k < row.length; k++) {
          const entry = row[k];
          if (filter(entry)) {
            output[entry] = row;
          }
        }
      }
    }
    return output;
  };
}

const extractSubnets = extract(entry => isCidr(entry) > 0);
const extractNetObjs = extract(entry => isCidr(entry) > 0 || isIp(entry));
const extractNetObjsWithRows = extractIncludeRows(
  entry => isCidr(entry) > 0 || isIp(entry)
);

function filterRows(sheets, netObjs) {
  let output = [];
  for (let i = 0; i < sheets.length; i++) {
    const s = sheets[i];
    for (let j = 0; j < s.length; j++) {
      const ip = s[j].filter(entry => isIp(entry));
      if (netObjs.filter(net => cidrTools.overlap(net, ip)).length > 0) {
        output.push(s[j]);
      }
    }
  }
  return output;
}
function excludeRows(sheets, netObjs) {
  let output = [];
  for (let i = 0; i < sheets.length; i++) {
    const s = sheets[i];
    for (let j = 0; j < s.length; j++) {
      const ip = s[j].filter(entry => isIp(entry));
      if (netObjs.filter(net => cidrTools.overlap(net, ip)).length == 0) {
        output.push(s[j]);
      }
    }
  }
  return output;
}

export {
  extractSubnets,
  extractNetObjs,
  extractNetObjsWithRows,
  filterRows,
  excludeRows
};
