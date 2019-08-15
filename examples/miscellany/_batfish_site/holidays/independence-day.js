/*---
title: Independence Day
description: Description of Independence Day.
date: "4th of July"
month: 07
---*/

import React from 'react';
import md from '@mapbox/batfish/modules/md';
import HolidayWrapper from '../../components/holiday-wrapper';
import HolidayImage from '../../components/holiday-image';

export default class IndependenceDay extends React.Component {
  render() {
    const { props } = this;
    return (
      <HolidayWrapper {...props}>
        <HolidayImage
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Fourth_of_July_fireworks_behind_the_Washington_Monument%2C_1986.jpg/787px-Fourth_of_July_fireworks_behind_the_Washington_Monument%2C_1986.jpg"
          style={{ maxHeight: 400 }}
        />
        {md`
          **Independence Day**, also referred to as the Fourth of July or July Fourth, is a federal holiday in the United States commemorating the adoption of the [Declaration of Independence](https://en.wikipedia.org/wiki/United_States_Declaration_of_Independence) on July 4, 1776. The Continental Congress declared that the thirteen American colonies regarded themselves as a new nation, the United States of America, and were no longer part of the British Empire. The Congress actually voted to declare independence two days earlier, on July 2.

          **Independence Day** is commonly associated with fireworks, parades, barbecues, carnivals, fairs, picnics, concerts, baseball games, family reunions, and political speeches and ceremonies, in addition to various other public and private events celebrating the history, government, and traditions of the United States. **Independence Day** is the National Day of the United States.

          **[Learn more about Independence Day.](<https://en.wikipedia.org/wiki/Independence_Day_(United_States)>)**
        `}
      </HolidayWrapper>
    );
  }
}
