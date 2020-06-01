const path = require('path');

module.exports = () => {
  return {
    inlineJs: [{ filename: path.join(__dirname, './src/js/inline-me.js') }]
  };
};
