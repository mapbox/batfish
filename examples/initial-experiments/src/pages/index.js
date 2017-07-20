/*---
title: Home away from home
description: Everything you ever wanted
siteData:
  - cta
  - posts
---*/
import React from 'react';
import { withLocation } from '@mapbox/batfish/modules/with-location';
import { PageShell } from '../components/page-shell';

class Home extends React.Component {
  render() {
    return (
      <PageShell>
        {JSON.stringify(this.props.location)}
        <div>
          {this.props.frontMatter.title}
        </div>
        <div>
          {this.props.siteData.cta}
        </div>
        <div className="mt24">
          {this.props.frontMatter.description}
        </div>
        <div className="mt24">
          <div className="txt-bold txt-l mb12">Posts</div>
          {this.props.siteData.posts.map(post => {
            return (
              <div key={post.path} className="mt6">
                <a href={post.path} className="link">
                  {post.frontMatter.title}
                </a>
              </div>
            );
          })}
        </div>
      </PageShell>
    );
  }
}

export default withLocation(Home);
