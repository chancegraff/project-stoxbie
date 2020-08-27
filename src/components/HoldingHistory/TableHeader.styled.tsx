import React from "react";
import {
  JSXTableCellProps,
  JSXTableHeaderProps,
  JSXTableRowProps,
  TableCell,
  TableHeader,
  TableRow,
} from "grommet";
import styled from "styled-components";

export const StyledTableHeader: React.FC<JSXTableHeaderProps> = (
  props,
) =>
{
  return (
    <TableHeader
      {...props}
    />
  );
};

export const StyledTableRow: React.FC<JSXTableRowProps> = (
  props,
) =>
{
  return (
    <TableRow
      {...props}
    />
  );
};

const StickyTableCell: React.FC<JSXTableHeaderProps> = styled(
  TableCell,
)`
position: sticky;
top: 0;
`;

export const StyledTableCell: React.FC<JSXTableCellProps> = (
  props,
) =>
{
  return (
    <StickyTableCell
      plain={true}
      scope="col"
      {...props}
    />
  );
};