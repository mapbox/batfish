'use strict';

const dateTime = require('date-time');
const chalk = require('chalk');

/**
 * Log something with a fancy timestamp in front of it.
 *
 * @param {string} message
 */
function timelog(message) {
  const dt = dateTime({ showTimeZone: true, local: false });
  const timestamp = `[${chalk.grey(dt)}]`;
  console.log(`${timestamp} ${message}`);
}

module.exports = timelog;
