/*---
title: title: Plugins in React
description: Here to show rehype and remark plugins in React
---*/

const React = require('react');
const md = require('batfish/md');
const PageShell = require('../../../components/page-shell');
const PageHero = require('../../../components/page-hero');
class PluginsPage extends React.Component {
  render() {
    return (
      <PageShell>
        <PageHero
          bgColor="purple-light"
          title="Plugins in React"
          description="Here to show rehype and remark plugins in React"
        />
        <div className="my36 px36 prose">
          {md`
            ### remark-emoji

            **Here's some emojis**:

            :rocket: :dog: :cat: :+1:`}
        </div>
        <div className="my36 px36 prose">
          {md`
            ### rehype-highlight

            <pre><code class="language-js">var name = "World";
            console.log("Hello, " + name + "!")</code></pre>

            \`\`\`js
            var name = "World";
            console.log("Hello, " + name + "!");
            \`\`\``}
        </div>
      </PageShell>
    );
  }
}
module.exports = PluginsPage;
