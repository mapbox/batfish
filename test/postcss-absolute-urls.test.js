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
          stylesheetUrl: 'https://www.fake-place.com/path/to/style.css',
        })
      )
      .process(css, { from: undefined })
      .then((result) => {
        expect(result.css).toMatchSnapshot();
      });
  });
});
