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

function transformGeometry(geometry) {
  let x = geometry.x;
  let y = geometry.y;
  let width = geometry.width;
  let height = geometry.height;
  return `<mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry"/>`;
}

function transformStyle(style) {
  if (style) {
    let output = "";
    for (const property in style) {
      if (property === style[property]) {
        output += `${property};`;
      } else {
        output += `${property}=${style[property]};`;
      }
    }
    return output;
  }
}

export { transformText, transformHTML, transformGeometry, transformStyle };
