// @flow
'use strict';

const prettyMs = require('pretty-ms');
const now = require('./now');

module.exports = function appendTaskTime(
  message: string,
  startTime?: number,
  endTime?: number
): string {
  if (startTime === undefined) {
    return message;
  }
  endTime = endTime !== undefined ? endTime : now();
  return `${message} in ${prettyMs(endTime - startTime)}`;
};
