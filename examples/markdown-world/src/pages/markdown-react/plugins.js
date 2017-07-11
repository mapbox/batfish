/*---
title: Plugins
description: Here to show off rehype and remark plugins in React pages
---*/

'use strict';
const React = require('react');
const PageShell = require('../../components/page-shell');
const PageHero = require('../../components/page-hero');
const md = require('batfish/md');
// const remark = require('remark');
// const remarkEmoji = require('remark-emoji');
// const rehype = require('rehype');
// const rehypeHighlighter = require('rehype-highlight');

class PluginsPage extends React.Component {
  render() {
    const emojiText = md`Here's some emojis: :rocket: :dog: :cat: :+1:`;
    // const parsedEmojiText = remark()
    //   .use(remarkEmoji)
    //   .processSync(emojiText).contents;
    return (
      <PageShell>
        <PageHero
          bgColor="purple-light"
          title="Plugins"
          description="Here to show off rehype and remark plugins"
        />
        {emojiText}
      </PageShell>
    );
  }
}
module.exports = PluginsPage;

// const plainCodeText = `<h1>Hello World!</h1>
//   <pre><code class="language-js">var name = "World";
//   console.log("Hello, " + name + "!")</code></pre>`;
// const highlightedCodeText = rehype()
//   .data('settings',{fragment:true})
//   .use(rehypeHighlighter)
//   .processSync(plainCodeText).contents;
// const parsedHighlightedCodeText = highlightedCodeText;
// <div className="my60 px36">{parsedEmojiText}</div>
// <div className="my60 px36">{parsedHighlightedCodeText}</div>
