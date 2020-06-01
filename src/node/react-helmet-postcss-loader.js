// @flow
'use strict';

const postcss = require('postcss');
const loaderUtils = require('loader-utils');
const rethrowPostcssError = require('./rethrow-postcss-error');

function generateModule(css: string): string {
  const js = `
    import React from 'react';
    import { Helmet } from 'react-helmet';

    const css = \`${css}\`;

    export default class HeadCss extends React.Component {
      shouldComponentUpdate() {
        return false;
      }
      render() {
        return (
          <Helmet defer={false}>
            <style>{css}</style>
          </Helmet>
        );
      }
    }
  `;
  return js.trim();
}

// Transform CSS into a simple JS module that writes the CSS to a <style>
// tag in the <head> of the document.
function reactHelmetPostcssLoader(css: string) {
  const callback = this.async();
  const options: {
    postcssPlugins?: Array<Function>
  } = loaderUtils.getOptions(this);

  postcss(options.postcssPlugins)
    .process(css, { from: undefined })
    .catch(rethrowPostcssError)
    .then((result) => {
      callback(null, generateModule(result.css));
    })
    .catch(callback);
}

module.exports = reactHelmetPostcssLoader;
