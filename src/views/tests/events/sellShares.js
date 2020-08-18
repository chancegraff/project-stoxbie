import {
  waitFor,
} from "@testing-library/react";

import {
  formatCount,
  formatCurrency,
  formatPercentage,
} from "utils/Utilities";
import ledgerBalanceShouldChange from "views/tests/assertions/ledgerBalanceShouldChange";
import ledgerChangeShouldChange from "views/tests/assertions/ledgerChangeShouldChange";
import sliderShouldChange from "views/tests/assertions/sliderShouldChange";
import tradeRowShouldHaveText from "views/tests/assertions/tradeRowShouldHaveText";
import tradeRowsShouldHaveLength from "views/tests/assertions/tradeRowsShouldHaveLength";
import TableTradeRows from "views/tests/elements/TableTradeRows";
import changeSlider from "views/tests/events/changeSlider";
import clickSell from "views/tests/events/clickSell";

const sellShares = async (
  trade,
  tradeRowsLength,
) =>
{
  changeSlider(
    trade.CloseCount,
  );

  await waitFor(
    () =>
    {
      return sliderShouldChange(
        `${trade.CloseCount}`,
      );
    },
  );

  clickSell();

  await waitFor(
    () =>
    {
      return sliderShouldChange(
        "0",
      );
    },
  );

  const tradeRows = TableTradeRows();

  tradeRowsShouldHaveLength(
    tradeRows,
    tradeRowsLength,
  );

  const [
    firstTradeRow,
    secondTradeRow,
  ] = tradeRows;

  let tradeRow = secondTradeRow;

  if (!secondTradeRow || trade.TotalShares === 0)
  {
    tradeRow = firstTradeRow;
  }

  tradeRowShouldHaveText(
    tradeRow,
    formatCount(
      trade.CloseCount,
    ),
  );

  tradeRowShouldHaveText(
    tradeRow,
    formatCurrency(
      trade.OpenPrice,
    ),
  );

  tradeRowShouldHaveText(
    tradeRow,
    formatCurrency(
      trade.ClosePrice,
    ),
  );

  tradeRowShouldHaveText(
    tradeRow,
    formatCurrency(
      trade.CloseCount * trade.ClosePrice,
    ),
  );

  ledgerBalanceShouldChange(
    formatCurrency(
      trade.LedgerBalance,
    ),
  );

  ledgerChangeShouldChange(
    formatPercentage(
      trade.LedgerChange,
    ),
  );
};

export default sellShares;