import React from 'react';
import holidaysData from '@mapbox/batfish/data/holidays-data';
import PageShell from './page-shell';
import SidebarNavigation from './sidebar-navigation';

const sidebarItems = holidaysData.map((holiday) => {
  return {
    content: (
      <div>
        {holiday.frontMatter.title}
        <div className="txt-s pl12">({holiday.frontMatter.date})</div>
      </div>
    ),
    url: holiday.path
  };
});

export default class HolidayWrapper extends React.Component {
  render() {
    const { props } = this;

    return (
      <PageShell {...props}>
        <div className="grid grid--gut36">
          <div className="col col--3">
            <SidebarNavigation title="Holidays" items={sidebarItems} />
          </div>
          <div className="col col--9">
            <h1 className="txt-h1">{props.frontMatter.title}</h1>
            <div className="bg-gray color-white px12 py6 inline-block txt-bold my12">
              {props.frontMatter.date}
            </div>
            <div className="prose">{props.children}</div>
          </div>
        </div>
      </PageShell>
    );
  }
}
