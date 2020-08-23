import React, {
  forwardRef,
} from "react";
import {
  Box,
  Button,
  JSXBoxProps,
  JSXButtonProps,
  JSXTextProps,
  Text,
} from "grommet";
import styled from "styled-components";

export const StyledContainer: React.FC<JSXBoxProps> = (
  props,
) =>
{
  return (
    <Box
      width="xsmall"
      direction="row"
      {...props}
    />
  );
};

export const StyledText: React.FC<JSXTextProps> = (
  props,
) =>
{
  return (
    <Text
      size="xsmall"
      {...props}
    />
  );
};

export const GroupedButton = styled(
  Button,
)`
padding: 4px 0px;
border-radius: 0px;

&:first-child {
  padding: 0 0 0 8px;
  border-radius: 25px 0px 0px 25px;
}

&:last-child {
  padding: 0 8px 0 0;
  border-radius: 0px 25px 25px 0px;
}

&:hover {
  span {
    font-weight: bold;
  }

  path {
    stroke-width: 3px;
  }
}
`;

export const StyledButton: React.FC<JSXButtonProps> = forwardRef(
  (
    {
      children,
      ...props
    },
    ref,
  ) =>
  {
    return (
      <GroupedButton
        primary={true}
        fill="horizontal"
        {...props}
        ref={ref}
      >
        <Box
          align="center"
          justify="center"
          fill="horizontal"
        >
          <StyledText>
            {children}
          </StyledText>
        </Box>
      </GroupedButton>
    );
  },
);
