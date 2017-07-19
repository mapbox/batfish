/*---
blogPosts:
  - title: Serious Business
    date: 12 August 2017
    categories:
      - serious thoughts
      - long discussions
    content: In my third blog post, I'd like to discuss some very serious things.
  - title: Another Post
    date: 08 August 2017
    categories:
      - things bloggers do
      - happy thoughts
      - self-referential
    content: This is only my second post and I've started neglecting the blog. I'll update more frequently, I promise.
  - title: Hello World
    date: 11 July 2017
    categories:
      - introduction
    content: Hi! This is my very first blog post.
---*/

'use strict';

const React = require('react');
require('./blog.css');

class BlogPage extends React.Component {
  renderBlogPost(blogPost, index) {
    const categories = blogPost.categories.map((category, categoryIndex) => {
      const separator =
        categoryIndex < blogPost.categories.length - 1 ? ', ' : '';
      return (
        <li className="inline" key={categoryIndex}>
          {category}
          {separator}
        </li>
      );
    });

    return (
      <div className="mb24" key={index}>
        <h4 className="mb0">
          {blogPost.title}
        </h4>
        <div className="txt-s mb3">
          {blogPost.date}
          {' — '}
          <strong>Categories:</strong>
          <ul className="ml6 inline">
            {categories}
          </ul>
        </div>
        <p>
          {blogPost.content}
        </p>
      </div>
    );
  }

  render() {
    return (
      <div className="prose">
        <p>
          The following blog posts are defined as front matter directly in this{' '}
          <code>.js</code> file.
        </p>
        <div className="blog-posts px24">
          {this.props.frontMatter.blogPosts.map(this.renderBlogPost)}
        </div>
      </div>
    );
  }
}

module.exports = BlogPage;
