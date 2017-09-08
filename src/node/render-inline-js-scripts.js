// @flow
'use strict';

const fs = require('fs');
const UglifyJs = require('uglify-js');

function renderInlineJsScripts(inlineJsEntries?: Array<InlineJsEntry>): string {
  if (!inlineJsEntries) {
    return '';
  }

  return inlineJsEntries
    .map(jsData => {
      let code = fs.readFileSync(jsData.filename, 'utf8');
      if (jsData.uglify !== false) {
        const uglified = UglifyJs.minify(code);
        if (uglified.error) throw uglified.error;
        code = uglified.code;
      }
      return `<script>${code}</script>`;
    })
    .join('\n');
}

module.exports = renderInlineJsScripts;
