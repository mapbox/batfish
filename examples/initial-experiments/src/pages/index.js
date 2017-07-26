/*---
title: Home away from home
description: Everything you ever wanted
injectedData:
  - posts
  - horseNames
---*/
import React from 'react';
import { withLocation } from '@mapbox/batfish/modules/with-location';
import { PageShell } from '../components/page-shell';
import { uniqueImport } from '../components/unique-import';
uniqueImport();

class Home extends React.Component {
  componentWillMount() {
    console.log(JSON.stringify(this.props.location));
  }
  render() {
    return (
      <PageShell>
        {JSON.stringify(this.props.location)}
        <div>
          {this.props.frontMatter.title}
        </div>
        <div className="mt24">
          {this.props.frontMatter.description}
        </div>
        <div className="mt24">
          <div className="txt-bold txt-l mb12">Posts</div>
          {this.props.injectedData.posts.map(post => {
            return (
              <div key={post.path} className="mt6">
                <a href={post.path} className="link">
                  {post.frontMatter.title}
                </a>
              </div>
            );
          })}
        </div>
        <div className="mt24">
          Horse names: {this.props.injectedData.horseNames.join(', ')}
        </div>
      </PageShell>
    );
  }
}

export default withLocation(Home);
