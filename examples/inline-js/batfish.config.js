const path = require('path');

module.exports = () => {
  return {
    siteOrigin: 'https://www.mapbox.com',
    inlineJs: [{ filename: path.join(__dirname, './src/js/inline-me.js') }]
  };
};
