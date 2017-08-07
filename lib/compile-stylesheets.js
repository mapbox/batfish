'use strict';

const got = require('got');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const pify = require('pify');
const globby = require('globby');
const postcss = require('postcss');
const postcssUrl = require('postcss-url');
const mkdirp = require('mkdirp');
const csso = require('csso');
const hasha = require('hasha');
const Concat = require('concat-with-sourcemaps');
const SourceMapConsumer = require('source-map').SourceMapConsumer;
const constants = require('./constants');
const postcssAbsoluteUrls = require('./postcss-absolute-urls');

const urlCache = new Map();

// Special logging for PostCSS errors. Makes them very easy to understand.
function handlePostcssError(error) {
  if (error.name === 'CssSyntaxError') {
    console.log(error.message);
    console.log(error.showSourceCode());
  } else {
    throw error;
  }
}

/**
 * Fetch and concatenate stylesheets, with source maps.
 *
 * @param {BatfishConfig} batfishConfig
 * @param {string} [cssOutputDirectory] - Defaults to batfishConfig.outputDirectory.
 * @return {Promise<string>} - Resolves with the absolute path to the written file.
 */
function compileStylesheets(batfishConfig, cssOutputDirectory) {
  if (_.isEmpty(batfishConfig.stylesheets)) return Promise.resolve();
  cssOutputDirectory = cssOutputDirectory || batfishConfig.outputDirectory;
  const cssTarget = path.join(cssOutputDirectory, 'batfish-styles.css');

  // Ensure the stylesheets are concatenated in the order specified.
  // Each item will be an object with locator, css, and map properties.
  // After all are accumulated, we'll concatenate them together in that order.
  const stylesheetContents = [];

  // Get a CSS from a URL and insert it into stylesheetContents
  // at the specified index.
  const getStylesheetFromUrl = (url, index) => {
    const cached = urlCache.get(url);
    if (cached) {
      stylesheetContents[index] = cached;
      return Promise.resolve();
    }

    return got(url)
      .then(response => {
        return (
          postcss()
            // Make all the URLs in the stylesheet absolute so the new local
            // stylesheet can fetch assets like fonts and images.
            .use(postcssAbsoluteUrls({ stylesheetUrl: url }))
            .process(response.body, { from: url, to: cssTarget })
            .catch(handlePostcssError)
        );
      })
      .then(result => {
        const contentsItem = { locator: url, css: result.css };
        urlCache.set(url, contentsItem);
        stylesheetContents[index] = contentsItem;
      });
  };

  const postcssPlugins = [
    postcssUrl({
      url: 'copy',
      assetsPath: './',
      useHash: true
    })
  ].concat(batfishConfig.postcssPlugins);

  const processSingleStylesheetFromFs = filename => {
    return pify(fs.readFile)(filename, 'utf8').then(css => {
      return postcss(postcssPlugins)
        .process(css, {
          from: filename,
          to: cssTarget,
          map: {
            inline: false,
            sourcesContent: true,
            annotation: false
          }
        })
        .then(result => {
          return {
            locator: filename,
            css: result.css,
            map: result.map.toString()
          };
        })
        .catch(handlePostcssError);
    });
  };

  // input could be a filename or a glob or an array of those.
  // Get the CSS from each file and insert it into stylesheetContents
  // at the specified index. If input is array, that item in stylesheetContents
  // will be an array.
  const getStylesheetFromFs = (input, index) => {
    return globby(input, { absolute: true })
      .then(filenames => {
        return Promise.all(filenames.map(processSingleStylesheetFromFs));
      })
      .then(contents => {
        stylesheetContents[index] = contents;
      });
  };

  // Runs after stylesheetContents has been populated. Concatenates the CSS
  // in that order, with source maps. Outputs new CSS and and a new source map.
  const concatStylesheetContents = () => {
    const concatenator = new Concat(
      true,
      path.join(cssOutputDirectory, constants.BATFISH_CSS_BASENAME, '\n')
    );
    // Since items in stylesheets can be an array, we need to be recursive here.
    const addItems = list => {
      list.forEach(item => {
        if (Array.isArray(item)) return addItems(item);
        concatenator.add(item.locator, item.css, item.map);
      });
    };
    addItems(stylesheetContents);
    return {
      css: concatenator.content,
      map: concatenator.sourceMap
    };
  };

  return Promise.all(
    batfishConfig.stylesheets.map((locator, index) => {
      if (/^http/.test(locator)) {
        return getStylesheetFromUrl(locator, index);
      }
      return getStylesheetFromFs(locator, index);
    })
  )
    .then(() => pify(mkdirp)(cssOutputDirectory))
    .then(() => {
      const concatenated = concatStylesheetContents();

      let finalCss = concatenated.css;
      let finalMap = concatenated.map;

      // Minify for production. csso's source map integration is awkward but
      // seems to work ok.
      if (batfishConfig.production) {
        const cssoOutput = csso.minify(finalCss, {
          filename: cssTarget,
          sourceMap: true
        });
        finalCss = cssoOutput.css;
        cssoOutput.map.applySourceMap(
          new SourceMapConsumer(finalMap),
          cssTarget
        );
        finalMap = cssoOutput.map.toString();
      }

      // Add a md5 hash to the filename for production.
      let basename = constants.BATFISH_CSS_BASENAME;
      if (batfishConfig.production) {
        const hash = hasha(finalCss, { algorithm: 'md5' });
        basename = basename.replace(/\.css$/, `-${hash}.css`);
      }

      const finalCssWithSourcemapAnnotation = `${finalCss}/*# sourceMappingURL=${basename}.map */`;
      const cssFilePath = path.join(cssOutputDirectory, basename);
      const mapFilePath = `${cssFilePath}.map`;
      return Promise.all([
        pify(fs.writeFile)(cssFilePath, finalCssWithSourcemapAnnotation),
        pify(fs.writeFile)(mapFilePath, finalMap)
      ]).then(() => cssFilePath);
    });
}

module.exports = compileStylesheets;
