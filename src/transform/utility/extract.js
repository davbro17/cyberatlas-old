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

const extractStrings = extract(entry => entry);
const extractSubnets = extract(entry => isCidr(entry) > 0);
const extractNetObjs = extract(entry => isCidr(entry) > 0 || isIp(entry));
const extractNetObjsWithRows = extractIncludeRows(
  entry => isCidr(entry) > 0 || isIp(entry)
);

function filterRows(filter, check) {
  return function(sheets, values) {
    let output = [];
    for (const sheet of sheets) {
      for (let row of sheet) {
        row = check ? row.filter(check) : row;
        if (filter(row, values)) {
          output.push(row);
        }
      }
    }
    return output;
  };
}

const filterRowsNetObjs = filterRows(
  (ips, netObjs) =>
    netObjs.filter(net => cidrTools.overlap(net, ips)).length > 0,
  netObj => isIp(netObj) || isCidr(netObj) > 0
);
const filterRowsStrings = filterRows((row, strings) =>
  strings.some(s => row.includes(s))
);

function filterValuesRegex(sheets, regexes) {
  let output = [];
  let matches = [];
  for (const sheet of sheets) {
    for (const row of sheet) {
      for (const entry of row) {
        matches.push(...regexes.map(r => entry.matchAll(r)).filter(m => m));
      }
    }
  }
  let groupNames = {};
  for (let match in matches) {
    if (match.groups) {
      Object.assign(groupNames, match.groups);
    }
    output.push({ indexed: Array.from(match), groups: match.groups });
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
  extractStrings,
  extractNetObjsWithRows,
  filterRowsNetObjs,
  filterRowsStrings,
  filterValuesRegex,
  excludeRows
};
