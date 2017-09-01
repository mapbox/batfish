// @flow
'use strict';

const PrettyError = require('pretty-error');

const prettyError = new PrettyError();

function renderPrettyErrorStack(error: Error): string {
  return prettyError.render(error);
}

module.exports = renderPrettyErrorStack;
