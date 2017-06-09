'use strict';

const postcss = require('postcss');
const postcssValuesParser = require('postcss-values-parser');

/**
 * Transform all urls in the stylesheet with a function.
 *
 * @param {Object} options
 * @param {Function} options.transform
 * @return {Function}
 */
function postcssTransformUrls(options) {
  return root => {
    root.walkDecls(decl => {
      if (!/url\(/.test(decl.value)) return;
      const valueAst = postcssValuesParser(decl.value).parse();
      let hasChanged = false;
      valueAst.walk(node => {
        if (node.type !== 'func' || node.value !== 'url') return;
        node.each(innerNode => {
          // The first word node inside the function is its URL.
          // Other nodes include parentheses and quotation marks.
          if (innerNode.type !== 'word') return;
          const originalUrl = innerNode.value;
          if (!originalUrl) return;
          const transformedUrl = options.transform(originalUrl);
          if (transformedUrl === originalUrl) return;
          hasChanged = true;
          innerNode.replaceWith(transformedUrl);
        });
      });
      if (!hasChanged) return;
      decl.value = valueAst.toString();
    });
  };
}

module.exports = postcss.plugin('postcss-transform-urls', postcssTransformUrls);
