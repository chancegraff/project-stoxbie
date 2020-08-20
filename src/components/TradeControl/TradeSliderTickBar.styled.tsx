import {
  withStyle,
} from "baseui/dist";
import {
  StyledTickBar,
} from "baseui/dist/slider";

export const LeftAlignedTickBar = withStyle(
  StyledTickBar,
  () =>
  {
    return {
      width: "100%",
      alignItems: "center",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      paddingLeft: "18px",
      paddingRight: "16px",
    };
  },
);