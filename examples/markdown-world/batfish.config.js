module.exports = () => {
  return {
    port: 9999,
    externalStylesheets: [
      'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css',
      'https://api.mapbox.com/mapbox-assembly/v0.14.0/assembly.min.css'
    ],
    jsxtremeMarkdownOptions: {
      remarkPlugins: [require('remark-emoji')],
      rehypePlugins: [require('rehype-highlight')]
    },
    data: {
      cta: 'Demonstrate examples related to Markdown!',
      siteTitle: 'Markdown World'
    }
  };
};
