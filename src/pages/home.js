// @flow
import * as React from "react";
import { styled } from "fusion-plugin-styletron-react";
import { Button, KIND } from "baseui/button";
import { Card } from "baseui/card";
import { Block } from "baseui/block";
import Search from "baseui/icon/search";
import {
  HeaderNavigation,
  StyledNavigationItem as NavigationItem,
  StyledNavigationList as NavigationList
} from "baseui/header-navigation";
import { StatefulInput } from "baseui/input";
import { Accordion, Panel } from "baseui/accordion";
import { prepared } from "fusion-react";
import { format } from "date-fns";

const Icon = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  marginRight: "1em"
});

const SearchComponent = () => (
  <Icon>
    <Search size="scale800" color="#aaa" />
  </Icon>
);

class Home extends React.Component {
  state = {
    concerts: [],
    search: ""
  };
  componentDidMount() {
    fetch("/api/concerts")
      .then(response => response.json())
      .then(result => this.setState({ concerts: result.results }));
  }
  render() {
    const { concerts, search } = this.state;
    return (
      <React.Fragment>
        <HeaderNavigation>
          <StatefulInput
            overrides={{ After: SearchComponent }}
            placeholder="Concerts in Iceland"
            onChange={e => this.setState({ search: e.target.value })}
          />
        </HeaderNavigation>
        <Block
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))"
          justifyItems="center"
          gridGap="scale1000"
          margin="scale1000"
        >
          {concerts
            .filter(concert =>
              concert.name.toLowerCase().includes(search.toLowerCase())
            )
            .map(concert => (
              <Card
                headerImage={concert.imageSource}
                title={concert.name}
                key={concert.eventDateName + concert.dateOfShow}
                overrides={{
                  Root: { style: { maxWidth: "280px", justifySelf: "center" } }
                }}
              >
                📅 {format(concert.dateOfShow, "MM/DD/YYYY hh:mm A")}
                <br />
                📍 {concert.eventHallName}
              </Card>
            ))}
        </Block>
      </React.Fragment>
    );
  }
}

// import React from "react";
// import { prepared } from "fusion-react";
// const Concerts = props => {
//   console.log(props);
//   return null;
// };
// export default prepared(() => fetch("https://apis.is/concerts"))(Concerts);

// export default prepared(() => fetch("https://localhost:3000/api/user/1"))(
//   Concert
//);
export default Home;
