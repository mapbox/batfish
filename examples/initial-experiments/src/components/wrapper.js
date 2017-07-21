import React from 'react';
import {
  addRouteChangeStartListener,
  addRouteChangeEndListener
} from '@mapbox/batfish/modules/route-change-listeners';
import '../test.css';

addRouteChangeStartListener(() => {
  console.log('starting the route change');
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('ending the start of the route change');
      resolve();
    }, 500);
  });
});

addRouteChangeEndListener(() => {
  console.log('ending the route change');
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
