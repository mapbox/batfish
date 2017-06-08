const React = require('react');
const PageShell = require('../../components/page-shell');

const data = {
  title: 'TwoTwoTwo'
};

class Two extends React.Component {
  render() {
    return (
      <PageShell>
        two
      </PageShell>
    );
  }
}

module.exports = {
  data,
  component: Two
};
