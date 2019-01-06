/*---
title: JavaScript page
description: A basic Batfish example.
---*/

import React from 'react';
import PageShell from '../components/page-shell';

export default class Home extends React.PureComponent {
  render() {
    const { props } = this;
    return (
      <PageShell frontMatter={props.frontMatter}>
        <h1 className="customHeading">{props.frontMatter.title}</h1>
        <p className="my12">This is a basic Batfish JavaScript page.</p>
        <p>
          <a href="/markdown/" className="link txt-underline">
            Go to the Markdown page.
          </a>
        </p>
      </PageShell>
    );
  }
}
