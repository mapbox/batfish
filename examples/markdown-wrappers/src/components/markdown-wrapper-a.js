import React from 'react';
import PageWrapper from './page-wrapper';

export default class MarkdownWrapperA extends React.Component {
  render() {
    return (
      <PageWrapper>
        <h1>Markdown Wrapper A</h1>
        <div>{this.props.children}</div>
      </PageWrapper>
    );
  }
}
