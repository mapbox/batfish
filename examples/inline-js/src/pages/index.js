'use strict';

const React = require('react');
const Helmet = require('react-helmet').Helmet;

class Home extends React.Component {
  render() {
    return (
      <div>
        <Helmet>
          <script>
            {"console.log('the home page has rendered')"}
          </script>
        </Helmet>
        here's some regular content
      </div>
    );
  }
}

module.exports = Home;
