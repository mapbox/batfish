// @flow
'use strict';

const got = require('got');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const _ = require('lodash');
const pify = require('pify');
const globby = require('globby');
const postcss = require('postcss');
const isAbsoluteUrl = require('is-absolute-url');
const mkdirp = require('mkdirp');
const pTry = require('p-try');
const hasha = require('hasha');
const Concat = require('concat-with-sourcemaps');
const constants = require('./constants');
const postcssAbsoluteUrls = require('./postcss-absolute-urls');
const rethrowPostcssError = require('./rethrow-postcss-error');
const errorTypes = require('./error-types');
const getPostcssPlugins = require('./get-postcss-plugins');

type StylesheetData = {|
  locator: string,
  css: string,
  map?: string
|};

const urlCache: Map<string, StylesheetData> = new Map();

// Fetch and concatenate stylesheets, with source maps.
// Return Promise resolves with the absolute path to the written file.
function compileStylesheets(
  batfishConfig: BatfishConfiguration,
  // Defaults to batfishConfig.outputDirectory.
  specialCssOutputDirectory?: string
): Promise<string | void> {
  const cssOutputDirectory: string =
    specialCssOutputDirectory || batfishConfig.outputDirectory;

  return pTry(() => {
    if (_.isEmpty(batfishConfig.stylesheets)) return;
    const cssTarget = path.join(cssOutputDirectory, 'batfish-styles.css');

    // Ensure the stylesheets are concatenated in the order specified.
    // Each item will be an object with locator, css, and map properties.
    // After all are accumulated, we'll concatenate them together in that order.
    const stylesheetContents = [];

    // Get a CSS from a URL and insert it into stylesheetContents
    // at the specified index.
    const getStylesheetFromUrl = (
      url: string,
      index: number
    ): Promise<void> => {
      const cached = urlCache.get(url);
      if (cached) {
        stylesheetContents[index] = cached;
        return Promise.resolve();
      }

      return got(url)
        .catch(() => {
          throw new errorTypes.ConfigValidationError(
            `Stylesheet at ${chalk.yellow(url)} could not be downloaded.`
          );
        })
        .then((response: { body: string }) => {
          return (
            postcss()
              // Make all the URLs in the stylesheet absolute so the new local
              // stylesheet can fetch assets like fonts and images.
              .use(postcssAbsoluteUrls({ stylesheetUrl: url }))
              .process(response.body, { from: url, to: cssTarget })
              .catch(rethrowPostcssError)
          );
        })
        .then((result: { css: string }) => {
          const contentsItem = {
            locator: url,
            css: result.css,
            map: undefined
          };
          urlCache.set(url, contentsItem);
          stylesheetContents[index] = contentsItem;
        });
    };

    const processSingleStylesheetFromFs = (
      filename: string
    ): Promise<StylesheetData> => {
      return pify(fs.readFile)(filename, 'utf8').then((css) => {
        return postcss(getPostcssPlugins(batfishConfig))
          .process(css, {
            from: filename,
            to: cssTarget,
            map: {
              inline: false,
              sourcesContent: true,
              annotation: false
            }
          })
          .catch(rethrowPostcssError)
          .then((result) => {
            return {
              locator: filename,
              css: result.css,
              map: result.map.toString()
            };
          });
      });
    };

    // input could be a filename or a glob or an array of those.
    // Get the CSS from each file and insert it into stylesheetContents
    // at the specified index. If input is array, that item in stylesheetContents
    // will be an array.
    const getStylesheetFromFs = (
      input: string | Array<string>,
      index: number
    ): Promise<void> => {
      return globby(input, { absolute: true })
        .then((filenames) => {
          return Promise.all(filenames.map(processSingleStylesheetFromFs));
        })
        .then((contents) => {
          stylesheetContents[index] = contents;
        });
    };

    // Runs after stylesheetContents has been populated. Concatenates the CSS
    // in that order, with source maps. Outputs new CSS and and a new source map.
    const concatStylesheetContents = (): { css: string, map: string } => {
      const concatenator = new Concat(
        true,
        path.join(cssOutputDirectory, constants.BATFISH_CSS_BASENAME),
        '\n'
      );
      // Since items in stylesheets can be an array (fancy glob),
      // we need to be recursive here.
      const addItems = (list) => {
        list.forEach((item) => {
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

    let cssFilePath;
    return Promise.all(
      batfishConfig.stylesheets.map((locator, index) => {
        if (!Array.isArray(locator) && isAbsoluteUrl(locator)) {
          return getStylesheetFromUrl(locator, index);
        }
        return getStylesheetFromFs(locator, index);
      })
    )
      .then(() => pify(mkdirp)(cssOutputDirectory))
      .then(() => {
        const concatenated = concatStylesheetContents();

        const finalCss = concatenated.css;
        const finalMap = concatenated.map;

        // Add a md5 hash to the filename for production.
        let basename = constants.BATFISH_CSS_BASENAME;
        if (batfishConfig.production) {
          const hash = hasha(finalCss, { algorithm: 'md5' });
          basename = basename.replace(/\.css$/, `-${hash}.css`);
        }

        const finalCssWithSourcemapAnnotation = `${finalCss}/*# sourceMappingURL=${basename}.map */`;
        cssFilePath = path.join(cssOutputDirectory, basename);
        const mapFilePath = `${cssFilePath}.map`;
        return Promise.all([
          pify(fs.writeFile)(cssFilePath, finalCssWithSourcemapAnnotation),
          pify(fs.writeFile)(mapFilePath, finalMap)
        ]).then(() => cssFilePath);
      });
  });
}

module.exports = compileStylesheets;
