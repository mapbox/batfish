import React from 'react';

// This should break the static build if this file is not properly stubbed.
window.addEventListener('click', () => {
  console.log('There was a click');
});

export default class App extends React.Component {
  render() {
    return (
      <p>
        The presence of this text means the app has rendered. Click around and
        you'll see corresponding console logs.
      </p>
    );
  }
}
