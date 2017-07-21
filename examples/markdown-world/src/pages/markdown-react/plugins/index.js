/*---
title: Remark and Rehype Plugins
description: Here to show the same Remark and Rehype plugins in Markdown and React examples
---*/

const React = require('react');
const md = require('@mapbox/batfish/modules/md');
const PageShell = require('../../../components/page-shell');
const PageHero = require('../../../components/page-hero');
const prefixUrl = require('@mapbox/batfish/modules/prefix-url').prefixUrl;
class PluginsPage extends React.Component {
  render() {
    return (
      <PageShell>
        <PageHero
          bgColor="purple-light"
          title="Remark and Rehype Plugins"
          description="Here to show Remark and Rehype plugins in Markdown and React pages"
        />
        <div className="my36 px36 prose">
          {md`Currently using \`remark-emoji\` and \`rehype-highlight\` in the following:`}
        </div>
        <div className="my36 px36 prose">
          <ul>
            <li>
              <a
                className="link"
                href={prefixUrl('/markdown-react/plugins/markdown')}
              >
                Markdown Page
              </a>
            </li>
            <li>
              <a
                className="link"
                href={prefixUrl('/markdown-react/plugins/react')}
              >
                React Page
              </a>
            </li>
          </ul>
        </div>
      </PageShell>
    );
  }
}
module.exports = PluginsPage;
