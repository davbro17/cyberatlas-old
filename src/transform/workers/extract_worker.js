import {
  filterRowsNetObjs,
  filterRowsStrings,
  extractSubnets,
  extractStrings,
} from "../utility/extract.js";

/*eslint no-console: ["error", {"allow": ["log"]}] */
onmessage = function(e) {
  let sheetsB = e.data[1];
  let excelA = e.data[2];
  let tmp, subnets;
  const settings = e.data[0];
  switch (settings.options.indexOf(settings.selected)) {
    case 0:
      subnets = extractSubnets(sheetsB);
      tmp = filterRowsNetObjs(excelA.sheets, subnets);
      break;
    case 1:
      subnets = extractStrings(sheetsB);
      tmp = filterRowsStrings(excelA.sheets, subnets);
      break;
    default:
      subnets = extractStrings(sheetsB);
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
