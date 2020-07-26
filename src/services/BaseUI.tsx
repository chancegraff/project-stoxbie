import React from "react";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { DarkTheme, BaseProvider, BaseProviderOverrides } from "baseui";
import { Override } from "baseui/overrides";
import BackgroundContainer from "templates/BackgroundContainer";

const engine = new Styletron();

const AppContainer: Override<unknown> = {
  style: {
    width: "100%",
    height: "100%",
  },
};

const overrides: BaseProviderOverrides = {
  AppContainer,
};

const BaseUI: React.FC = (props) => (
  <StyletronProvider value={engine}>
    <BaseProvider theme={DarkTheme} overrides={overrides}>
      <BackgroundContainer>{props.children}</BackgroundContainer>
    </BaseProvider>
  </StyletronProvider>
);

export default BaseUI;
