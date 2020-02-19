import { extractNetObjsWithRows } from "../utility/extract.js";

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
            if (entry in netObjs)
              row.push(...netObjs[entry].filter(e => e != entry));
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

function generateHeaders(n) {
  let result = [];
  // Get index of first and last letters
  const indexA = "A".charCodeAt(0);
  const indexZ = "Z".charCodeAt(0);

  let alphabetLength = indexZ - indexA + 1;
  const repeatNum = Math.floor(n / alphabetLength);

  let startIndex = 0;
  let startString = "";
  let string = "";

  while (startIndex <= repeatNum) {
    if (startIndex > 0) {
      startString = String.fromCharCode(indexA + startIndex - 1);
    }

    if (startIndex === repeatNum) {
      alphabetLength = n % alphabetLength;
    }

    for (var i = 0; i < alphabetLength; i++) {
      string = String.fromCharCode(indexA + i);

      result.push(startString + string);
    }
    startIndex++;
  }
  return result;
}
