'use strict';

const xtend = require('xtend');

let removeListenerFunctions;

function end() {
  removeListenerFunctions.forEach(fn => fn());
}

function captureScroll() {
  // Is this enough? Or do we need debounce?
  window.requestAnimationFrame(() => {
    const x = window.pageXOffset;
    const y = window.pageYOffset;
    const historyState = window.history.state;
    const savedX = historyState && historyState.scroll && historyState.scroll.x;
    const savedY = historyState && historyState.scroll && historyState.scroll.y;
    if (savedX !== x || savedY !== y) {
      const nextHistoryState = xtend(historyState, {
        scroll: { x, y }
      });
      window.history.replaceState(nextHistoryState, null, window.location);
    }
  });
}

function getSavedScroll(input) {
  input = input || window.history;
  if (!input || !input.state) return;
  return input.state.scroll;
}

function restoreScroll(input, attemptsRemaining = 5) {
  const savedScroll = getSavedScroll(input);
  if (!savedScroll) return;
  window.requestAnimationFrame(() => {
    const savedX = savedScroll.x;
    const savedY = savedScroll.y;
    if (attemptsRemaining === 0) return;
    const { pageXOffset, pageYOffset } = window;
    if (
      savedY < window.document.body.scrollHeight &&
      (savedX !== pageXOffset || savedY !== pageYOffset)
    ) {
      window.scrollTo(savedX, savedY);
    } else {
      restoreScroll(input, attemptsRemaining - 1);
    }
  });
}

function start(options) {
  options = options || {};

  // cf. https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }

  // Scroll positions are saved into the history entry's state; then when that
  // the history changes (the popstate event), we try restoring any saved
  // scroll position.

  window.addEventListener('scroll', captureScroll, { passive: true });
  if (options.autoRestore) {
    window.addEventListener('popstate', restoreScroll);
  }

  removeListenerFunctions = [
    () =>
      window.removeEventListener('scroll', captureScroll, {
        passive: true
      })
  ];
  if (options.autoRestore) {
    removeListenerFunctions.push(() =>
      window.removeEventListener('popstate', restoreScroll)
    );
  }
}

module.exports = {
  start,
  end,
  restoreScroll,
  getSavedScroll
};
