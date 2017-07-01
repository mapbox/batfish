'use strict';

const path = require('path');
const execa = require('execa');
const pkg = require('../package.json');

const input = process.argv.slice(2);

const repo = pkg.repository.url.match(/github\.com\/([^/]+\/.*?)\.git/)[1];

execa(
  'remark',
  [
    '--frail',
    '--quiet',
    '--use',
    `validate-links=repository:"${repo}"`,
    '--rc-path',
    path.join(__dirname, './mapbox-remark-lint-preset.js')
  ].concat(input)
)
  .then(data => {
    if (data.stderr) {
      console.log(data.stderr);
    }
  })
  .catch(data => {
    console.log(data.stderr);
    process.exitCode = data.code;
  });
