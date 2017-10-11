'use strict';

global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0);
};
