// @flow

function focusContentEntry() {
  const contentEntry = document.querySelector('h1, h2, h3, h4, h5, h6, main');

  if (contentEntry) {
    contentEntry.setAttribute('tabindex', '-1');
    contentEntry.focus();
  }
}

export { focusContentEntry };
