import React, {
  DispatchSetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  RouteProps,
} from "react-router-dom";
import {
  HistoricalPrice,
} from "@chancey/iex-cloud";
import {
  closestIndexTo,
  parseISO,
} from "date-fns";
import {
  HistoricalLedger,
  HistoricalTrade,
  HistoricalTradeFinished,
  HistoricalTradeStarted,
} from "trade-types";
import createPersistedState from "use-persisted-state";

import {
  useError,
  useScrollToTop,
  useUnload,
} from "utils/Hooks";

import TradeViewDisplay from "./TradeViewDisplay";

const getPriceIndexes = (
  prices: HistoricalPrice[],
  date: Date,
) =>
{
  const priceDates = prices.map(
    (
      {
        date: dateString,
      },
    ) =>
    {
      return parseISO(
        dateString,
      );
    },
  );
  const startDateIndex = closestIndexTo(
    date,
    priceDates,
  );
  const endDateIndex = Math.max(
    startDateIndex - 730,
    0,
  );

  return [
    endDateIndex,
    startDateIndex,
  ];
};

const canGetNextPrice = (
  prices: HistoricalPrice[],
  nextPriceIndexes: number[],
) =>
{
  const [
    , startDateIndex,
  ] = nextPriceIndexes;

  return prices.length > startDateIndex;
};

const setNextPrices = (
  prices: HistoricalPrice[],
  priceIndexes: number[],
  {
    setHistoricalPrices,
    setNextPriceIndexes,
  }: {
    setHistoricalPrices: DispatchSetStateAction<HistoricalPrice[] | undefined>;
    setNextPriceIndexes: DispatchSetStateAction<number[] | undefined>;
  },
) =>
{
  const nextPriceIndexes = priceIndexes.map(
    (
      index,
    ) =>
    {
      return index + 1;
    },
  );
  const nextPrices = prices.slice(
    ...nextPriceIndexes,
  );

  setHistoricalPrices(
    nextPrices,
  );
  setNextPriceIndexes(
    nextPriceIndexes,
  );
};

const getOpenedTrade = (
  previousTrade: HistoricalTrade,
  shareClose: number,
  shareCount: number,
): HistoricalTradeStarted =>
{
  const openPrice = shareClose;
  const openCount = Math.abs(
    shareCount,
  );
  const openDirection = (shareCount / openCount) as -1 | 1;
  const openDate = new Date();
  const openBalance = openCount * openPrice;
  const currentTrade = {
    ...previousTrade,
    openPrice,
    openCount,
    openDirection,
    openBalance,
    openDate,
  };

  return currentTrade;
};

const getClosedTrade = (
  previousTrade: HistoricalTradeStarted,
  shareClose: number,
  shareCount: number,
): HistoricalTradeFinished =>
{
  const closePrice = shareClose;
  const closeCount = Math.abs(
    shareCount,
  );
  const closeDirection = (shareCount / closeCount) as -1 | 1;
  const closeDate = new Date();
  const closeBalance = closeCount * shareClose;
  const changePrice = (closePrice - previousTrade.openPrice) * previousTrade.openDirection;
  const pricePaid = closeCount * previousTrade.openPrice;
  const changeBalance = (closeBalance - pricePaid) * previousTrade.openDirection;
  const changePercent = changeBalance / pricePaid;
  const currentTrade = {
    ...previousTrade,
    changeBalance,
    changePercent,
    changePrice,
    closePrice,
    closeCount,
    closeDirection,
    closeBalance,
    closeDate,
  };

  return currentTrade;
};

const useHistoricalHoldingsState = createPersistedState(
  "historicalHoldings",
);
const useHistoricalLedgersState = createPersistedState(
  "historicalLedgers",
);
const usePresentHoldingsState = createPersistedState(
  "presentHoldings",
);

const initialLedger = {
  totalBalance: 10000,
  totalChange: 0,
  totalReturns: 0,
  totalCount: 0,
};

type Props = RouteProps & {
  date: Date | undefined;
  prices: HistoricalPrice[] | undefined;
  ticker: string | undefined;
  error?: string;
};

const TradeViewLogic: React.FC<Props> = (
  {
    prices,
    date,
    error,
    ticker,
  },
) =>
{
  const [
    nextPriceIndexes,
    setNextPriceIndexes,
  ] = useState<number[]>();
  const [
    historicalPrices,
    setHistoricalPrices,
  ] = useState<HistoricalPrice[]>();

  const [
    historicalHoldings,
    setHistoricalHoldings,
  ] = useHistoricalHoldingsState<HistoricalTradeFinished[]>(
    [],
  );
  const [
    historicalLedgers,
    setHistoricalLedgers,
  ] = useHistoricalLedgersState<HistoricalLedger[]>(
    [
      initialLedger,
    ],
  );
  const [
    presentHoldings,
    setPresentHoldings,
  ] = usePresentHoldingsState<HistoricalTradeStarted[]>(
    [],
  );

  const presentPrice = useMemo(
    () =>
    {
      return historicalPrices &&
             historicalPrices[historicalPrices.length - 1];
    },
    [
      historicalPrices,
    ],
  );
  const presentLedger = useMemo(
    () =>
    {
      const [
        nextLedger,
      ] = historicalLedgers;

      return nextLedger;
    },
    [
      historicalLedgers,
    ],
  );
  const highestPresentHolding = useMemo(
    () =>
    {
      if (presentHoldings.length <= 0)
      {
        return;
      }

      const [
        newestOpenedHolding,
      ] = presentHoldings;

      return presentHoldings.reduceRight(
        (
          previousHolding,
          nextHolding,
        ) =>
        {
          return previousHolding.openPrice > nextHolding.openPrice
            ? previousHolding
            : nextHolding;
        },
        newestOpenedHolding,
      );
    },
    [
      presentHoldings,
    ],
  );
  const updatePresentHoldings = useCallback(
    (
      nextTrades: HistoricalTradeStarted[],
    ) =>
    {
      setPresentHoldings(
        nextTrades,
      );
    },
    [
      setPresentHoldings,
    ],
  );
  const updateHistoricalHoldings = useCallback(
    (
      nextTrades: HistoricalTradeFinished[],
    ) =>
    {
      setHistoricalHoldings(
        [
          ...nextTrades,
          ...historicalHoldings,
        ],
      );
    },
    [
      historicalHoldings,
      setHistoricalHoldings,
    ],
  );
  const updateHistoricalLedgers = useCallback(
    (
      nextLedger: HistoricalLedger,
    ) =>
    {
      setHistoricalLedgers(
        [
          nextLedger,
          ...historicalLedgers,
        ],
      );
    },
    [
      historicalLedgers,
      setHistoricalLedgers,
    ],
  );
  const openTrade = useCallback(
    (
      sharePrice: number,
      shareCount: number,
    ) =>
    {
      if (!ticker)
      {
        return;
      }

      const nextTrade = {
        ticker,
      };
      const {
        ...nextHistoricalLedgers
      } = presentLedger;
      const {
        totalBalance: previousTotalBalance,
        totalChange: previousTotalChange,
        totalReturns: previousTotalReturns,
        totalCount: previousTotalCount,
      } = presentLedger;
      const openedTrade = getOpenedTrade(
        nextTrade,
        sharePrice,
        shareCount,
      );

      nextHistoricalLedgers.totalBalance = previousTotalBalance - (openedTrade.openPrice * openedTrade.openCount);
      nextHistoricalLedgers.totalChange = previousTotalChange;
      nextHistoricalLedgers.totalReturns = previousTotalReturns;
      nextHistoricalLedgers.totalCount = previousTotalCount + openedTrade.openCount;
      const nextPresentHoldings = [
        openedTrade,
        ...presentHoldings,
      ];

      updatePresentHoldings(
        nextPresentHoldings,
      );
      updateHistoricalLedgers(
        nextHistoricalLedgers,
      );
    },
    [
      ticker,
      presentHoldings,
      presentLedger,
      updatePresentHoldings,
      updateHistoricalLedgers,
    ],
  );
  const closeTrade = useCallback(
    (
      sharePrice: number,
      shareCount: number,
    ) =>
    {
      if (presentHoldings.length <= 0)
      {
        return;
      }

      const {
        ...nextHistoricalLedgers
      } = presentLedger;
      const [
        ...nextPresentHoldings
      ] = presentHoldings;
      const nextHistoricalHoldings: HistoricalTradeFinished[] = [];
      const [
        ...sortedPresentHoldings
      ] = presentHoldings.sort(
        (
          previousTrade,
          nextTrade,
        ) =>
        {
          return previousTrade.openPrice - nextTrade.openPrice;
        },
      );
      let remainingOrderShareCount = Math.abs(
        shareCount,
      );

      while (
        remainingOrderShareCount > 0 &&
          sortedPresentHoldings.length > 0
      )
      {
        const {
          totalBalance: previousTotalBalance,
          totalReturns: previousTotalReturns,
          totalCount: previousTotalCount,
        } = nextHistoricalLedgers;

        // Fill as much of the order as we can with the lowest-opened trade
        const lowestTrade = sortedPresentHoldings.shift() as HistoricalTradeStarted;
        const countPossible = Math.min(
          lowestTrade.openCount,
          remainingOrderShareCount,
        );
        const closedTrade = getClosedTrade(
          lowestTrade,
          sharePrice,
          countPossible,
        );

        // Add closed trade to front of collection
        nextHistoricalHoldings.unshift(
          closedTrade,
        );

        // Update ledger values and remaining shares in order
        remainingOrderShareCount -= countPossible;
        nextHistoricalLedgers.totalBalance = previousTotalBalance + (closedTrade.closePrice * closedTrade.closeCount);
        nextHistoricalLedgers.totalReturns = previousTotalReturns + closedTrade.changeBalance;
        nextHistoricalLedgers.totalChange = nextHistoricalLedgers.totalReturns / nextHistoricalLedgers.totalBalance;
        nextHistoricalLedgers.totalCount = previousTotalCount - closedTrade.closeCount;

        // Remove the closed trade from current trades
        const lowestTradeIndex = nextPresentHoldings.indexOf(
          lowestTrade,
        );

        nextPresentHoldings.splice(
          lowestTradeIndex,
          1,
        );

        // Check if there are any shares left in the trade we just removed
        const remainingTradeShareCount = closedTrade.openCount - closedTrade.closeCount;

        if (remainingTradeShareCount > 0)
        {
          // Copy the previous share, update its openBalance and openCount, and add it back in the same place
          const remainingBalance = closedTrade.openPrice * remainingTradeShareCount;
          const nextTrade: HistoricalTradeStarted = {
            ...lowestTrade,
            openBalance: remainingBalance,
            openCount: remainingTradeShareCount,
          };

          nextPresentHoldings.splice(
            lowestTradeIndex,
            0,
            nextTrade,
          );
        }
      }

      // Update state values
      updatePresentHoldings(
        nextPresentHoldings,
      );
      updateHistoricalHoldings(
        nextHistoricalHoldings,
      );
      updateHistoricalLedgers(
        nextHistoricalLedgers,
      );
    },
    [
      presentHoldings,
      presentLedger,
      updateHistoricalLedgers,
      updatePresentHoldings,
      updateHistoricalHoldings,
    ],
  );
  const handleLoad = useCallback(
    (
      nextPrices?: HistoricalPrice[],
      nextDate?: Date,
    ) =>
    {
      if (!nextPrices ||
          !nextDate)
      {
        return;
      }

      const priceIndexes = getPriceIndexes(
        nextPrices,
        nextDate,
      );

      setNextPrices(
        nextPrices,
        priceIndexes,
        {
          setNextPriceIndexes,
          setHistoricalPrices,
        },
      );
    },
    [],
  );
  const handleSubmit = useCallback(
    (
      sharePrice: number,
      shareCount: number,
    ) =>
    {
      const currentTradeType = shareCount / Math.abs(
        shareCount,
      );
      const previousTradeOpposite = highestPresentHolding &&
                                    highestPresentHolding.openDirection * -1;

      if (currentTradeType === previousTradeOpposite)
      {
        closeTrade(
          sharePrice,
          shareCount,
        );
      }
      else
      {
        openTrade(
          sharePrice,
          shareCount,
        );
      }
    },
    [
      highestPresentHolding,
      openTrade,
      closeTrade,
    ],
  );
  const handleContinue = useCallback(
    () =>
    {
      if (
        prices &&
          nextPriceIndexes &&
          canGetNextPrice(
            prices,
            nextPriceIndexes,
          )
      )
      {
        setNextPrices(
          prices,
          nextPriceIndexes,
          {
            setNextPriceIndexes,
            setHistoricalPrices,
          },
        );
      }
    },
    [
      prices,
      nextPriceIndexes,
    ],
  );

  useEffect(
    () =>
    {
      if (!historicalPrices)
      {
        handleLoad(
          prices,
          date,
        );
      }
    },
    [
      historicalPrices,
      handleLoad,
      prices,
      date,
    ],
  );

  useScrollToTop();
  useUnload(
    setHistoricalPrices,
    setNextPriceIndexes,
  );
  useError(
    error,
  );

  return (
    <TradeViewDisplay
      aspectRatioRef={aspectRatioRef}
      historicalPrices={historicalPrices}
      chartWidth={chartWidth}
      chartHeight={chartHeight}
      historicalHoldings={historicalHoldings}
      presentPrice={presentPrice}
      presentLedger={presentLedger}
      presentHoldings={presentHoldings}
      highestPresentHolding={highestPresentHolding}
      handleSubmit={handleSubmit}
      handleContinue={handleContinue}
    />
  );
};

export default TradeViewLogic;