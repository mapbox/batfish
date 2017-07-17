import React from 'react';
import PageShell from '../components/page-shell';

export default class Home extends React.PureComponent {
  render() {
    return (
      <PageShell title="Home" description="A basic example of Batfish at work">
        <h1>Page title</h1>
        This is the home page.
      </PageShell>
    );
  }
}
