const path = require('path');

module.exports = () => {
  return {
    stylesheets: [path.join(__dirname, 'src/style.css')],
    webpackStaticStubReactComponent: [path.join(__dirname, 'src/app.js')],
    staticHtmlInlineDeferCss: false
  };
};
