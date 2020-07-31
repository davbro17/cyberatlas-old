import transform from "../transform.js";

/*eslint no-console: ["error", {"allow": ["log"]}] */
onmessage = function(e) {
  const settings = e.data[0];
  const xml = transform(
    settings.configs,
    settings.layout,
    e.data[1],
    console.log
  );
  this.postMessage([e.data[2], xml]);
};
