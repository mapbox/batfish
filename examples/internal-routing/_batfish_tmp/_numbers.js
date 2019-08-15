
      let Page = require('/Users/dan/Documents/github/batfish/examples/internal-routing/src/pages/numbers.js');
      Page = Page.default || Page;
      module.exports = {
        component: Page,
        props: {
  "frontMatter": {
    "internalRouting": true
  }
}
      };
    