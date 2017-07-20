const path = require('path');

module.exports = () => {
  return {
    externalStylesheets: [
      'https://api.mapbox.com/mapbox-assembly/v0.13.0/assembly.min.css'
    ],
    wrapperPath: path.join(__dirname, './src/components/wrapper.js')
  };
};
