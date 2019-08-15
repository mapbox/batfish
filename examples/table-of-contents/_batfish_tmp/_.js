
      let Page = require('/Users/dan/Documents/github/batfish/examples/table-of-contents/src/pages/index.md');
      Page = Page.default || Page;
      module.exports = {
        component: Page,
        props: {
  "frontMatter": {
    "title": "Main page title"
  }
}
      };
    