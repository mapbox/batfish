const _ = require('lodash');

const selectors = {};

selectors.holidaysData = (data) => {
  const holidays = data.pages.filter((page) =>
    /\/holidays\/.+/.test(page.path)
  );
  return _.sortBy(holidays, (holiday) => holiday.frontMatter.month);
};

selectors.storiesData = (data) => {
  const stories = data.pages.filter((page) => /\/stories\/.+/.test(page.path));
  return _.sortBy(stories, (post) => post.frontMatter.title);
};

module.exports = selectors;
