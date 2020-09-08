import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  HistoricalPrice,
} from "@chancey/iex-cloud";
import {
  HistoricalHoldingType,
  Holding,
  Ledger,
  PresentHoldingType,
} from "holding-types";
import {
  List,
} from "immutable";
import styled from "styled-components/macro"; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  useDebouncedCallback,
} from "use-debounce/lib";

import {
  CombinedBodyState,
  DEBOUNCE_MEDIUM_MS,
} from "utils/Constants";
import {
  useHover,
} from "utils/Hooks";

import CombinedBody from "./CombinedBody";
import HistoricalBody from "./HistoricalBody";
import {
  GrommetContainer,
  GrommetTable,
  GrommetTheme,
} from "./HoldingTable.styled";
import PresentBody from "./PresentBody";
import TableFooter from "./TableFooter";
import TableHeader from "./TableHeader";

type Props = {
  presentPrice: HistoricalPrice | undefined;
  presentLedger: Ledger;
  presentHoldings: List<PresentHoldingType>;
  historicalHoldings: List<HistoricalHoldingType>;
  highestPresentHolding: PresentHoldingType | undefined;
  handleClose: (present: Pick<Holding, "ticker" | "present">) => void;
};

const HoldingTable: React.FC<Props> = (
  {
    presentPrice,
    presentLedger,
    presentHoldings,
    historicalHoldings,
    highestPresentHolding,
    handleClose,
  },
) =>
{
  const [
    rowHoverState,
    handleMouseEnterRow,
    handleMouseLeaveRow,
  ] = useHover();

  const [
    combinedBodyState,
    setCombinedBodyState,
  ] = useState<CombinedBodyState>(
    CombinedBodyState.Retracting,
  );

  const [
    debouncedMouseLeaveRow,
    cancelMouseLeaveRow,
  ] = useDebouncedCallback(
    handleMouseLeaveRow,
    DEBOUNCE_MEDIUM_MS,
  );

  const debouncedMouseEnterRow = useCallback(
    () =>
    {
      cancelMouseLeaveRow();
      handleMouseEnterRow();
    },
    [
      cancelMouseLeaveRow,
      handleMouseEnterRow,
    ],
  );
  const handleExtendCombined = useCallback(
    () =>
    {
      setCombinedBodyState(
        CombinedBodyState.Extending,
      );
    },
    [],
  );
  const handleRetractCombined = useCallback(
    () =>
    {
      setCombinedBodyState(
        CombinedBodyState.Retracting,
      );
    },
    [],
  );
  const handleToggleCombined = useCallback(
    () =>
    {
      if (combinedBodyState === CombinedBodyState.Retracting)
      {
        handleExtendCombined();
      }
      else
      {
        handleRetractCombined();
      }
    },
    [
      combinedBodyState,
      handleExtendCombined,
      handleRetractCombined,
    ],
  );

  useEffect(
    () =>
    {
      if (presentHoldings.isEmpty())
      {
        handleRetractCombined();
      }
    },
    [
      presentHoldings,
      handleRetractCombined,
    ],
  );

  return (
    <GrommetTheme css="">
      <GrommetContainer
        css=""
        onScroll={handleMouseLeaveRow}
      >
        <GrommetTable css="">
          <TableHeader css="" />
          <PresentBody
            css=""
            representativeHolding={highestPresentHolding}
            presentPrice={presentPrice}
            presentLedger={presentLedger}
            presentHoldings={presentHoldings}
            rowHoverState={rowHoverState}
            combinedBodyState={combinedBodyState}
            handleClose={handleClose}
            handleToggleCombined={handleToggleCombined}
            handleMouseEnterRow={debouncedMouseEnterRow}
            handleMouseLeaveRow={debouncedMouseLeaveRow}
          />
          <CombinedBody
            css=""
            combinedBodyState={combinedBodyState}
            presentHoldings={presentHoldings}
            presentLedger={presentLedger}
            presentPrice={presentPrice}
            handleClose={handleClose}
          />
          <HistoricalBody
            css=""
            historicalHoldings={historicalHoldings}
          />
          <TableFooter
            css=""
            historicalHoldings={historicalHoldings}
            presentLedger={presentLedger}
          />
        </GrommetTable>
      </GrommetContainer>
    </GrommetTheme>
  );
};

export default HoldingTable;
