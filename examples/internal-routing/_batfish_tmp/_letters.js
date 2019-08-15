
      let Page = require('/Users/dan/Documents/github/batfish/examples/internal-routing/src/pages/letters.js');
      Page = Page.default || Page;
      module.exports = {
        component: Page,
        props: {
  "frontMatter": {
    "internalRouting": true
  }
}
      };
    