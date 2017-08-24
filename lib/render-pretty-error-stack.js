'use strict';

const PrettyError = require('pretty-error');

const prettyError = new PrettyError();

function renderPrettyErrorStack(error) {
  return prettyError.render(error);
}

module.exports = renderPrettyErrorStack;
