// @flow
'use strict';

const fs = require('fs');
const path = require('path');
const sitemapStatic = require('sitemap-static');
const joinUrlParts = require('./join-url-parts');

// Build a sitemap cataloging the HTML files in the outputDirectory.
function generateSitemap(batfishConfig: BatfishConfiguration): Promise<void> {
  const sitemapWriter = fs.createWriteStream(
    path.join(batfishConfig.outputDirectory, 'sitemap.xml')
  );
  return new Promise((resolve, reject) => {
    sitemapWriter.on('error', reject);
    sitemapWriter.on('finish', () => resolve());

    sitemapStatic(sitemapWriter, {
      findRoot: batfishConfig.outputDirectory,
      prefix: joinUrlParts(
        String(batfishConfig.siteOrigin),
        String(batfishConfig.siteBasePath),
        ''
      ),
      pretty: true
    });
  });
}

module.exports = generateSitemap;
