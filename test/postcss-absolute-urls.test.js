'use strict';

const postcss = require('postcss');
const postcssAbsoluteUrls = require('../src/node/postcss-absolute-urls');

describe('postcssAbsoluteUrls', () => {
  test('works', () => {
    const css = `
      @font-face {
        font-family: "Open Sans";
        src: url("../fonts/OpenSans-Regular-webfont.woff2") format("woff2"),
              url("/fonts/OpenSans-Regular-webfont.woff") format("woff");
      }
      body {
        background: url('data:blergh');
      }
    `;

    return postcss()
      .use(
        postcssAbsoluteUrls({
          stylesheetUrl: 'https://www.fake-place.com/path/to/style.css'
        })
      )
      .process(css, { from: undefined })
      .then((result) => {
        expect(result.css).toMatchSnapshot();
      });
  });

  test('do not add absolute url to `mask`', () => {
    const css = `
    a.mapboxgl-ctrl-logo {
      width: 88px;
      height: 23px;
      margin: 0 0 -4px -4px;
      display: block;
      background-repeat: no-repeat;
      cursor: pointer;
      overflow: hidden;
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg mask='url(%23clip)'");
    }    
    `;

    return postcss()
      .use(
        postcssAbsoluteUrls({
          stylesheetUrl: '/playground/assets/'
        })
      )
      .process(css, { from: undefined })
      .then((result) => {
        expect(result.css).toMatchSnapshot();
      });
  });
});
