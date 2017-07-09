/*---
title: Hiddent React
description: Here to hide a React file
published: false
---*/

'use strict';
const React = require('react');
const PageShell = require('../../components/page-shell');
const PageHero = require('../../components/page-hero');
class MarkdownReactPage extends React.Component {
  render() {
    return (
      <PageShell>
        <PageHero
          bgColor="purple-light"
          title="Hidden React"
          description="Here to hide a React file"
        />
        <div className="my120 px36">
          <h1>This page should be seen in development but not production!</h1>
        </div>
      </PageShell>
    );
  }
}
module.exports = MarkdownReactPage;
