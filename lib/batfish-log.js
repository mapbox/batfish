'use strict';

const chalk = require('chalk');
const timestamp = require('time-stamp');

function prelude() {
  return `[${chalk.grey(timestamp('HH:mm:ss'))} ${chalk.magenta('Batfish')}]`;
}

function loggableMessage(message) {
  return `${prelude()} ${message}`;
}

function log(message) {
  console.log(loggableMessage(message));
}

function error(message) {
  console.error(loggableMessage(message));
}

module.exports = {
  log,
  error
};
