import React from 'react';
import PageWrapper from './page-wrapper';

export default class MarkdownWrapperB extends React.Component {
  render() {
    return (
      <PageWrapper>
        <h1>Markdown Wrapper B</h1>
        <div>{this.props.children}</div>
      </PageWrapper>
    );
  }
}
