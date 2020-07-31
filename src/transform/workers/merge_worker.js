import { extractNetObjsWithRows } from "../utility/extract.js";
import cidrTools from "cidr-tools";
import isIp from "is-ip";
import generateHeaders from "../utility/headers.js";

/*eslint no-console: ["error", {"allow": ["log"]}] */
onmessage = function(e) {
  let excelA = e.data[1];
  let excelB = e.data[2];
  let headerLength = 0;
  let netObjs = {};
  switch (e.data[0]) {
    case 0: // Columns
      netObjs = extractNetObjsWithRows(excelB.sheets);
      excelA.headers = generateHeaders(
        excelA.headers.length + excelB.headers.length - 1
      );
      headerLength = excelA.headers.length;
      for (let i = 0; i < excelA.sheets.length; i++) {
        const sheet = excelA.sheets[i];
        for (let j = 0; j < sheet.length; j++) {
          const row = sheet[j];
          for (let k = 0; k < row.length; k++) {
            const entry = row[k];
            Object.keys(netObjs)
              .filter(n => isIp(entry) && cidrTools.overlap(n, entry))
              .forEach(f => row.push(...netObjs[f].filter(e => e != f)));
          }
          for (let k = row.length; k < headerLength; k++) {
            row.push("");
          }
        }
      }

      break;
    default:
      // Sheets
      excelA.sheets.push(...excelB.sheets);
      excelA.files.push(...excelB.files);
      excelA.customHeaders.push(...excelB.customHeaders);
  }
  excelA.fileName =
    excelA.fileName.split(".")[0] +
    "-" +
    excelB.fileName.split(".")[0] +
    "-merged.xlsx";
  this.postMessage(excelA);
};
