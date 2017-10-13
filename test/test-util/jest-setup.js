'use strict';

require('./raf');
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter() });

// This module makes it harder to mock things for tests — so mock *it*!
jest.mock('path-type', () => {
  return {
    dirSync: jest.fn(() => true),
    fileSync: jest.fn(() => true)
  };
});
