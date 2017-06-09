'use strict';

// Inspired by
// https://github.com/yoshuawuyts/nanohref/blob/4efcc2c0becd2822a31c912364997cf03c66ab8d/index.js
// https://github.com/visionmedia/page.js/blob/1034c8cbed600ea7da378a73716c885227c03270/index.js#L541-L601

function getClosestLink(node, root) {
  const checkParent = () => getClosestLink(node.parentNode, root);
  if (!node || node === root) return;
  if ('a' !== node.nodeName.toLowerCase()) return checkParent();
  if (node.href === undefined) return checkParent();
  return node;
}

/**
 * Hijack clicks on links.
 *
 * @param {Object} [options]
 * @param {Element} [options.root=document.documentElement] - Only hijack links that are children of this element.
 * @param {Function} callback - Invoked whenever a qualifying link is clicked. Pssed two arguments:
 *   the link Element that was clicked, and the Event.
 */
function hijackLinks(options, callback) {
  if (typeof options === 'function') {
    callback = options;
  }
  const root = options.root || document.documentElement;

  window.addEventListener('click', event => {
    if (
      (event.button && event.button !== 0) ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      event.shiftKey ||
      event.defaultPrevented
    ) {
      return;
    }

    const link = getClosestLink(event.target, root);
    if (!link) return;
    if (
      link.hasAttribute('download') ||
      link.getAttribute('rel') === 'external'
    )
      return;
    if (/mailto:/.test(link.getAttribute('href'))) return;
    if (window.location.host !== link.host) return;

    event.preventDefault();
    callback(link, event);
  });
}

module.exports = hijackLinks;
