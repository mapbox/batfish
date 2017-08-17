import React from 'react';
import storiesData from '@mapbox/batfish/data/stories-data';
import PageShell from './page-shell';
import SidebarNavigation from './sidebar-navigation';

const sidebarItems = storiesData.map(story => {
  return {
    content: story.frontMatter.title,
    url: story.path
  };
});

export default class StoryWrapper extends React.Component {
  render() {
    const { props } = this;

    let subtitleElement = <div className="pt-4" />;
    if (props.frontMatter.subtitle) {
      subtitleElement = (
        <div className="h5 py-4">
          {props.frontMatter.subtitle}
        </div>
      );
    }

    return (
      <PageShell {...props}>
        <div className="container">
          <div className="row">
            <div className="col col-lg-3 d-none d-lg-block">
              <SidebarNavigation title="Stories" items={sidebarItems} />
            </div>
            <div className="col col-lg-9">
              <div className="py-3 pr-3 pl-5">
                <h1 className="display-4">
                  {props.frontMatter.title}
                </h1>
                {subtitleElement}
                {props.children}
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }
}
