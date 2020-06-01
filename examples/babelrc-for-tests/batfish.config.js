module.exports = () => {
  return {
    babelPlugins: [
      require.resolve('babel-plugin-transform-function-composition')
    ],
    babelExclude: /\/node_modules\//
  };
};
