const path = require('path');

module.exports = () => {
  return {
    stylesheets: [
      'https://api.mapbox.com/mapbox-assembly/v0.13.0/assembly.min.css',
      path.join(__dirname, './src/blog.css')
    ],
    applicationWrapperPath: path.join(__dirname, './src/components/wrapper.js')
  };
};
