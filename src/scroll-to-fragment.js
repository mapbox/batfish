'use strict';

function scrollToFragment() {
  const fragment = window.location.hash;
  if (!fragment) return;
  const element = document.getElementById(fragment.replace('#', ''));
  if (element) {
    element.scrollIntoView();
  }
}

module.exports = scrollToFragment;
