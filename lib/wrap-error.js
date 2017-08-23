'use strict';

function wrapError(error, WrapperErrorType, additionalProperties) {
  const typedError = new WrapperErrorType(error.message);
  typedError.originalError = error;
  Object.assign(typedError, additionalProperties);
  return typedError;
}

module.exports = wrapError;
