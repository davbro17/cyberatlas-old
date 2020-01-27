function transformText(string) {
  let output = "";
  if (string) {
    output += string
      .replace(/&/g, "&amp;amp;")
      .replace(/</g, "&amp;lt;")
      .replace(/>/g, "&amp;gt;")
      .replace(/'/g, "&#39;")
      .replace(/"/g, "&quote;")
      .replace(/\n/g, "&lt;br&gt;");
  }
  return output;
}

function transformHTML(html) {
  let output = "";
  if (html) {
    output += html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;")
      .replace(/\n/g, "");
  }
  return output;
}

function transformGeometry(geometry){
  let x = geometry.x || 0;
  let y = geometry.y || 0;
  let width = geometry.width || 100;
  let height = geometry.height || 100;
  return `<mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry"/>`;
}

export { transformText, transformHTML, transformGeometry };
