'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const writeBabelrc = require('../src/node/write-babelrc');
const validateConfig = require('../src/node/validate-config');
const createBabelConfig = require('../src/node/create-babel-config');

jest.mock('fs', () => ({
  writeFileSync: jest.fn()
}));

jest.mock('mkdirp', () => ({
  sync: jest.fn()
}));

jest.mock('../src/node/validate-config', () => {
  const fn = jest.fn(() => fn.mockValidatedConfig);
  fn.mockValidatedConfig = {};
  return fn;
});

jest.mock('../src/node/create-babel-config', () => {
  return jest.fn(() => ({
    plugins: [],
    presets: []
  }));
});

const createMockBabelConfig = outputDirectory => {
  return {
    presets: [
      path.join(outputDirectory, 'preset/foo'),
      [
        path.join(outputDirectory, 'preset/bar/baz'),
        {
          one: 1
        }
      ]
    ],
    plugins: [
      path.join(outputDirectory, 'plugins/foo'),
      [
        path.join(outputDirectory, 'plugins/bar/baz'),
        {
          one: 1
        }
      ]
    ]
  };
};

describe('writeBabelrc', () => {
  beforeEach(() => {
    validateConfig.mockValidatedConfig = {
      babelPresets: [],
      babelPlugins: [],
      jsxtremeMarkdownOptions: {}
    };
  });

  test('calls mkdirp to create directory for .babelrc', () => {
    writeBabelrc();
    expect(mkdirp.sync).toHaveBeenCalledWith(process.cwd());
  });

  test('calls mkdirp to create directory for .babelrc if options.projectDirectory is set', () => {
    const projectDirectory = '/foo/bar';
    writeBabelrc({}, { projectDirectory });
    expect(mkdirp.sync).toHaveBeenCalledWith(projectDirectory);
  });

  test('calls mkdirp to create directory for .babelrc if options.outputDirectory is set', () => {
    const outputDirectory = '/foo/bar';
    writeBabelrc({}, { outputDirectory });
    expect(mkdirp.sync).toHaveBeenCalledWith(outputDirectory);
  });

  test('writes .babelrc to the correct place', () => {
    writeBabelrc();
    expect(fs.writeFileSync.mock.calls[0][0]).toBe(
      path.join(process.cwd(), '.babelrc')
    );
  });

  test('writes .babelrc to the correct place if options.projectDirectory is set', () => {
    const projectDirectory = '/foo/bar';
    writeBabelrc({}, { projectDirectory });
    expect(fs.writeFileSync.mock.calls[0][0]).toBe(
      path.join(projectDirectory, '.babelrc')
    );
  });

  test('writes .babelrc to the correct place if options.outputDirectory is set', () => {
    const outputDirectory = '/foo/bar';
    writeBabelrc({}, { outputDirectory });
    expect(fs.writeFileSync.mock.calls[0][0]).toBe(
      path.join(outputDirectory, '.babelrc')
    );
  });

  test('returns filepath of .babelrc', () => {
    const filepath = writeBabelrc();
    expect(filepath).toBe(path.join(process.cwd(), '.babelrc'));
  });

  test('returns filepath of .babelrc if options.projectDirectory is set', () => {
    const projectDirectory = '/foo/bar';
    const filepath = writeBabelrc({}, { projectDirectory });
    expect(filepath).toBe(path.join(projectDirectory, '.babelrc'));
  });

  test('returns filepath of .babelrc if options.outputDirectory is set', () => {
    const outputDirectory = '/foo/bar';
    const filepath = writeBabelrc({}, { outputDirectory });
    expect(filepath).toBe(path.join(outputDirectory, '.babelrc'));
  });

  test('relativizes absolute paths in .babelrc content', () => {
    createBabelConfig.mockReturnValue(createMockBabelConfig(process.cwd()));
    writeBabelrc();
    expect(fs.writeFileSync.mock.calls[0][1]).toMatchSnapshot();
  });

  test('relativizes absolute paths in .babelrc content if options.projectDirectory is set', () => {
    const projectDirectory = path.join(process.cwd(), 'eggs');
    createBabelConfig.mockReturnValue(createMockBabelConfig(projectDirectory));
    writeBabelrc({ projectDirectory });
    expect(fs.writeFileSync.mock.calls[0][1]).toMatchSnapshot();
  });

  test('relativizes absolute paths in .babelrc content if options.outputDirectory is set', () => {
    const outputDirectory = path.join(process.cwd(), 'eggs');
    createBabelConfig.mockReturnValue(createMockBabelConfig(outputDirectory));
    writeBabelrc({ outputDirectory });
    expect(fs.writeFileSync.mock.calls[0][1]).toMatchSnapshot();
  });
});
