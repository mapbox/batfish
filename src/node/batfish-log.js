/* eslint-disable no-console */
// @flow
'use strict';

const chalk = require('chalk');
const timestamp = require('time-stamp');

function prelude() {
  return `[${chalk.grey(timestamp('HH:mm:ss'))} ${chalk.magenta('Batfish')}]`;
}

function loggableMessage(message: string) {
  return `${prelude()} ${message}`;
}

function log(message: string) {
  console.log(loggableMessage(message));
}

function error(message: string) {
  console.error(loggableMessage(message));
}

module.exports = {
  log,
  error,
};
