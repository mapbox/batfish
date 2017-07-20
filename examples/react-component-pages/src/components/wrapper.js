const React = require('react');

class Wrapper extends React.Component {
  render() {
    return (
      <div>
        <nav className="bg-blue p12">
          <ul>
            <li className="link link--white inline-block mr12">
              <a href="/">Home</a>
            </li>
            <li className="link link--white inline-block mr12">
              <a href="/blog">Blog</a>
            </li>
            <li className="link link--white inline-block mr12">
              <a href="/about">About</a>
            </li>
            <li className="link link--white inline-block">
              <a href="/unpublished">Unpublished Page</a>
            </li>
          </ul>
        </nav>
        <main className="p12">
          {this.props.children}
        </main>
      </div>
    );
  }
}

module.exports = Wrapper;
