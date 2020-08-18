import React from "react";
import {
  getYear,
} from "date-fns";
import {
  Box, Text,
} from "grommet";

type Props = unknown;

const currentYear = getYear(
  new Date(),
);

const FooterName: React.FC<Props> = (
  props,
) =>
{
  return (
    <Box
      pad={
        {
          vertical: "medium",
        }
      }
    >
      <Text size="xsmall">
        {`© ${currentYear} Chance Technologies, LLC`}
      </Text>
    </Box>
  );
};

export default FooterName;
