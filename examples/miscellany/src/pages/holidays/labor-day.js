/*---
title: Labor Day
description: Description of Labor Day.
date: First Monday of September
month: 09
---*/

import React from 'react';
import md from '@mapbox/batfish/modules/md';
import HolidayWrapper from '../../components/holiday-wrapper';
import HolidayImage from '../../components/holiday-image';

export default class LaborDay extends React.Component {
  render() {
    const { props } = this;
    return (
      <HolidayWrapper {...props}>
        <HolidayImage src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/First_United_States_Labor_Day_Parade%2C_September_5%2C_1882_in_New_York_City.jpg/1600px-First_United_States_Labor_Day_Parade%2C_September_5%2C_1882_in_New_York_City.jpg" />
        {md`
          **Labor Day** in the United States is a public holiday celebrated on the first Monday in September. It honors the [American labor movement](https://en.wikipedia.org/wiki/Labor_history_of_the_United_States) and the contributions that workers have made to the strength, prosperity, laws and well-being of the country. It is the Monday of the long weekend known as **Labor Day** Weekend and it is considered the unofficial end of summer in the United States. The holiday is also a federal holiday.

          Beginning in the late 19th century, as the trade union and labor movements grew, trade unionists proposed that a day be set aside to celebrate labor. "**Labor Day**" was promoted by the Central Labor Union and the Knights of Labor, which organized the first parade in New York City. In 1887, Oregon was the first state of the United States to make it an official public holiday. By the time it became an official federal holiday in 1894, thirty U.S. states officially celebrated **Labor Day**.

          **[Learn more about Labor Day.](<https://en.wikipedia.org/wiki/Labor_Day_(United_States)>)**
        `}
      </HolidayWrapper>
    );
  }
}
