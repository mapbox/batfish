/*---
title: Stories
description: A collection of stories by Stephen Crane.
---*/

import React from 'react';
import storiesData from '@mapbox/batfish/data/stories-data';
import PageShell from '../../components/page-shell';

export default class Stories extends React.Component {
  render() {
    const { props } = this;

    const storyItems = storiesData.map(story => {
      return (
        <a
          key={story.path}
          className="block py24 border-b border--gray-light link link--purple"
          href={story.path}
        >
          <div className="txt-h3 mr12">
            {story.frontMatter.title}
          </div>
          <div className="txt-em">
            {story.frontMatter.subtitle}
          </div>
        </a>
      );
    });

    return (
      <PageShell {...props}>
        <h1 className="txt-h1 txt-bold mb12">Stories!</h1>
        <div className="mb12">All by Stephen Crane.</div>
        {storyItems}
      </PageShell>
    );
  }
}
