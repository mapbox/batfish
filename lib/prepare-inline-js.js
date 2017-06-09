'use strict';

const UglifyJs = require('uglify-js');
const optimizeJs = require('optimize-js');

/**
 * Uglify and optimize JS for inlining.
 *
 * @param {string} js
 * @return {string}
 */
function prepareInlineJs(js) {
  const uglified = UglifyJs.minify(js).code;
  const optimized = optimizeJs(uglified);
  return optimized;
}

module.exports = prepareInlineJs;
