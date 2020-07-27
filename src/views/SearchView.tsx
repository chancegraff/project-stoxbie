import React from "react";
import { Search } from "iex-cloud";
import { useStyletron } from "baseui/dist";
import { Block } from "baseui/dist/block";
import { Display2, Label2 } from "baseui/dist/typography";
import TickerInput from "components/TickerInput";
import ContentContainer from "templates/ContentContainer";

type Props = {
  handleSearch: (
    nextValue: string,
    setOptions: React.Dispatch<React.SetStateAction<Search[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
};

const SearchView: React.FC<Props> = (props) => {
  const [, theme] = useStyletron();
  return (
    <ContentContainer>
      <Block width="50%">
        <Block marginBottom={theme.sizing.scale800}>
          <Display2>Ticker Search</Display2>
          <Label2>Select the stock ticker to trade.</Label2>
        </Block>
        <Block>
          <TickerInput handleSearch={props.handleSearch} />
        </Block>
      </Block>
    </ContentContainer>
  );
};

export default SearchView;
