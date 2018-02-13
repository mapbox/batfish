const path = require('path');

module.exports = () => {
  return {
    jsxtremeMarkdownOptions: {
      getWrapper: resource => {
        if (/-a\.md$/.test(resource)) {
          return path.join(__dirname, './src/components/markdown-wrapper-a.js');
        }
        return path.join(__dirname, './src/components/markdown-wrapper-b.js');
      }
    }
  };
};
