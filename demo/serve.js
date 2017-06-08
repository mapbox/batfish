'use strict';

const path = require('path');
const batfish = require('..');

batfish.serveStatic({
  directory: path.join(__dirname, 'site')
});
