import transform from "../transform.js";

/*eslint no-console: ["error", {"allow": ["log"]}] */
onmessage = function(e) {
  let xml = transform(e.data[0], e.data[1], console.log);
  this.postMessage([e.data[2], xml]);
};
