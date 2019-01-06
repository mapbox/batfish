import React from 'react';
import storiesData from '@mapbox/batfish/data/stories-data';
import PageShell from './page-shell';
import SidebarNavigation from './sidebar-navigation';
import getLegibleDate from '../utilities/get-legible-date';

const sidebarItems = storiesData.map((story) => {
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
        <div className="txt-l txt-em my24">{props.frontMatter.subtitle}</div>
      );
    }

    return (
      <PageShell {...props}>
        <div className="grid grid--gut36">
          <div className="col col--3">
            <SidebarNavigation title="Stories" items={sidebarItems} />
          </div>
          <div className="col col--9">
            <h1 className="txt-h1 mb24">{props.frontMatter.title}</h1>
            {subtitleElement}
            <div className="prose">{props.children}</div>
            <div className="txt-s color-gray align-r mt12">
              Posted {getLegibleDate(props.frontMatter.date)}
            </div>
          </div>
        </div>
      </PageShell>
    );
  }
}
