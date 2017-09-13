'use strict';

const cpy = require('cpy');
const copyNonPageFiles = require('../src/node/copy-non-page-files');

jest.mock('cpy', () => {
  return jest.fn(() => Promise.resolve());
});

describe('copyNonPageFiles', () => {
  test('copies files that are not .js, .md, or .css', () => {
    copyNonPageFiles({
      outputDirectory: 'mockOutputDirectory',
      pagesDirectory: 'mockPagesDirectory'
    }).then(() => {
      expect(cpy).toHaveBeenCalledTimes(1);
      expect(cpy).toHaveBeenCalledWith(
        ['**/*.!(js|md|css)'],
        'mockOutputDirectory',
        {
          cwd: 'mockPagesDirectory',
          parents: true
        }
      );
    });
  });

  test('copies files designated by unprocessedPageFiles option', () => {
    copyNonPageFiles({
      outputDirectory: 'mockOutputDirectory',
      pagesDirectory: 'mockPagesDirectory',
      unprocessedPageFiles: ['**/home.js', '**/horse.md']
    }).then(() => {
      expect(cpy).toHaveBeenCalledTimes(1);
      expect(cpy).toHaveBeenCalledWith(
        ['**/*.!(js|md|css)', '**/home.js', '**/horse.md'],
        'mockOutputDirectory',
        {
          cwd: 'mockPagesDirectory',
          parents: true
        }
      );
    });
  });
});
