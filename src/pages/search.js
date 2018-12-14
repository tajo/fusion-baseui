// @flow
import * as React from "react";
import { styled } from "fusion-plugin-styletron-react";
import SearchIcon from "baseui/icon/search";

const Icon = styled<any, any>("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  marginRight: "1em"
});

const SearchComponent = () => (
  <Icon>
    <SearchIcon size="scale800" color="#aaa" />
  </Icon>
);

export default SearchComponent;
