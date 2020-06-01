'use strict';

const RouteChangeListeners = require('../src/webpack/public/route-change-listeners');

// This mock indirectly supports route-change-listeners by
// supporting prefix-url.
jest.mock(
  'batfish-internal/context',
  () => {
    return {
      batfishContext: {
        selectedConfig: {
          siteBasePath: '',
          siteOrigin: ''
        }
      }
    };
  },
  { virtual: true }
);

describe('start change listeners', () => {
  test('no listeners', () => {
    expect(() =>
      RouteChangeListeners._invokeRouteChangeStartCallbacks('/foo/bar')
    ).not.toThrow();
  });

  test('all paths, one listener', () => {
    const listener = jest.fn();
    RouteChangeListeners.addRouteChangeStartListener(listener);
    return RouteChangeListeners._invokeRouteChangeStartCallbacks(
      '/foo/bar'
    ).then(() => {
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith('/foo/bar');
    });
  });

  test('all paths, two listeners', () => {
    const listenerA = jest.fn();
    const listenerB = jest.fn();
    RouteChangeListeners.addRouteChangeStartListener(listenerA);
    return RouteChangeListeners._invokeRouteChangeStartCallbacks('/foo/bar')
      .then(() => {
        expect(listenerA).toHaveBeenCalledTimes(1);
        expect(listenerA).toHaveBeenCalledWith('/foo/bar');

        RouteChangeListeners.addRouteChangeStartListener(listenerB);
        return RouteChangeListeners._invokeRouteChangeStartCallbacks(
          '/foo/bar/baz'
        );
      })
      .then(() => {
        expect(listenerA).toHaveBeenCalledTimes(2);
        expect(listenerA).toHaveBeenCalledWith('/foo/bar/baz');
        expect(listenerB).toHaveBeenCalledTimes(1);
        expect(listenerB).toHaveBeenCalledWith('/foo/bar/baz');
      });
  });

  test('all paths, remove listener', () => {
    const listenerA = jest.fn();
    const listenerB = jest.fn();
    RouteChangeListeners.addRouteChangeStartListener(listenerA);
    RouteChangeListeners.addRouteChangeStartListener(listenerB);
    RouteChangeListeners.removeRouteChangeStartListener(listenerA);
    return RouteChangeListeners._invokeRouteChangeStartCallbacks(
      '/foo/bar'
    ).then(() => {
      expect(listenerA).toHaveBeenCalledTimes(0);
      expect(listenerB).toHaveBeenCalledTimes(1);
      expect(listenerB).toHaveBeenCalledWith('/foo/bar');
    });
  });

  test('all paths, remove all listeners', () => {
    const listenerA = jest.fn();
    const listenerB = jest.fn();
    RouteChangeListeners.addRouteChangeStartListener(listenerA);
    RouteChangeListeners.addRouteChangeStartListener(listenerB);
    RouteChangeListeners.removeRouteChangeStartListener();
    return RouteChangeListeners._invokeRouteChangeStartCallbacks(
      '/foo/bar'
    ).then(() => {
      expect(listenerA).toHaveBeenCalledTimes(0);
      expect(listenerB).toHaveBeenCalledTimes(0);
    });
  });

  test('specific path, one listener', () => {
    const listener = jest.fn();
    RouteChangeListeners.addRouteChangeStartListener('/foo/bar', listener);
    return RouteChangeListeners._invokeRouteChangeStartCallbacks('/foo/bar')
      .then(() => {
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith('/foo/bar');
        return RouteChangeListeners._invokeRouteChangeStartCallbacks(
          '/foo/bar/baz'
        );
      })
      .then(() => {
        expect(listener).toHaveBeenCalledTimes(1);
      });
  });

  test('specific path, remove listener', () => {
    const listenerA = jest.fn();
    const listenerB = jest.fn();
    RouteChangeListeners.addRouteChangeStartListener('/foo/bar', listenerA);
    RouteChangeListeners.addRouteChangeStartListener('/foo/bar', listenerB);
    RouteChangeListeners.removeRouteChangeStartListener('/foo/bar', listenerA);
    return RouteChangeListeners._invokeRouteChangeStartCallbacks(
      '/foo/bar'
    ).then(() => {
      expect(listenerA).toHaveBeenCalledTimes(0);
      expect(listenerB).toHaveBeenCalledTimes(1);
      expect(listenerB).toHaveBeenCalledWith('/foo/bar');
    });
  });

  test('specific path, normalized end slash', () => {
    const listenerA = jest.fn();
    const listenerB = jest.fn();
    RouteChangeListeners.addRouteChangeStartListener('/foo/bar/', listenerA);
    RouteChangeListeners.addRouteChangeStartListener('/foo/bar', listenerB);
    return RouteChangeListeners._invokeRouteChangeStartCallbacks('/foo/bar')
      .then(() => {
        expect(listenerA).toHaveBeenCalledTimes(1);
        expect(listenerA).toHaveBeenCalledWith('/foo/bar');
        expect(listenerB).toHaveBeenCalledTimes(1);
        expect(listenerB).toHaveBeenCalledWith('/foo/bar');
        return RouteChangeListeners._invokeRouteChangeStartCallbacks(
          '/foo/bar/'
        );
      })
      .then(() => {
        expect(listenerA).toHaveBeenCalledTimes(2);
        expect(listenerA).toHaveBeenCalledWith('/foo/bar');
        expect(listenerB).toHaveBeenCalledTimes(2);
        expect(listenerB).toHaveBeenCalledWith('/foo/bar');
      });
  });

  test('specific path and all paths together', () => {
    const listenerA = jest.fn();
    const listenerB = jest.fn();
    RouteChangeListeners.addRouteChangeStartListener('/foo/bar', listenerA);
    RouteChangeListeners.addRouteChangeStartListener(listenerB);
    return RouteChangeListeners._invokeRouteChangeStartCallbacks('/foo/bar')
      .then(() => {
        expect(listenerA).toHaveBeenCalledTimes(1);
        expect(listenerA).toHaveBeenCalledWith('/foo/bar');
        expect(listenerB).toHaveBeenCalledTimes(1);
        expect(listenerB).toHaveBeenCalledWith('/foo/bar');
        return RouteChangeListeners._invokeRouteChangeStartCallbacks(
          '/foo/bar/baz'
        );
      })
      .then(() => {
        expect(listenerA).toHaveBeenCalledTimes(1);
        expect(listenerB).toHaveBeenCalledTimes(2);
        expect(listenerB).toHaveBeenCalledWith('/foo/bar/baz');
      });
  });
});

describe('end change listeners', () => {
  test('no listeners', () => {
    expect(() =>
      RouteChangeListeners._invokeRouteChangeStartCallbacks('/foo/bar')
    ).not.toThrow();
    return RouteChangeListeners._invokeRouteChangeStartCallbacks('/foo/bar');
  });

  test('all paths, one listener', () => {
    const listener = jest.fn();
    RouteChangeListeners.addRouteChangeEndListener(listener);
    const result = RouteChangeListeners._invokeRouteChangeEndCallbacks(
      '/foo/bar'
    );
    expect(result instanceof Promise).toBe(true);
    return result.then(() => {
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith('/foo/bar');
    });
  });

  test('all paths, two listeners, one returning a Promise', () => {
    const listenerA = jest.fn();
    const listenerB = jest.fn(() => Promise.resolve());

    RouteChangeListeners.addRouteChangeEndListener(listenerA);
    return RouteChangeListeners._invokeRouteChangeEndCallbacks('/foo/bar')
      .then(() => {
        expect(listenerA).toHaveBeenCalledTimes(1);
        expect(listenerA).toHaveBeenCalledWith('/foo/bar');
        RouteChangeListeners.addRouteChangeEndListener(listenerB);
        return RouteChangeListeners._invokeRouteChangeEndCallbacks(
          '/foo/bar/baz'
        );
      })
      .then(() => {
        expect(listenerA).toHaveBeenCalledTimes(2);
        expect(listenerA).toHaveBeenCalledWith('/foo/bar/baz');
        expect(listenerB).toHaveBeenCalledTimes(1);
        expect(listenerB).toHaveBeenCalledWith('/foo/bar/baz');
      });
  });

  test('all paths, remove listener', () => {
    const listenerA = jest.fn();
    const listenerB = jest.fn(() => Promise.resolve());
    RouteChangeListeners.addRouteChangeEndListener(listenerA);
    RouteChangeListeners.addRouteChangeEndListener(listenerB);
    RouteChangeListeners.removeRouteChangeEndListener(listenerA);
    return RouteChangeListeners._invokeRouteChangeEndCallbacks('/foo/bar').then(
      () => {
        expect(listenerA).toHaveBeenCalledTimes(0);
        expect(listenerB).toHaveBeenCalledTimes(1);
        expect(listenerB).toHaveBeenCalledWith('/foo/bar');
      }
    );
  });

  test('all paths, remove all listeners', () => {
    const listenerA = jest.fn();
    const listenerB = jest.fn(() => Promise.resolve());
    RouteChangeListeners.addRouteChangeEndListener(listenerA);
    RouteChangeListeners.addRouteChangeEndListener(listenerB);
    RouteChangeListeners.removeRouteChangeEndListener();
    return RouteChangeListeners._invokeRouteChangeEndCallbacks('/foo/bar').then(
      () => {
        expect(listenerA).toHaveBeenCalledTimes(0);
        expect(listenerB).toHaveBeenCalledTimes(0);
      }
    );
  });

  test('specific path, one listener', () => {
    const listener = jest.fn();
    RouteChangeListeners.addRouteChangeEndListener('/foo/bar', listener);
    return RouteChangeListeners._invokeRouteChangeEndCallbacks('/foo/bar')
      .then(() => {
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith('/foo/bar');
        return RouteChangeListeners._invokeRouteChangeEndCallbacks(
          '/foo/bar/baz'
        );
      })
      .then(() => {
        expect(listener).toHaveBeenCalledTimes(1);
      });
  });

  test('specific path, remove listener', () => {
    const listenerA = jest.fn();
    const listenerB = jest.fn(() => Promise.resolve());
    RouteChangeListeners.addRouteChangeEndListener('/foo/bar', listenerA);
    RouteChangeListeners.addRouteChangeEndListener('/foo/bar', listenerB);
    RouteChangeListeners.removeRouteChangeEndListener('/foo/bar', listenerA);
    return RouteChangeListeners._invokeRouteChangeEndCallbacks('/foo/bar').then(
      () => {
        expect(listenerA).toHaveBeenCalledTimes(0);
        expect(listenerB).toHaveBeenCalledTimes(1);
        expect(listenerB).toHaveBeenCalledWith('/foo/bar');
      }
    );
  });

  test('specific path, normalized end slash', () => {
    const listenerA = jest.fn();
    const listenerB = jest.fn(() => Promise.resolve());
    RouteChangeListeners.addRouteChangeEndListener('/foo/bar/', listenerA);
    RouteChangeListeners.addRouteChangeEndListener('/foo/bar', listenerB);
    return RouteChangeListeners._invokeRouteChangeEndCallbacks('/foo/bar')
      .then(() => {
        expect(listenerA).toHaveBeenCalledTimes(1);
        expect(listenerA).toHaveBeenCalledWith('/foo/bar');
        expect(listenerB).toHaveBeenCalledTimes(1);
        expect(listenerB).toHaveBeenCalledWith('/foo/bar');
        return RouteChangeListeners._invokeRouteChangeEndCallbacks('/foo/bar/');
      })
      .then(() => {
        expect(listenerA).toHaveBeenCalledTimes(2);
        expect(listenerA).toHaveBeenCalledWith('/foo/bar');
        expect(listenerB).toHaveBeenCalledTimes(2);
        expect(listenerB).toHaveBeenCalledWith('/foo/bar');
      });
  });

  test('specific path and all paths together', () => {
    const listenerA = jest.fn();
    const listenerB = jest.fn(() => Promise.resolve());
    RouteChangeListeners.addRouteChangeEndListener('/foo/bar', listenerA);
    RouteChangeListeners.addRouteChangeEndListener(listenerB);
    return RouteChangeListeners._invokeRouteChangeEndCallbacks('/foo/bar')
      .then(() => {
        expect(listenerA).toHaveBeenCalledTimes(1);
        expect(listenerA).toHaveBeenCalledWith('/foo/bar');
        expect(listenerB).toHaveBeenCalledTimes(1);
        expect(listenerB).toHaveBeenCalledWith('/foo/bar');
        return RouteChangeListeners._invokeRouteChangeEndCallbacks(
          '/foo/bar/baz'
        );
      })
      .then(() => {
        expect(listenerA).toHaveBeenCalledTimes(1);
        expect(listenerB).toHaveBeenCalledTimes(2);
        expect(listenerB).toHaveBeenCalledWith('/foo/bar/baz');
      });
  });
});
