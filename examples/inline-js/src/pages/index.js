import React from 'react';
import { Helmet } from 'react-helmet';

export default class Home extends React.Component {
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
