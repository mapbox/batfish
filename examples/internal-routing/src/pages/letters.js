/*---
internalRouting: true
---*/
'use strict';

const React = require('react');
const ReactRouter = require('react-router-dom');

class ShownLetter extends React.PureComponent {
  render() {
    return (
      <div style={{ fontSize: 200, fontColor: 'blue' }}>
        {this.props.match.params.id}
      </div>
    );
  }
}

class Letters extends React.PureComponent {
  state = {
    mounted: false
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    if (!this.state.mounted) return null;

    const letterLinks = [];
    for (let i = 65; i < 75; i++) {
      const letter = String.fromCharCode(i);
      letterLinks.push(
        <li key={i}>
          <ReactRouter.Link to={`/${letter}`} data-no-hijack>
            Show {letter}
          </ReactRouter.Link>
        </li>
      );
    }

    return (
      <ReactRouter.BrowserRouter key="router" basename="/letters">
        <div>
          <p>There are many numbers to choose from.</p>
          <ReactRouter.Route path="/:id" component={ShownLetter} />
          <ul>
            {letterLinks}
          </ul>
        </div>
      </ReactRouter.BrowserRouter>
    );
  }
}

module.exports = Letters;
