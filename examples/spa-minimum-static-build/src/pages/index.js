import React from 'react';
import { Helmet } from 'react-helmet';
import App from '../app';

export default class Page extends React.Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>SPA minimum static build example</title>
        </Helmet>
        <div>
          <p>This text will be written directly into the HTML.</p>
          <App />
        </div>
      </div>
    );
  }
}
