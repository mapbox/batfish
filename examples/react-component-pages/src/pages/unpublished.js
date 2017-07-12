/*---
published: false
---*/

'use strict';

const React = require('react');

class UnpublishedPage extends React.Component {
  render() {
    return (
      <div>
        This page is unpublished and will not be accessible in <em>production</em> environments.
      </div>
    );
  }
}

module.exports = UnpublishedPage;
