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
import { format } from "date-fns";

// fetching stuff
import { withRPCRedux } from "fusion-plugin-rpc-redux-react";
import { prepared } from "fusion-react";
import { connect } from "react-redux";
import { compose } from "redux";

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
    search: ""
  };
  componentDidMount() {
    this.props.getConcerts();
  }
  render() {
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
          {this.props.concerts.data
            .filter(concert =>
              concert.name
                .toLowerCase()
                .includes(this.state.search.toLowerCase())
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

const hoc = compose(
  withRPCRedux("getConcerts"), // generates Redux actions and a React prop for the `getConcerts` RPC call
  connect(({ concerts }) => ({ concerts })), // expose the Redux state to React props
  prepared(props => {
    if (props.concerts.loading || props.concerts.data.length) {
      return;
    }
    return props.getConcerts();
  }) // invokes the passed in method on component hydration
);

export default hoc(Home);
