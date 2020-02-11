import { filterRows, extractSubnets } from "../utility/extract.js";

/*eslint no-console: ["error", {"allow": ["log"]}] */
onmessage = function(e) {
  let subnets = e.data[0];
  var ips = e.data[1];
  const subs = extractSubnets(subnets);
  const tmp = filterRows(ips.sheets, subs);
  ips.sheets = tmp;
  this.postMessage(ips);
};
