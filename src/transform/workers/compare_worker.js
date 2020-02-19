import { extractNetObjs, filterRows, excludeRows } from "../utility/extract.js";

/*eslint no-console: ["error", {"allow": ["log"]}] */
onmessage = function(e) {
  let excelA = e.data[1];
  let excelB = e.data[2];
  let netObjs = null;
  let output = null;
  switch (e.data[0]) {
    case 0: // Similarities
      netObjs = extractNetObjs(excelB.sheets);
      excelA.sheets = filterRows(excelA.sheets, netObjs);
      output = excelA;
      output.fileName =
        excelA.fileName.split(".")[0] +
        "-" +
        excelB.fileName.split(".")[0] +
        "-similarities.xlsx";
      break;
    case 1: // Excel 1 Differences
      netObjs = extractNetObjs(excelB.sheets);
      excelA.sheets = excludeRows(excelA.sheets, netObjs);
      output = excelA;
      output.fileName = excelA.fileName.split(".")[0] + "-differences.xlsx";
      break;
    default:
      // Excel 2 Differences
      netObjs = extractNetObjs(excelA.sheets);
      excelB.sheets = excludeRows(excelB.sheets, netObjs);
      output = excelB;
      output.fileName = excelB.fileName.split(".")[0] + "-differences.xlsx";
  }
  // Get length of headers in ip data
  const headerLength = output.headers.length;
  for (let i = 0; i < output.sheets.length; i++) {
    const row = output.sheets[i];
    for (let j = row.length; j < headerLength; j++) {
      row.push("");
    }
  }
  this.postMessage(output);
};
