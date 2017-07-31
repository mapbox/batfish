module.exports = () => {
  return {
    port: 9999,
    stylesheets: [
      'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css',
      'https://api.mapbox.com/mapbox-assembly/v0.14.0/assembly.min.css',
      'src/**/*.css'
    ],
    jsxtremeMarkdownOptions: {
      remarkPlugins: [require('remark-emoji')],
      rehypePlugins: [require('rehype-highlight')]
    }
  };
};
