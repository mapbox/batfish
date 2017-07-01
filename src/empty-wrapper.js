'use strict';

/**
 * When the user's config does not provide wrapperPath, we use this.
 */
function EmptyWrapper(props) {
  return props.children;
}

module.exports = EmptyWrapper;
