/* eslint-disable */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import IndexPage from '../pages/index';

describe('IndexPage', () => {
  test('is correctly transformed', () => {
    const rendered = ReactDOMServer.renderToStaticMarkup(<IndexPage />);
    expect(rendered).toMatch(/0 === 0/);
  });
});
