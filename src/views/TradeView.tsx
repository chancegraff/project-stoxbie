import React from "react";
import {
  RouteProps,
} from "react-router-dom";

import {
  useError,
} from "utils/Hooks";

import TradeViewLogic from "./TradeView/TradeViewLogic";

type Props = RouteProps & {
  date: string | undefined;
  ticker: string | undefined;
  error: string | undefined;
};

const TradeView: React.FC<Props> = (
  {
    date,
    ticker,
    error,
  },
) =>
{
  useError(
    error,
  );

  return (
    <TradeViewLogic
      date={date}
    />
  );
};

export default TradeView;
