// @flow
'use strict';

function wrapError(
  error: Error,
  WrapperErrorType: Class<WrappedError>,
  additionalProperties?: Object
): WrappedError {
  const typedError = new WrapperErrorType(error.message);
  typedError.originalError = error;
  Object.assign(typedError, additionalProperties);
  return typedError;
}

module.exports = wrapError;
