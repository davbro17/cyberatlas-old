import {
  filterRowsNetObjs,
  filterRowsStringsEquals,
  filterRowsStringsContains,
  filterRowsRegex,
  filterValuesRegex,
  filterAndReplaceValues,
  extractSubnets,
  extractStrings,
  extractRegexes,
  extractNetObjs,
  extractIps,
  getColumn
} from "../utility/extract.js";

/*eslint no-console: ["error", {"allow": ["log"]}] */
onmessage = function(e) {
  let sheetsB = e.data[1];
  let excelA = e.data[2];
  let tmp, subnets, replaceStrings;
  const settings = e.data[0];
  switch (settings.options.indexOf(settings.selected)) {
    case 0:
      console.log("IP/CIDR");
      if (settings.filterIps && !settings.filterCidrs) {
        subnets = extractIps(sheetsB);
      } else if (!settings.filterIps && settings.filterCidrs) {
        subnets = extractSubnets(sheetsB);
      } else {
        subnets = extractNetObjs(sheetsB);
      }
      tmp = filterRowsNetObjs(excelA.sheets, subnets);
      break;
    case 1:
      console.log("Strings");
      subnets = extractStrings(sheetsB);
      tmp =
        settings.stringOperation === "equals"
          ? filterRowsStringsEquals(excelA.sheets, subnets)
          : filterRowsStringsContains(excelA.sheets, subnets);
      break;
    case 2:
      console.log("Regex");
      subnets = extractRegexes(sheetsB);
      console.log(subnets);
      tmp =
        settings.regexOperation === "filter"
          ? filterRowsRegex(excelA.sheets, subnets)
          : filterValuesRegex(excelA.sheets, subnets);
      break;
    default:
      console.log("Replace");
      // Get Regular Expressions from the first Column
      subnets = extractRegexes([[getColumn(sheetsB, 0)]]);
      replaceStrings = getColumn(sheetsB, 1);
      tmp = filterAndReplaceValues(
        sheetsB,
        subnets,
        replaceStrings,
        settings.replacementStringDelimiter
      );
  }
  // Get length of headers in ip data
  const headerLength = excelA.headers.length;
  for (let i = 0; i < tmp.length; i++) {
    const row = tmp[i];
    for (let j = row.length; j < headerLength; j++) {
      row.push("");
    }
  }
  excelA.sheets = tmp;
  this.postMessage([excelA, subnets]);
};
