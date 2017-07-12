'use strict';

const React = require('react');
const Helmet = require('react-helmet').Helmet;

class Wrapper extends React.Component {
  render() {
    return (
      <div>
        <Helmet>
          <script>
            {"console.log('the wrapper has rendered')"}
          </script>
        </Helmet>
        {this.props.children}
      </div>
    );
  }
}

module.exports = Wrapper;
