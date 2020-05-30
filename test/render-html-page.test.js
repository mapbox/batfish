'use strict';

const _ = require('lodash');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const renderHtmlPage = require('../src/webpack/render-html-page')
  .renderHtmlPage;

jest.mock('react-helmet', () => {
  const mockHelmetHead = {
    htmlAttributes: {
      toComponent: jest.fn(() => 'htmlAttributes.mockToComponent'),
    },
    bodyAttributes: {
      toComponent: jest.fn(() => 'bodyAttributes.mockToComponent'),
    },
    title: { toString: jest.fn(() => 'title.mockToString') },
    base: { toString: jest.fn(() => 'base.mockToString') },
    meta: { toString: jest.fn(() => 'meta.mockToString') },
    link: { toString: jest.fn(() => 'link.mockToString') },
    script: { toString: jest.fn(() => 'script.mockToString') },
    style: { toString: jest.fn(() => 'style.mockToString') },
  };

  return {
    Helmet: { renderStatic: jest.fn(() => mockHelmetHead) },
  };
});

jest.mock(
  'batfish-internal/application-wrapper',
  () => {
    const _ = require('lodash');
    const React = require('react');
    return function ApplicationWrapper(props) {
      return React.createElement(
        'div',
        { id: 'application-wrapper' },
        JSON.stringify(_.omit(props, ['children']), null, 2),
        props.children
      );
    };
  },
  { virtual: true }
);

jest.mock('../src/webpack/router', () => {
  const _ = require('lodash');
  const React = require('react');
  return {
    Router: function Router(props) {
      return React.createElement(
        'div',
        {
          id: 'router',
          'data-props': JSON.stringify(_.omit(props, ['children']), null, 2),
        },
        props.children
      );
    },
  };
});

jest.mock('../src/webpack/static-html-page', () => {
  const _ = require('lodash');
  const React = require('react');
  return {
    StaticHtmlPage: function StaticHtmlPage(props) {
      return React.createElement(
        'div',
        {
          id: 'static-html-page',
          'data-props': JSON.stringify(_.omit(props, ['children']), null, 2),
        },
        props.children
      );
    },
  };
});

describe('renderHtmlPage', () => {
  let mockRoute;
  let mockPageModule;

  beforeEach(() => {
    mockPageModule = {
      component: () => React.createElement('div', {}, 'Mock component'),
      props: 'mockPageModule.props',
    };
    mockRoute = {
      path: '/mock/route/path/',
      getPage: jest.fn(() => Promise.resolve(mockPageModule)),
    };
  });

  test('gives us what we want', () => {
    return renderHtmlPage({
      route: mockRoute,
      inlineJsScripts: 'inline-js-scripts',
      css: 'css',
      appendToBody: ['append', 'to', 'body'],
    }).then((html) => {
      expect(_.unescape(html)).toMatchSnapshot();
    });
  });

  test('registers errors from React.renderToString errors', () => {
    const expectedError = new Error();
    jest.spyOn(ReactDOMServer, 'renderToString').mockImplementation(() => {
      throw expectedError;
    });
    return renderHtmlPage({
      route: mockRoute,
      inlineJsScripts: 'inline-js-scripts',
      css: 'css',
      appendToBody: ['append', 'to', 'body'],
    }).then(
      () => {
        throw new Error('should have errored');
      },
      (error) => {
        expect(error).toBe(expectedError);
        ReactDOMServer.renderToString.mockRestore();
      }
    );
  });

  test('registers errors from React.renderToStaticMarkup errors', () => {
    const expectedError = new Error();
    jest
      .spyOn(ReactDOMServer, 'renderToStaticMarkup')
      .mockImplementation(() => {
        throw expectedError;
      });
    return renderHtmlPage({
      route: mockRoute,
      inlineJsScripts: 'inline-js-scripts',
      css: 'css',
      appendToBody: ['append', 'to', 'body'],
    }).then(
      () => {
        throw new Error('should have errored');
      },
      (error) => {
        expect(error).toBe(expectedError);
        ReactDOMServer.renderToStaticMarkup.mockRestore();
      }
    );
  });
  test('SPA mode', () => {
    return renderHtmlPage({
      route: mockRoute,
      inlineJsScripts: 'inline-js-scripts',
      css: 'css',
      appendToBody: ['append', 'to', 'body'],
      spa: true,
    }).then((html) => {
      expect(_.unescape(html)).toMatchSnapshot();
    });
  });
});
