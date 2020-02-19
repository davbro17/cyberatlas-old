import { filterRows, extractSubnets } from "../utility/extract.js";

/*eslint no-console: ["error", {"allow": ["log"]}] */
onmessage = function(e) {
  let subnets = e.data[0];
  let ips = e.data[1];
  const subs = extractSubnets(subnets);
  const tmp = filterRows(ips.sheets, subs);
  // Get length of headers in ip data
  const headerLength = ips.headers.length;
  for (let i = 0; i < tmp.length; i++) {
    const row = tmp[i];
    for (let j = row.length; j < headerLength; j++) {
      row.push("");
    }
  }
  ips.sheets = tmp;
  this.postMessage([ips, subs]);
};
