import { extractNetObjs, filterRows, excludeRows } from "../utility/extract.js";

/*eslint no-console: ["error", {"allow": ["log"]}] */
onmessage = function(e) {
  let excelA = e.data[1];
  let excelB = e.data[2];
  let netObjs = null;
  switch (e.data[0]) {
    case 0: // Similarities
      netObjs = extractNetObjs(excelB.sheets);
      excelA.sheets = filterRows(excelA.sheets, netObjs);
      this.postMessage(excelA);
      break;
    case 1: // Excel 1 Differences
      netObjs = extractNetObjs(excelB.sheets);
      excelA.sheets = excludeRows(excelA.sheets, netObjs);
      this.postMessage(excelA);
      break;
    default:
      // Excel 2 Differences
      netObjs = extractNetObjs(excelA.sheets);
      excelB.sheets = excludeRows(excelB.sheets, netObjs);
      this.postMessage(excelB);
  }
};
