const path = require('path');

module.exports = () => {
  return {
    siteOrigin: 'https://www.batfish-basic.com',
    stylesheets: [
      'https://api.mapbox.com/mapbox-assembly/v0.17.0/assembly.min.css',
      path.join(__dirname, './src/style.css')
    ],
    jsxtremeMarkdownOptions: {
      wrapper: path.join(__dirname, './src/components/markdown-wrapper.js')
    }
  };
};
