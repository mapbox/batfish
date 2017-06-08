const React = require('react');
const PageShell = require('../../components/page-shell');

const data = {
  title: 'OneOneOne'
};

class One extends React.Component {
  render() {
    return (
      <PageShell>
        one
      </PageShell>
    );
  }
}

module.exports = {
  data,
  component: One
};
