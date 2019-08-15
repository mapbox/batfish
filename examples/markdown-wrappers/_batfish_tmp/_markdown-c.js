
      let Page = require('/Users/dan/Documents/github/batfish/examples/markdown-wrappers/src/pages/markdown-c.md');
      Page = Page.default || Page;
      module.exports = {
        component: Page,
        props: {
  "frontMatter": {
    "wrapper": "../components/markdown-wrapper-a"
  }
}
      };
    