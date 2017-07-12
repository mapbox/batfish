/*---
title: Plugins on a React page
description: Here to show off rehype and remark plugins in React pages
---*/

'use strict';
const React = require('react');
const PageShell = require('../../components/page-shell');
const PageHero = require('../../components/page-hero');
const md = require('batfish/md');

class PluginsPage extends React.Component {
  render() {
    const emojiText = md`
      ### remark-emoji

      **Here's some emojis**:

      :rocket: :dog: :cat: :+1:`;

    const plainCodeText = md`
    ### rehype-highlight

    <pre><code class="language-js">var name = "World";
    console.log("Hello, " + name + "!")</code></pre>

    \`\`\`js
    var name = "World";
    console.log("Hello, " + name + "!");
    \`\`\``;

    return (
      <PageShell>
        <PageHero
          bgColor="purple-light"
          title="Plugins on a React page"
          description="Here to show off rehype and remark plugins in a React page"
        />
        <div className="my60 px36 prose">
          {emojiText}
        </div>
        <div className="my60 px36 prose">
          {plainCodeText}
        </div>
      </PageShell>
    );
  }
}
module.exports = PluginsPage;
