'use strict';

const batfish = require('..');
const batfishConfig = require('./batfish-config');

require('loud-rejection')();

batfish.start(batfishConfig);
