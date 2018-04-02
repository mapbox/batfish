import React from 'react';

export default class MarkdownWrapper extends React.Component {
  renderToc() {
    const { headings } = this.props.frontMatter;
    if (!headings) return null;
    const entries = headings
      .filter(heading => {
        return heading.level > 1 && heading.level < 4;
      })
      .map(heading => {
        const linkStyle = { marginLeft: 20 * (heading.level - 2) };
        return (
          <li key={heading.slug}>
            <a href={`#${heading.slug}`} style={linkStyle}>
              {heading.text}
            </a>
          </li>
        );
      });
    return <ul>{entries}</ul>;
  }
  render() {
    return (
      <div>
        <h1>{this.props.frontMatter.title}</h1>
        {this.renderToc()}
        {this.props.children}
      </div>
    );
  }
}
