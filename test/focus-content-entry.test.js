'use strict';

const focusContentEntry = require('../src/webpack/public/focus-content-entry')
  .focusContentEntry;

describe('focusContentEntry', () => {
  const focusMock = jest.fn();
  const setAttributeMock = jest.fn();
  const querySelectorMock = jest.fn();

  beforeEach(() => {
    global.document = {
      querySelector: querySelectorMock.mockReturnValue({
        focus: focusMock,
        setAttribute: setAttributeMock
      })
    };
  });

  afterEach(() => {
    delete global.document;
  });

  test('focuses on the returned element', () => {
    focusContentEntry();
    expect(querySelectorMock).toHaveBeenCalledTimes(1);
    expect(focusMock).toHaveBeenCalledTimes(1);
    expect(setAttributeMock).toHaveBeenCalledWith('tabindex', '-1');
  });

  test('does not focus when no elements match selector', () => {
    querySelectorMock.mockReturnValue(null);
    focusContentEntry();
    expect(querySelectorMock).toHaveBeenCalledTimes(1);
    expect(focusMock).not.toHaveBeenCalled();
    expect(setAttributeMock).not.toHaveBeenCalled();
  });
});
