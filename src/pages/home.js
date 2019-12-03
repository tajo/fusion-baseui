// @flow
import * as React from "react";
import { format, parseISO } from "date-fns";

// Base UI components
import { Card } from "baseui/card";
import { Block } from "baseui/block";
import { HeaderNavigation } from "baseui/header-navigation";
import { StatefulInput } from "baseui/input";
import { Notification, KIND } from "baseui/notification";
import Search from "./search";

// redux and fusion helpers
import { compose } from "redux";
import { connect } from "react-redux";
import { prepared } from "fusion-react";
import { withRPCRedux } from "fusion-plugin-rpc-redux-react";

// types
import type { ConcertT } from "../redux/concerts";

const formatDate = (dateOfShow: string) => {
  return format(parseISO(dateOfShow), "mm/dd/yyyy hh:mm")
}

class Home extends React.Component<
  {
    getConcerts: () => void,
    concerts: { data: ConcertT[], error: ?string }
  },
  { search: string }
> {
  state = {
    search: ""
  };
  componentDidMount() {
    // optional re-fetch on the client
    this.props.getConcerts();
  }
  render() {
    const { concerts } = this.props;
    if (concerts.error) {
      return (
        <Block display="flex" justifyContent="center">
          <Notification kind={KIND.negative}>{concerts.error}</Notification>
        </Block>
      );
    }
    return (
      <React.Fragment>
        <HeaderNavigation>
          <StatefulInput
            overrides={{ After: Search }}
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
          {concerts.data &&
            concerts.data
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
                    Root: {
                      style: { maxWidth: "280px", justifySelf: "center" }
                    }
                  }}
                >
                  📅 {formatDate(concert.dateOfShow)}
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
  // generates Redux actions and
  // a React prop for the `getConcerts` RPC call
  withRPCRedux("getConcerts"),
  // expose the Redux state to React props
  connect(({ concerts }) => ({ concerts })),
  // invokes the passed in method on component hydration
  prepared(props => {
    if (props.concerts.loading || props.concerts.data.length) {
      return Promise.resolve();
    }
    return props.getConcerts();
  })
);

export default hoc(Home);
