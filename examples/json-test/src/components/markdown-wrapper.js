import React from 'react';
import PageShell from './page-shell';

export default class MarkdownWrapper extends React.Component {
  render() {
    return (
      <PageShell frontMatter={this.props.frontMatter}>
        <div className="prose">{this.props.children}</div>
      </PageShell>
    );
  }
}
