module.exports = () => {
  return {
    port: 9999,
    externalStylesheets: [
      'https://api.mapbox.com/mapbox-assembly/v0.14.0/assembly.min.css'
    ],
    data: {
      cta: 'Demonstrate examples related to Markdown!',
      siteTitle: 'Markdown World'
    },
    dataSelectors: {}
  };
};
