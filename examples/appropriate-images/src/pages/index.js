import React from 'react';
import AppropriateImage from '../components/appropriate-image';
export default class Home extends React.PureComponent {
  render() {
    return (
      <div>
        <AppropriateImage imageId="osprey" style={{ maxWidth: '100%' }} />
      </div>
    );
  }
}
