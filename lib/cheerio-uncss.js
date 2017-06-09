'use strict';

const cheerio = require('cheerio');
const postcss = require('postcss');
const csso = require('csso');
const _ = require('lodash');

const removeUnusedPlugin = postcss.plugin('remove-unused', removeUnused);

/**
 * A simplified version of what uncss does. Instead of using PhantomJS or jsdom
 * to load the page and try to size things, load resources, etc., we are just
 * parsing the HTML with cheerio and using its built-in selector support to find
 * which selectors in our CSS correspond to elements on the page.
 *
 * Selectors are removed if they do not have a corresponding elements.
 * Rules without selectors are then removed.
 * Empty at-rules (because they lost all their rules) should be removed during
 * minification.
 *
 * @param {string} html
 * @param {string} css
 * @return {string} - Trimmed-down and minified CSS.
 */
function cheerioUncss(html, css) {
  return postcss()
    .use(removeUnusedPlugin({ html }))
    .process(css)
    .then(result => csso.minify(result.css).css);
}

/**
 * The PostCSS plugin that removes unused CSS as described above.
 *
 * @param {Object} options
 * @param {string} options.html
 * @return {Function}
 */
function removeUnused(options) {
  const $ = cheerio.load(options.html);

  return root => {
    root.walkRules(rule => {
      let cleanedSelectors = [];
      if (/keyframes/.test(_.get(rule, 'parent.name', ''))) return;
      rule.selectors.forEach(selector => {
        const pseudolessSelector = selector.replace(
          /:not\(.*?\)|::?[-a-z]+/g,
          ''
        );
        if (!pseudolessSelector) return;
        const match = $(pseudolessSelector);
        if (match.length > 0) {
          cleanedSelectors.push(selector);
        }
      });

      // Remove rules that have no applicable selectors
      if (cleanedSelectors.length === 0) {
        rule.remove();
      } else {
        rule.selector = cleanedSelectors.join(', ');
      }
    });

    return root;
  };
}

module.exports = cheerioUncss;
