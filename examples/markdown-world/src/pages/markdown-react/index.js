/*---
title: Markdown + React
description: Here to show Markdown with a React page
---*/

'use strict';
const React = require('react');
const md = require('batfish/md');
const PageShell = require('../../components/page-shell');
const PageHero = require('../../components/page-hero');
const prefixUrl = require('@mapbox/batfish/prefix-url');
const Helmet = require('react-helmet').Helmet;
const MarkdownReactCSS = require('./unique.css');
class MarkdownReactPage extends React.Component {
  render() {
    return (
      <PageShell>
        <Helmet>
          <script>
            {console.log('YO')}
          </script>
        </Helmet>
        <MarkdownReactCSS />
        <PageHero
          bgColor="purple-light"
          title="Markdown + React"
          description="Here to show Markdown with a React page"
        />
        <div className="my36 px36 prose">
          <ul>
            <li>
              <a className="link" href={prefixUrl('/markdown-react/plugins')}>
                Remark and Rehype Plugins
              </a>
            </li>
            <li>
              <a
                className="link"
                href={prefixUrl('/markdown-react/unpublished')}
              >
                Unpublished React Page
              </a>
            </li>
            <li>
              <a
                className="link"
                href={prefixUrl('/markdown-react/route-to-home')}
              >
                Route to Home
              </a>
            </li>
          </ul>
        </div>
        <div className="my60 px36">
          <span className="uniqueText">Here's page-specific CSS</span>
        </div>
        <div className="my36 px36 prose">
          {md`#### Here's JSX Markdown`}
          <p>react-helmet is demonstrated in the console</p>
        </div>
      </PageShell>
    );
  }
}
module.exports = MarkdownReactPage;
