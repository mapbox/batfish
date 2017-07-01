'use strict';

const csso = require('csso');

/**
 * Transform CSS into a simple JS module that writes the CSS to a <style>
 * tag in the <head> of the document, using react-helmet.
 *
 * @param {string} css
 * @return {string} - The JS module.
 */
function helmetStyleLoader(css) {
  const minifiedCss = csso.minify(css).css;
  const js = `
    const React = require('react');
    const Helmet = require('react-helmet').Helmet;
    class HelmetCss extends React.PureComponent {
      render() {
        const css = \`${minifiedCss}\`;
        return (
          <Helmet>
            <style>{css}</style>
          </Helmet>
        );
      }
    }
    module.exports = HelmetCss;
  `.trim();
  return js;
}

module.exports = helmetStyleLoader;
