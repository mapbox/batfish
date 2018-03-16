const path = require('path');

module.exports = () => {
  return {
    webpackStaticStubReactComponent: [path.join(__dirname, 'src/app.js')]
  };
};
