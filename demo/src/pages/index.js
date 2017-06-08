const React = require('react');
const PageShell = require('../components/page-shell');

class Home extends React.Component {
  render() {
    return (
      <PageShell>
        home
      </PageShell>
    );
  }
}

module.exports = {
  component: Home
};
