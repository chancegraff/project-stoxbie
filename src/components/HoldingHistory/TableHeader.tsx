import React from "react";

import {
  StyledTableCell,
  StyledTableHeader,
  StyledTableRow,
} from "./TableHeader.styled";

type Props = {
};

const TableHeader: React.FC<Props> = (
  props,
) =>
{
  return (
    <StyledTableHeader>
      <StyledTableRow>
        <StyledTableCell>
          Shares
        </StyledTableCell>
        <StyledTableCell>
          Open
        </StyledTableCell>
        <StyledTableCell>
          Close
        </StyledTableCell>
        <StyledTableCell>
          Equity
        </StyledTableCell>
      </StyledTableRow>
    </StyledTableHeader>
  );
};

export default TableHeader;