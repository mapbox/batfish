
      let Page = require('/Users/dan/Documents/github/batfish/examples/page-specific-css/src/pages/another.md');
      Page = Page.default || Page;
      module.exports = {
        component: Page,
        props: {
  "frontMatter": {
    "prependJs": [
      "import AnotherCss from './another.css'"
    ]
  }
}
      };
    