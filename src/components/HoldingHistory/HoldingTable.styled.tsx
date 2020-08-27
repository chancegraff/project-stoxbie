import React from "react";
import {
  Box,
  JSXBoxProps,
  JSXTableProps,
  Table,
  ThemeContext,
} from "grommet";
import {
  normalizeColor,
} from "grommet/utils";
import styled from "styled-components";

export const StyledTheme: React.FC = (
  props,
) =>
{
  return (
    <ThemeContext.Extend
      value={
        {
          table: {
            header: {
              background: {
                color: "background-front",
              },
              border: undefined,
            },
            body: {
              fill: "vertical",
              border: {
                side: "vertical",
                color: "background-contrast",
              },
            },
            footer: {},
            // body: {
            //   align: 'center',
            //   pad: { horizontal: 'large', vertical: 'xsmall' },
            //   border: 'horizontal',
            // },
            // extend: () => `font-family: Arial`,
            // footer: {
            //   align: 'start',
            //   border: undefined,
            //   pad: { horizontal: 'large', vertical: 'small' },
            //   verticalAlign: 'bottom',
            // },
            // header: {
            //   align: 'center',
            //   border: 'bottom',
            //   fill: 'horizontal',
            //   pad: { horizontal: 'large', vertical: 'xsmall' },
            //   verticalAlign: 'bottom',
            //   background: {
            //     color: 'accent-1',
            //     opacity: 'strong',
            //   },
            // },
          },
        }
      }
      {...props}
    />
  );
};

const RelativeContainer: React.FC<JSXBoxProps> = styled(
  Box,
)`
position: relative;
`;

export const StyledContainer: React.FC<JSXBoxProps> = (
  props,
) =>
{
  return (
    <RelativeContainer
      fill="vertical"
      overflow="auto"
      {...props}
    />
  );
};

const SmallTable: React.FC<JSXTableProps> = styled(
  Table,
)`
min-width: 308px;
font-size: ${
  (
    props,
  ) =>
  {
    return props.theme.text.small.size;
  }
};
line-height: ${
  (
    props,
  ) =>
  {
    return props.theme.text.small.height;
  }
};

& tbody tr:nth-of-type(odd) {
  background-color: ${
    (
      props,
    ) =>
    {
      return normalizeColor(
        props.theme.global.colors["background-contrast"],
        props.theme,
      );
    }
  };
}
`;

export const StyledTable: React.FC<JSXTableProps> = (
  props,
) =>
{
  return (
    <SmallTable
      {...props}
    />
  );
};