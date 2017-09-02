import React from 'react';
import HomeCss from './index.css';

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <HomeCss />
        <div style={{ padding: '2em' }}>
          <p>This is the home page.</p>
          <p>
            Go to <a href="/another/">another page</a>.
          </p>
        </div>
      </div>
    );
  }
}
