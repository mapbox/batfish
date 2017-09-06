// @flow

const contentEntryElement = document.createElement('div');
contentEntryElement.setAttribute(
  'style',
  `border: 0; clip: rect(0 0 0 0); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; white-space: nowrap;`
);
contentEntryElement.setAttribute('tabindex', '-1');

function prependContentEntryElement() {
  if (!document.body.contains(contentEntryElement)) {
    const firstBodyChild = document.body.firstChild;

    if (firstBodyChild) {
      document.body.insertBefore(contentEntryElement, firstBodyChild);
    } else {
      document.body.appendChild(contentEntryElement);
    }
  }
}

function updateContentEntryElementText() {
  const titleElement = document.querySelector('title');

  if (titleElement) {
    contentEntryElement.textContent = titleElement.textContent;
  } else {
    contentEntryElement.textContent = '';
  }
}

function focusContentEntry() {
  // We requestAnimationFrame in case the browser is busy with another task.
  // We also use a 100ms timeout because it takes a while for React to render the component tree.
  requestAnimationFrame(() => {
    setTimeout(() => {
      updateContentEntryElementText();
      prependContentEntryElement();
      contentEntryElement.focus();
    }, 100);
  });
}

export { focusContentEntry };
