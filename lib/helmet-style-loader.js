'use strict';

const csso = require('csso');

module.exports = css => {
  const minifiedCss = csso.minify(css).css;
  const js = `
    const React = require('react');
    const Helmet = require('react-helmet').Helmet;
    class HelmetCss extends React.PureComponent {
      render() {
        const c = \`${minifiedCss}\`;
        return (
          <Helmet>
            <style>{c}</style>
          </Helmet>
        );
      }
    }
    module.exports = HelmetCss;
  `.trim();
  return js;
};
