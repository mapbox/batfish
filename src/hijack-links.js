'use strict';

// Inspired by
// https://github.com/visionmedia/page.js/blob/1034c8cbed600ea7da378a73716c885227c03270/index.js#L541-L601
// https://github.com/yoshuawuyts/nanohref/blob/4efcc2c0becd2822a31c912364997cf03c66ab8d/index.js
// https://github.com/whir-tools/hijack-links

function getClosestLink(node, root) {
  const checkParent = () => getClosestLink(node.parentNode, root);
  if (!node || node === root) return;
  if ('a' !== node.nodeName.toLowerCase()) return checkParent();
  if (node.href === undefined) return checkParent();
  return node;
}

function setDefault(x, dflt) {
  return x === undefined ? dflt : x;
}

/**
 * Hijack clicks on links.
 *
 * @param {Object} [options]
 * @param {Element} [options.root=document.documentElement] - Only hijack links that are children of this element.
 * @param {boolean} [options.skipModifierKeys=true] - Don't hijack the link if a modifier keys are pressed.
 * @param {boolean} [options.skipDownload=true] - Don't hijack the link if it has the `download` attribute.
 * @param {boolean} [options.skipExternal=true] - Don't hijack the link if it has `rel="external"`.
 * @param {boolean} [options.skipMailTo=true] - Don't hijack the link if it's a `mailto:` link.
 * @param {boolean} [options.skipOtherHost=true] - Don't hijack the link if it's to another host.
 * @param {Function} callback - Invoked whenever a qualifying link is clicked. Pssed two arguments:
 *   the link Element that was clicked, and the Event.
 * @return {Function} - A function that removes the event listener, ending the hijacking.
 */
function hijackLinks(options, callback) {
  if (typeof options === 'function') {
    callback = options;
  }
  const root = options.root || document.documentElement;
  const skipModifierKeys = setDefault(options.skipModifierKeys, true);
  const skipDownload = setDefault(options.skipDownload, true);
  const skipExternal = setDefault(options.skipExternal, true);
  const skipMailTo = setDefault(options.skipMailTo, true);
  const skipOtherHost = setDefault(options.skipOtherHost, true);

  const onClick = event => {
    if (event.defaultPrevented) return;
    if (event.button && event.button !== 0) return;

    const modifierKeyPressed =
      event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;
    if (skipModifierKeys && modifierKeyPressed) return;

    const link = getClosestLink(event.target, root);
    if (!link) return;

    if (skipDownload && link.hasAttribute('download')) return;
    if (skipExternal && link.getAttribute('rel') === 'external') return;
    if (skipMailTo && /mailto:/.test(link.getAttribute('href'))) return;
    if (skipOtherHost && window.location.host !== link.host) return;

    event.preventDefault();
    callback(link, event);
  };

  root.addEventListener('click', onClick);
  return () => root.removeEventListener('click', onClick);
}

module.exports = hijackLinks;
