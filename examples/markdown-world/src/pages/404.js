/* eslint-disable filenames/match-regex */
'use strict';
const React = require('react');
const PageShell = require('../components/page-shell');
const PageHero = require('../components/page-hero');
class NotFound extends React.Component {
  render() {
    return (
      <PageShell>
        <PageHero
          bgColor="red-light"
          title="404"
          description="#sorrynotsorry."
        />
        <div>Ack, you seem lost.</div>
      </PageShell>
    );
  }
}
module.exports = NotFound;
