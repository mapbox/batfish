
      let Page = require('/Users/dan/Documents/github/batfish/examples/basic/src/pages/markdown.md');
      Page = Page.default || Page;
      module.exports = {
        component: Page,
        props: {
  "frontMatter": {
    "title": "Markdown page",
    "description": "Another basic Batfish example."
  }
}
      };
    