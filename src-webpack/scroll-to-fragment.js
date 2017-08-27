// @flow

// Check the current location for a hash, and if there is one try to scroll to it.
export function scrollToFragment() {
  const fragment = window.location.hash;
  if (!fragment) return;
  const element = document.getElementById(fragment.replace('#', ''));
  if (element) {
    element.scrollIntoView();
  }
}
