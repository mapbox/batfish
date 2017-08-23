'use strict';

// Special logging for PostCSS errors. Makes them very easy to understand.
function enhancePostcssError(error) {
  if (error.name === 'CssSyntaxError') {
    error.message = error.message + '\n' + error.showSourceCode();
  }
  return error;
}

module.exports = enhancePostcssError;
