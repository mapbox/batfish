import React from 'react';
import Helmet from 'react-helmet';

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <Helmet>
          <script>
            {"alert('The react-helmet script executed.')"}
          </script>
        </Helmet>
        If the inlined script has executed, the following text will recommend an
        outfit for you: <strong>{global.specialText}</strong>
      </div>
    );
  }
}
