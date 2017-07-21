import React from 'react';
import {
  addRouteChangeStartListener,
  addRouteChangeEndListener
} from '@mapbox/batfish/modules/route-change-listeners';
import '../test.css';

addRouteChangeStartListener(() => {
  console.log('starting route change');
});

addRouteChangeEndListener(() => {
  return new Promise(resolve => {
    console.log('starting the end of the route change');
    setTimeout(() => {
      console.log('ending the end of the route change');
      resolve();
    }, 500);
  });
});

class Wrapper extends React.Component {
  componentDidMount() {
    console.log('mounted');
  }

  componentDidUpdate() {
    console.log('updated');
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default Wrapper;
