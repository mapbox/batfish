module.exports = () => {
  return {
    siteOrigin: 'https://www.batfish-basic.com',
    webpackLoaders: [
      {
        test: /\.html$/,
        /* simulates a process where an html file is transformed and then saved to assets folder */
        use: [
          'file-loader?name=[name]-demo.[ext]',
          'extract-loader',
          {
            loader: 'html-loader',
            options: {
              minimize: true
            }
          }
        ]
      }
    ],
    ignoreWithinPagesDirectory: ['example/*.html'],
    sitemap: {
      ignoreFile: 'ignore.js'
    }
  };
};
