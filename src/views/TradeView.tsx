import React, { useState, useEffect, useCallback } from "react";
import useResizeObserver from "use-resize-observer";
import { isSameDay, parse } from "date-fns";
import { HistoricalPrice } from "iex";
import { useStyletron } from "baseui/dist";
import { Block } from "baseui/dist/block";
import { FlexGridItem } from "baseui/dist/flex-grid";
import { IEX_DATE_FORMAT } from "services/Constants";
import { handleUnloadCreator } from "services/Utilities";
import ContentContainer from "templates/ContentContainer";
import BreadcrumbContainer from "templates/BreadcrumbContainer";
import FlexGrid, { MultiplyWidth } from "components/BaseUI/FlexGrid";
import Error from "components/BaseUI/Typography";
import StockChart from "components/StockChart";
import TradeControl from "components/TradeControl";
import TimeControl from "components/TimeControl";

type Props = {
  prices?: HistoricalPrice[];
  date?: Date;
  error?: string;
};

const TradeView: React.FC<Props> = ({ prices, date, error }) => {
  const [, theme] = useStyletron();
  const [pastPrices, setPastPrices] = useState<HistoricalPrice[]>();
  const { ref, width = 1, height = 1 } = useResizeObserver<HTMLDivElement>();

  const handleLoad = useCallback((prices?: HistoricalPrice[], date?: Date) => {
    if (prices && date) {
      const startDate = prices.findIndex((price) => {
        const priceDate = parse(price.date, IEX_DATE_FORMAT, new Date());
        return isSameDay(priceDate, date);
      });
      const endDate = startDate > -1 ? startDate - 730 : 0;
      const nextPrices = prices.slice(endDate, startDate);
      setPastPrices(nextPrices);
    }
  }, []);

  useEffect(() => {
    handleLoad(prices, date);
  }, [handleLoad, prices, date]);

  useEffect(() => handleUnloadCreator([setPastPrices]), []);

  if (error) {
    return <Error>{error}</Error>;
  }

  return (
    <ContentContainer>
      <Block width="100%" marginBottom={theme.sizing.scale800}>
        <BreadcrumbContainer />
      </Block>
      <FlexGrid flexWrap={[true, true, true, false]}>
        <FlexGridItem
          height={0}
          paddingBottom={["100%", "75%", "56.25%"]}
          position="relative"
        >
          <Block
            ref={ref}
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="100%"
            height="100%"
            position="absolute"
            top={0}
            right={0}
            bottom={0}
            left={0}
          >
            <StockChart resolution={[width, height]} prices={pastPrices} />
          </Block>
        </FlexGridItem>
        <FlexGridItem
          flex="1 1"
          maxWidth={["100%", "100%", "25%"]}
          minWidth={["auto", "30%", "25%"]}
        >
          <TimeControl />
          <TradeControl />
        </FlexGridItem>
      </FlexGrid>
    </ContentContainer>
  );
};

export default TradeView;
