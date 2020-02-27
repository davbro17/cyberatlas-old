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
const extractIps = extract(entry => isIp(entry));
const extractSubnets = extract(entry => isCidr(entry) > 0);
const extractNetObjs = extract(entry => isCidr(entry) > 0 || isIp(entry));
const extractNetObjsWithRows = extractIncludeRows(
  entry => isCidr(entry) > 0 || isIp(entry)
);

function extractRegexes(sheets) {
  return extractStrings(sheets).map(s => new RegExp(s));
}

function filterRows(filter, check) {
  return function(sheets, values) {
    let output = [];
    let filteredRow = [];
    for (const sheet of sheets) {
      for (let row of sheet) {
        filteredRow = check ? row.filter(check) : row;
        if (filter(filteredRow, values)) {
          output.push(row);
        }
      }
    }
    return output;
  };
}

function getColumn(sheets, colIndex, sheetIndex) {
  let s = sheets;
  let output = [];
  if (sheetIndex && sheetIndex < sheets.length) {
    s = sheets[sheetIndex];
  }
  for (const sheet of s) {
    for (const row of sheet[colIndex]) {
      if (colIndex < row.length) {
        output.push(row[colIndex]);
      }
    }
  }
  return output;
}

const filterRowsNetObjs = filterRows(
  (ips, netObjs) =>
    netObjs.filter(net => cidrTools.overlap(net, ips)).length > 0,
  netObj => isIp(netObj) || isCidr(netObj) > 0
);

const filterRowsStringsEquals = filterRows((row, strings) =>
  strings.some(s => row.includes(s))
);

const filterRowsStringsContains = filterRows((row, strings) =>
  row.reduce(
    (accum, cell) =>
      accum ||
      strings.reduce((ret, string) => ret || cell.includes(string), false),
    false
  )
);

const filterRowsRegex = filterRows((row, regexes) =>
  row.reduce(
    (accum, cell) =>
      accum || regexes.reduce((ret, reg) => ret || reg.test(cell), false),
    false
  )
);

function filterValuesRegex(sheets, regexes) {
  let output = [];
  let matches = [];
  for (const sheet of sheets) {
    for (const row of sheet) {
      for (const entry of row) {
        const ret = regexes
          .map(r => Array.from(entry.matchAll(r)))
          .filter(m => m.length > 0);
        if (ret.length > 0) {
          matches.push(...ret);
        }
      }
    }
  }
  let groupNames = {};
  console.log(matches);
  for (let match of matches.filter(m => m.length > 0)) {
    /*eslint no-console: ["error", {"allow": ["log"]}] */
    if (match.groups) {
      Object.assign(groupNames, match.groups);
    }
    output.push({ indexed: Array.from(match), groups: match.groups });
  }
  return output;
}

function filterAndReplaceValues(sheets, regexes, replaceStrings, delimiter) {
  let output = [];
  const rLength = replaceStrings.length;
  for (const sheet of sheets) {
    for (const row of sheet) {
      for (const cell of row) {
        for (let i = 0; i < regexes.length; i++) {
          if (regexes[i].test(cell) && i < rLength) {
            output.push(
              cell.replace(regexes[i], replaceStrings[i]).split(delimiter)
            );
          }
        }
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
  extractStrings,
  extractRegexes,
  extractIps,
  extractNetObjsWithRows,
  filterRowsNetObjs,
  filterRowsStringsEquals,
  filterRowsStringsContains,
  filterRowsRegex,
  filterValuesRegex,
  filterAndReplaceValues,
  excludeRows,
  getColumn
};
