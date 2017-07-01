/*---
internalRouting: true
---*/
'use strict';

const React = require('react');
const ReactRouter = require('react-router-dom');

class ShownNumber extends React.PureComponent {
  render() {
    return (
      <div style={{ fontSize: 200, fontColor: 'blue' }}>
        {this.props.match.params.id}
      </div>
    );
  }
}

class Numbers extends React.PureComponent {
  state = {
    mounted: false
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    if (!this.state.mounted) return null;

    const numberLinks = [];
    for (let i = 0; i < 11; i++) {
      numberLinks.push(
        <li key={i}>
          <ReactRouter.Link to={`/${i}`} data-no-hijack>
            Show {i}
          </ReactRouter.Link>
        </li>
      );
    }

    return (
      <ReactRouter.BrowserRouter key="router" basename="/numbers">
        <div>
          <p>There are many numbers to choose from.</p>
          <ReactRouter.Route path="/:id" component={ShownNumber} />
          <ul>
            {numberLinks}
          </ul>
        </div>
      </ReactRouter.BrowserRouter>
    );
  }
}

module.exports = Numbers;
