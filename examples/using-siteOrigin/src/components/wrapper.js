import React, { Component } from 'react';
import { prefixUrlAbsolute } from '@mapbox/batfish/modules/prefix-url';

export default class Wrapper extends Component {
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
                <a className="link" href={prefixUrlAbsolute('/')}>
                  Home
                </a>
              </li>
              <li className="nav__item">
                <a className="link" href={prefixUrlAbsolute('/page-a')}>
                  Page A
                </a>
              </li>
              <li className="nav__item">
                <a className="link" href={prefixUrlAbsolute('/page-b')}>
                  Page B
                </a>
              </li>
            </ul>
          </nav>
          <p className="txt-s mb6">
            The links above are absolute URLs, created using{' '}
            <code>prefixUrlAbsolute</code>.
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
