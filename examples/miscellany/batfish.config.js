const path = require('path');
const selectors = require('./lib/selectors');

module.exports = () => {
  return {
    siteBasePath: '/miscellany',
    siteOrigin: 'https://www.your-batfish-site.com',
    stylesheets: [
      'https://api.mapbox.com/mapbox-assembly/v0.17.0/assembly.min.css'
    ],
    jsxtremeMarkdownOptions: {
      getWrapper: resource => {
        if (/\/stories\//.test(resource)) {
          return path.join(__dirname, './src/components/story-wrapper.js');
        }
      }
    },
    dataSelectors: selectors
  };
};
