/*---
title: Home away from home
description: Everything you ever wanted
siteData:
  - cta
  - posts
---*/
'use strict';

const React = require('react');
const PageShell = require('../components/page-shell');

class Home extends React.Component {
  render() {
    return (
      <PageShell>
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
          <div className="txt-bold txt-l mb12">
            Posts
          </div>
          {this.props.siteData.posts.map(post => {
            return (
              <div key={post.path} className="mt6">
                <a href={post.path} className="link">
                  {post.data.title}
                </a>
              </div>
            );
          })}
        </div>
      </PageShell>
    );
  }
}

module.exports = Home;
