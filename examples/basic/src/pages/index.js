import React from 'react';
import PageShell from '../components/page-shell';

export default class Home extends React.PureComponent {
  render() {
    return (
      <PageShell title="Home" description="A basic example of Batfish at work">
        This is the home page.
      </PageShell>
    );
  }
}
