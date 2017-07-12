'use strict';

const React = require('react');
const prefixUrl = require('batfish/prefix-url');

require('../wrapper.css');

class Wrapper extends React.Component {
  render() {
    return (
      <div className="page-wrapper flex-parent flex-parent--stretch-cross hfull p24">
        <div className="sidebar p24 bg-gray-faint">
          <p className="txt-xs txt-uppercase">
            <strong>Menu</strong>
          </p>
          <nav className="nav mb12">
            <ul>
              <li className="nav__item">
                <a className="link" href={prefixUrl.absolute('/')}>
                  Home
                </a>
              </li>
              <li className="nav__item">
                <a className="link" href={prefixUrl.absolute('/page-a')}>
                  Page A
                </a>
              </li>
              <li className="nav__item">
                <a className="link" href={prefixUrl.absolute('/page-b')}>
                  Page B
                </a>
              </li>
            </ul>
          </nav>
          <p className="txt-s mb6">
            The links above are absolute URLs, created using{' '}
            <code>prefixUrl.absolute</code>.
          </p>
          <p className="txt-s">Neat!</p>
        </div>
        <div className="main-content p24">
          {this.props.children}
        </div>
      </div>
    );
  }
}

module.exports = Wrapper;
