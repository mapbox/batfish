'use strict';

// Special logging for PostCSS errors. Makes them very easy to understand.
function handlePostcssError(error) {
  if (error.name === 'CssSyntaxError') {
    console.log(error.message);
    console.log(error.showSourceCode());
  } else {
    throw error;
  }
}

module.exports = handlePostcssError;
