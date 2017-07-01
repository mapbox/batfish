'use strict';

module.exports = {
  plugins: [
    require('remark-lint-no-duplicate-definitions'),
    require('remark-lint-no-undefined-references'),
    require('remark-lint-no-unused-definitions'),
    require('remark-lint-final-definition'),
    require('remark-lint-first-heading-level'),
    require('remark-lint-heading-increment'),
    require('remark-lint-no-duplicate-headings'),
    require('remark-lint-no-empty-url'),
    require('remark-lint-no-inline-padding'),
    require('remark-lint-no-multiple-toplevel-headings'),
    [require('remark-lint-code-block-style'), 'fenced'],
    [require('remark-lint-heading-style'), 'atx']
  ]
};
