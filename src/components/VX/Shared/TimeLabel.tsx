import { TickRendererProps } from "@vx/axis/lib/types";
import { Text } from "@vx/text";
import { styled } from "baseui/dist";
import { format, parse } from "date-fns";
import React, { useMemo } from "react";
import { StyleObject } from "styletron-react";

type Props = TickRendererProps;

const DesktopTimeLabel: React.FC<Props> = (
  {
    formattedValue,
    ...props
  },
) => {
  const MediaQueriedText = useMemo(
    () => {
      return styled(
        Text,
        (
          {
            $theme,
          },
        ) => {
          return {
            [$theme.mediaQuery.large]: {
              display: "unset",
            },
            [$theme.mediaQuery.medium]: {
              display: "none",
            },
            [$theme.mediaQuery.small]: {
              display: "none",
            },
          };
        },
      );
    },
    [],
  );

  return (
    <MediaQueriedText {...props}>
      {formattedValue}
    </MediaQueriedText>
  );
};

const MobileTimeLabel: React.FC<Props> = (
  {
    formattedValue,
    ...props
  },
) => {
  const formattedValueAsDate = useMemo(
    () => {
      if (formattedValue) {
        const yearPattern = new RegExp(
          /^[\w]+ '[\d]+$/,
        );
        const yearMatch = yearPattern.test(
          formattedValue.toString(),
        );

        if (yearMatch) {
          const valueAsDate = parse(
            formattedValue.toString(),
            "MMM ''yy",
            new Date(),
          );

          return format(
            valueAsDate,
            "y",
          );
        }
      }
    },
    [
      formattedValue,
    ],
  );
  const MediaQueriedText = useMemo(
    () => {
      return styled(
        Text,
        (
          {
            $theme,
          },
        ) => {
          const mediaQueries: StyleObject = {
          };

          mediaQueries[$theme.mediaQuery.large] = {
            display: "none",
          };
          if (!formattedValueAsDate) {
            mediaQueries[$theme.mediaQuery.medium] = {
              display: "unset",
            };
            mediaQueries[$theme.mediaQuery.small] = {
              display: "unset",
            };
          }

          return mediaQueries;
        },
      );
    },
    [
      formattedValueAsDate,
    ],
  );

  return (
    <MediaQueriedText {...props}>
      {formattedValueAsDate}
    </MediaQueriedText>
  );
};

const TimeLabel: React.FC<Props> = (
  props,
) => {
  return (
    <>
      <DesktopTimeLabel {...props} />
      <MobileTimeLabel {...props} />
    </>
  );
};

export default TimeLabel;
