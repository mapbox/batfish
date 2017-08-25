/*---
title: Memorial Day
description: Description of Memorial Day.
date: Last Monday of May
month: 05
---*/

import React from 'react';
import md from '@mapbox/batfish/modules/md';
import HolidayWrapper from '../../components/holiday-wrapper';

export default class MemorialDay extends React.Component {
  render() {
    const { props } = this;
    return (
      <HolidayWrapper {...props}>
        <div className="mb24">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Graves_at_Arlington_on_Memorial_Day.JPG/1024px-Graves_at_Arlington_on_Memorial_Day.JPG"
            style={{ maxWidth: '100%', maxHeight: 400 }}
            className="mb-3"
          />
        </div>
        {md`
          **Memorial Day** is a federal holiday in the United States for remembering the people who died while serving in the [country's armed forces](https://en.wikipedia.org/wiki/United_States_Armed_Forces). The holiday, which is currently observed every year on the last Monday of May, was held on May 29, 2017. The holiday was held on May 30 from 1868-1970. It marks the start of the unofficial summer vacation season, while Labor Day marks its end.

          Many people visit cemeteries and memorials, particularly to honor those who have died in military service. Many volunteers place an American flag on each grave in national cemeteries.

          **Memorial Day** is not to be confused with Veterans Day; **Memorial Day** is a day of remembering the men and women who died while serving, while Veterans Day celebrates the service of all U.S. military veterans.

          **[Learn more about Memorial Day.](https://en.wikipedia.org/wiki/Memorial_Day_(United_States))**
        `}
      </HolidayWrapper>
    );
  }
}
