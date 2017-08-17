import React from 'react';
import holidaysData from '@mapbox/batfish/data/holidays-data';
import PageShell from './page-shell';
import SidebarNavigation from './sidebar-navigation';

const sidebarItems = holidaysData.map(holiday => {
  return {
    content: (
      <span>
        {holiday.frontMatter.title} <small>({holiday.frontMatter.date})</small>
      </span>
    ),
    url: holiday.path
  };
});

export default class HolidayWrapper extends React.Component {
  render() {
    const { props } = this;

    return (
      <PageShell {...props}>
        <div className="container">
          <div className="row">
            <div className="col col-lg-3 d-none d-lg-block">
              <SidebarNavigation title="Holidays" items={sidebarItems} />
            </div>
            <div className="col col-lg-9">
              <div className="py-3 pr-3 pl-5">
                <h1>
                  {props.frontMatter.title}
                </h1>
                <div className="badge badge-pill badge-primary my-3">
                  {props.frontMatter.date}
                </div>
                {props.children}
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }
}
