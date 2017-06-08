const React = require('react');

class WwwTemplate extends React.Component {
  // This should never be updated by React
  shouldComponentUpdate() {
    return false;
  }

  render() {
    let appendToBody = null;
    if (this.props.appendToBody) {
      appendToBody = (
        <div
          dangerouslySetInnerHTML={{
            __html: this.props.appendToBody.join('\n')
          }}
        />
      );
    }

    let app = <div id="batfish-content">{this.props.content}</div>;
    if (this.props.rawAppHtml) {
      app = (
        <div
          id="batfish-content"
          dangerouslySetInnerHTML={{ __html: this.props.rawAppHtml }}
        />
      );
    }

    return (
      <html lang="en" {...this.props.htmlAttributes}>
        <head>
          <meta name="robots" content="index" />
        </head>
        <body>
          {app}
          {appendToBody}
        </body>
      </html>
    );
  }
}

module.exports = WwwTemplate;
