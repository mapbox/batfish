const path = require('path');

module.exports = () => {
  return {
    siteBasePath: '/example',
    siteOrigin: 'https://www.mapbox.com',
    stylesheets: [
      'https://api.mapbox.com/mapbox-assembly/v0.15.0/assembly.min.css',
      path.join(__dirname, './src/style.css')
    ]
  };
};
