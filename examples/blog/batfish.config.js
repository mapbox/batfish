const path = require('path');
const selectors = require('./lib/selectors');

module.exports = () => {
  return {
    siteBasePath: '/blog',
    siteOrigin: 'https://www.your-batfish-site.com',
    stylesheets: [
      'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css'
    ],
    jsxtremeMarkdownOptions: {
      getWrapper: resource => {
        if (/\/events\//.test(resource)) {
          return path.join(__dirname, './src/components/event-wrapper.js');
        } else if (/\/events\//.test(resource)) {
          return path.join(__dirname, './src/components/post-wrapper.js');
        }
      }
    },
    dataSelectors: selectors
  };
};
