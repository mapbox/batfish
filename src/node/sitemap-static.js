// from https://github.com/tmcw/sitemap-static
'use strict';

const findit = require("findit");
const path = require("path");

const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

function indent(level) {
  let space = "    ";
  let str = "";
  for (let i = 0; i < level; i++) {
    str += space;
  }
  return str;
}

module.exports = function(stream, o = {}) {
  // accepts
  //
  // write - stream writer
  // {
  //   findRoot - string
  //   ignoreFile - string
  //   prefix - string
  // }

  const finder = findit(o.findRoot || ".");
  const prefix = o.prefix || "";
  const ignore_file = o.ignoreFile || "";
  const pretty = o.pretty || false;
  let ignore_folders = [];
  let ignore = [];

  stream.write(header);

  if (ignore_file) {
    ignore = require(process.cwd() + "/" + ignore_file);
    ignore_folders = ignore
      .filter(name => path.extname(name) !== ".html")
      .map(name => new RegExp("^" + name));
  }

  finder.on("file", function(file /*, stat */) {
    if (file.indexOf(".html") === -1 || ignore.indexOf(file) !== -1) {
      return;
    }

    if (ignore_folders.find(folder => file.match(folder))) return;
    let filepath = path.relative(o.findRoot, file);

    if (pretty) {
      if (path.basename(filepath) === "index.html") {
        var dir = path.dirname(filepath);
        filepath = dir === "." ? "" : dir;
      } else {
        filepath = path.join(
          path.dirname(filepath),
          path.basename(filepath, ".html")
        );
      }
    }

    stream.write(`
${indent(1)}<url>
${indent(2)}<loc>${prefix}${filepath}</loc>
${indent(1)}</url>`);
  });

  finder.on("end", function() {
    stream.write("\n</urlset>\n");
    if (stream !== process.stdout) {
      stream.end();
    }
  });
};