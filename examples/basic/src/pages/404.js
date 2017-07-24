/*---
title: 404
description: This is a basic Batfish example
published: true
summary: This page was not found
---*/
import React, { PureComponent } from 'react';
import PageShell from '../components/page-shell';
export default class NotFound extends PureComponent {
  render() {
    return (
      <PageShell title="404" description="This is a basic Batfish example">
        <h1 className="customHeading">
          {this.props.frontMatter.title}
        </h1>
        {this.props.frontMatter.summary}
      </PageShell>
    );
  }
}
