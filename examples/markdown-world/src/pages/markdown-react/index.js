/*---
title: Markdown + React
description: Here to show off Markdown with React
---*/

'use strict';
const React = require('react');
const md = require('batfish/md');
const PageShell = require('../../components/page-shell');
const PageHero = require('../../components/page-hero');
const prefixUrl = require('batfish/prefix-url');
const Helmet = require('react-helmet').Helmet;
const MarkdownReactCSS = require('./styles.css');
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
          description="Here to show off Markdown with React"
        />
        <div className="my120 px36">
          <span className="uniqueText">So unique. Much wow.</span>
        </div>
        <div className="my120 px36 prose">
          <ul>
            <li>
              <a className="link" href={prefixUrl('/markdown-react/hidden')}>
                Hidden
              </a>
            </li>
            <li>
              <a className="link" href={prefixUrl('/markdown-react/trickster')}>
                Trickster route-to Home
              </a>
            </li>
            <li>
              <a
                className="link"
                href={prefixUrl('/markdown-react/plugins-md')}
              >
                Plugins on Markdown
              </a>
            </li>
            <li>
              <a
                className="link"
                href={prefixUrl('/markdown-react/plugins-js')}
              >
                Plugins on React
              </a>
            </li>
          </ul>
          <p>
            FYI: This page uses page-specific CSS, react-helmet in the console,
            and inline Markdown.
          </p>
        </div>
        <div className="prose my30 px30">
          {md`

          # h1
          ## h2
          ### h3
          #### h4
          ##### h5
          ###### h6


          ___

          Horizontal Rule

          ---

          Horizontal Rule

          ***

          ***bold and italic text***
          1. Ordered list
          2. Ordered list
          3. Ordered list
          4. Ordered list
          5. Ordered list


          **bold text**

          __bold text__


          * Unordered list
          + Unordered list
          - Unordered list
            * Unordered sub-list
            + Unordered sub-list
            - Unordered sub-list
              * Unordered sub-sub-list
              + Unordered sub-sub-list
              - Unordered sub-sub-list


          *italic text*

          _italic text_


          - [x] Checked box
          - [ ] Unchecked box


          ~~strikethrough text~~


          > Blockquotes
          >> Nested blockquotes
          >>> More nested blockquotes


          | Column1 | Column2 |
          | ---- | ---- |
          | Row2 | Row2 |
          | Row3 | Row3 |
          | Row4 | Row4 |

          `}
        </div>
      </PageShell>
    );
  }
}
module.exports = MarkdownReactPage;
