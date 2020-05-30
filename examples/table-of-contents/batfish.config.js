const path = require('path');

module.exports = () => {
  return {
    jsxtremeMarkdownOptions: {
      wrapper: path.join(__dirname, './src/components/markdown-wrapper.js'),
    },
  };
};
