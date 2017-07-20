import React from 'react';
import '../test.css';

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
