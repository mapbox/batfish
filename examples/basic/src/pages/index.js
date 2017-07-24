/*---
title: Home
description: This is a basic Batfish example
published: true
summary: This is the home page
---*/
import React from 'react';
import PageShell from '../components/page-shell';
export default class Home extends React.PureComponent {
  render() {
    return (
      <PageShell
        title={this.props.frontMatter.title}
        description={this.props.frontMatter.description}
      >
        <h1 className="customHeading">
          {this.props.frontMatter.title}
        </h1>
        {this.props.frontMatter.summary}
      </PageShell>
    );
  }
}
