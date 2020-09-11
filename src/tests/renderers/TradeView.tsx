import React from "react";
import {
  render,
} from "@testing-library/react";

import Boilerplate from "tests/Boilerplate";
import {
  getPrice,
  tradeViewStartDate,
} from "tests/Helpers";
import {
  DateFormats,
  formatDate,
} from "utils/Utilities";
import TradeView from "views/TradeView";

const urlDate = formatDate(
  tradeViewStartDate,
  DateFormats.Url,
);

const dayOnePrice = getPrice(
  tradeViewStartDate,
);

export const renderTradeView = () =>
{
  return render(
    (
      <Boilerplate
        path="/trade/:ticker/:date"
        route={`/trade/${dayOnePrice.symbol}/${urlDate}`}
      >
        <TradeView
          error={undefined}
          date={urlDate}
        />
      </Boilerplate>
    ),
  );
};
