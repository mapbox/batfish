module.exports = () => {
  return {
    unprocessedPageFiles: ['static/**/*.md', 'static/not-page.js'],
    ignoreWithinPagesDirectory: ['**/*.txt', '*.xyz']
  };
};
