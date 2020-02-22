import XLSX from "xlsx";

onmessage = function(e) {
  let data = {
    sheets: [],
    headers: [],
    customHeaders: [],
    sheetNames: []
  };
  /*eslint no-console: ["error", {"allow": ["log"]}] */
  if (typeof e.data[0] === "string") {
    data.sheetNames.push(e.data[1]);
    data.headers.push("A");
    data.customHeaders.push([]);
    data.sheets.push(e.data[0].split(/\r?\n/).map(e => [e]));
  } else {
    let raw = new Uint8Array(e.data[0]);
    let wb = XLSX.read(raw, { type: "array" });
    let sheetList = wb.SheetNames;
    for (let i = 0; i < sheetList.length; i++) {
      let json = XLSX.utils.sheet_to_json(wb.Sheets[sheetList[i]], {
        defval: "",
        header: "A"
      });
      let columnentries = json.map(function(obj) {
        return Object.keys(obj).length;
      });
      let colcount = Math.max(...columnentries);
      let rowcount = json.length;
      let tmp = Array.from(Array(rowcount), () => new Array(colcount));
      for (var j = 0; j < rowcount; j++) {
        let row = json[j];
        var cols = Object.values(row);
        for (var k = 0; k < colcount; k++) {
          tmp[j][k] = cols[k] || "";
        }
      }
      data.sheets.push(tmp);
      if (colcount > data.headers.length) {
        data.headers.splice(0, data.headers.length);
        for (let column in json[0]) {
          data.headers.push(column);
        }
      }
      data.sheetNames.push(sheetList[i]);
      data.customHeaders.push([]);
    }
  }
  this.postMessage(data);
};
