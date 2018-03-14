'use strict';

const path = require('path');
const createBabelConfig = require('../src/node/create-babel-config');

const abs = x => path.join(__dirname, x);

const defaultBatfishConfig = () => ({
  babelPlugins: [],
  babelPresets: [],
  jsxtremeMarkdownOptions: {},
  browserslist: 'mock-browserslist',
  production: true
});

const relativizeBabelSetting = p => {
  if (!Array.isArray(p)) {
    return `./${path.relative(__dirname, p)}`;
  }
  return [`./${path.relative(__dirname, p[0])}`, p[1]];
};

describe('createBabelConfig', () => {
  test('with defaults', () => {
    const actual = createBabelConfig(defaultBatfishConfig());
    expect(actual.presets.map(relativizeBabelSetting)).toMatchSnapshot();
    expect(actual.plugins.map(relativizeBabelSetting)).toMatchSnapshot();
  });

  test('with Node target', () => {
    const actual = createBabelConfig(defaultBatfishConfig(), {
      target: 'node'
    });
    expect(actual.presets.map(relativizeBabelSetting)).toMatchSnapshot();
  });

  test('with Batfish config that affects Babel', () => {
    const actual = createBabelConfig(
      Object.assign(defaultBatfishConfig(), {
        babelPlugins: [abs('foo/bar'), abs('baz')],
        babelPresets: [abs('a/b'), abs('c')],
        jsxtremeMarkdownOptions: {
          remarkPlugins: ['remark-plugin-a'],
          rehypePlugins: ['rehype-plugin-a', 'rehype-plugin-b']
        }
      })
    );
    expect(actual.presets.map(relativizeBabelSetting)).toMatchSnapshot();
    expect(actual.plugins.map(relativizeBabelSetting)).toMatchSnapshot();
  });

  test('non-false devBrowserslist is used in non-production', () => {
    const actual = createBabelConfig(
      Object.assign(defaultBatfishConfig(), {
        production: false,
        devBrowserslist: 'mock-dev-browserslist'
      })
    );
    expect(actual.presets.map(relativizeBabelSetting)).toMatchSnapshot();
  });

  test('false devBrowserslist is not used in non-production', () => {
    const actual = createBabelConfig(
      Object.assign(defaultBatfishConfig(), {
        production: false,
        devBrowserslist: false
      })
    );
    expect(actual.presets.map(relativizeBabelSetting)).toMatchSnapshot();
  });

  test('non-false devBrowserslist is not used in production', () => {
    const actual = createBabelConfig(
      Object.assign(defaultBatfishConfig(), {
        production: true,
        devBrowserslist: 'mock-dev-browserslist'
      })
    );
    expect(actual.presets.map(relativizeBabelSetting)).toMatchSnapshot();
  });
});
