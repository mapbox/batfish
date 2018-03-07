#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const stripAnsi = require('strip-ansi');
const execSync = require('child_process').execSync;

// Read the output of batfish --help and write it to a doc.

const output = execSync(
  `${path.join(__dirname, 'batfish.js')} --help`
).toString();

const tidyOutput = stripAnsi(
  output.replace(/\n[ ]{2}/g, '\n').replace(/(^\r?\n+|\r?\n+$)/g, '')
);

const docs = `# The Batfish CLI

The following is output by \`batfish --help\`:

\`\`\`
${tidyOutput}
\`\`\`
`;

fs.writeFileSync(path.join(__dirname, '../docs/cli.md'), docs);
