/*---
title: Holidays
description: A collection of articles about holidays.
---*/

import React from 'react';
import holidaysData from '@mapbox/batfish/data/holidays-data';
import PageShell from '../../components/page-shell';

export default class Holidays extends React.Component {
  render() {
    const { props } = this;

    const holidayItems = holidaysData.map((holiday) => {
      return (
        <a
          key={holiday.path}
          className="block py24 border-b border--gray-light link link--purple"
          href={holiday.path}
        >
          <div className="inline-block txt-h3 mr12">
            {holiday.frontMatter.title}
          </div>
          <div className="inline-block pl12">({holiday.frontMatter.date})</div>
        </a>
      );
    });

    return (
      <PageShell {...props}>
        <h1 className="txt-h1 txt-bold mb12">Holidays!</h1>
        {holidayItems}
      </PageShell>
    );
  }
}
