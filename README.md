# Fusion.js + Base UI Example App

Get started by running the application with `yarn` and `yarn dev` in a terminal.

## What are we going to build?

![Concerts in Iceland](preview.png)

# Step-by-step tutorial

## Assumptions

- You environment has Node.js 8.11 and the latest Yarn
- Advanced knowledge of JavaScript
- Intermediate knowledge of React and Redux

## Learning objectives

- Bootstrap a basic Fusion.js app
- Fetch data from a public REST API and store it in Redux
- Pre-render the page on the server
- Rehydrate the redux store on the client
- Build a simple UI using Base UI components
- Handle errors

## Fusion.js setup

```
yarn create fusion-app fusion-baseui
cd fusion-baseui
yarn dev
```

That should open [https://localhost:30](https://localhost:300)00 in your browser with "Fusion.js - Let's get started" message.

Open `src/pages/home.js`, change the `Get Started` message to something else and save it. You should immediately see it in the browser because of hot reloading.

## Base UI setup

Base UI is a component library based on React. We will use it to put together our user interface. Add it to your project via

```
yarn add baseui
```

Now, replace the content of `src/pages/home.js` with

```jsx
// @flow
import * as React from "react";

// Base UI components
import { Card } from "baseui/card";
import { Block } from "baseui/block";

const CONCERTS = [
  {
    eventDateName: "Jón Jónsson og Friðrik Dór - fjölskyldutónleikar",
    name: "Tónleikar",
    dateOfShow: "2018-12-15T14:00:00",
    eventHallName: "Bæjarbíó (Hafnarfirði)",
    imageSource:
      "https://d30qys758zh01z.cloudfront.net/images/medium/1.10700.jpg"
  },
  {
    eventDateName: "Jón Jónsson og Friðrik Dór - fjölskyldutónleikar",
    name: "Tónleikar-UPPSELT",
    dateOfShow: "2018-12-15T16:00:00",
    eventHallName: "Bæjarbíó (Hafnarfirði)",
    imageSource:
      "https://d30qys758zh01z.cloudfront.net/images/medium/1.10700.jpg"
  },
  {
    eventDateName: "Hera Björk - Ilmur af jólum - Í borg og bæ",
    name: "Hólmavík",
    dateOfShow: "2018-12-15T17:00:00",
    eventHallName: "Hólmavíkurkirkja",
    imageSource:
      "https://d30qys758zh01z.cloudfront.net/images/medium/1.10648.jpg"
  },
  {
    eventDateName: "Hátíðartónleikar Eyþórs Inga",
    name: "Víðistaðakirkja",
    dateOfShow: "2018-12-15T20:00:00",
    eventHallName: "Víðistaðakirkja (Hafnarfirði)",
    imageSource:
      "https://d30qys758zh01z.cloudfront.net/images/medium/1.10630.jpg"
  },
  {
    eventDateName: "Jólin til þín",
    name: "Höfn",
    dateOfShow: "2018-12-15T20:00:00",
    eventHallName: "Íþróttahúsið á Höfn",
    imageSource:
      "https://d30qys758zh01z.cloudfront.net/images/medium/1.10647.jpg"
  },
  {
    eventDateName: "Jólalögin þeirra",
    name: "Tónleikar",
    dateOfShow: "2018-12-15T21:00:00",
    eventHallName: "Hendur í Höfn",
    imageSource:
      "https://d30qys758zh01z.cloudfront.net/images/medium/1.10687.jpg"
  }
];

class Home extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Block
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))"
          justifyItems="center"
          gridGap="scale1000"
          margin="scale1000"
        >
          {CONCERTS.map(concert => (
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
              📅 {concert.dateOfShow}
              <br />
              📍 {concert.eventHallName}
            </Card>
          ))}
        </Block>
      </React.Fragment>
    );
  }
}

export default Home;
```

The Home component now renders a list of (hard-coded) concerts. Every concerts has a few properties:

- `eventDateName: string` - the name of event
- `name: string` - the name of artist
- `dateOfShow: string` - the date of event
- `eventHallName: string` - where the event takes place
- `imageSource: string` - poster for the event

We use two Base UI components:

- `<Block >` - basic building block for layouts. In our example, we utilize CSS grid properties to build a responsive grid layout.
- `<Card />` - to display the information about a single event. Note that we need to specify an unique `key` prop because it's React's requirement for array of components. Also, we use `overrides` to customize the styles of the root Card element (positioning and maximum width).

## Date formatting

As you might notice, `2018-12-15T20:00:00` is not very human readable. We can use 3rd party library to make the formatting better

```
yarn add date-fns
```

Now import it into `home.js`

```jsx
import { format } from "date-fns";
```

and replace

```
concert.dateOfShow
```

with

```
format(concert.dateOfShow, "MM/DD/YYYY hh:mm A")
```

**Note:** You can often see usage of other library `Moment.js` We try to avoid it since it dramatically increases the size of the application. `date-fns` is much smaller, modular and tree-shakeable.

## Search

First, we will create a search icon component that will be part of our search input. Create a new file `src/pages/search.js`:

```jsx
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
```

Now go back to `home.js` and add the imports

```jsx
import { HeaderNavigation } from "baseui/header-navigation";
import { StatefulInput } from "baseui/input";
import Search from "./search";
```

Our search is client-side only (API doesn't have a search parameter). We need to add a local search state

```jsx
class Home extends React.Component<{}, { search: string }> {
  state = {
    search: ""
  };
  // the rest of Home component....
```

Let's add a header that will contain the search input

```jsx
<React.Fragment>
  <HeaderNavigation>
    <StatefulInput
      overrides={{ After: Search }}
      placeholder="Concerts in Iceland"
      onChange={e => this.setState({ search: e.target.value })}
    />
  </HeaderNavigation>
  {/* the rest of render method... */}
```

Now you should see the page header rendered. The last step is to filter concerts accordingly to `this.state.search`

```jsx
CONCERTS.filter(concert =>
  concert.name.toLowerCase().includes(this.state.search.toLowerCase())
).map(/* ... */);
```

Our main UI is finished!

## Redux and fetching the data

Redux is a popular state container for JavaScript apps. Fusion.js team maintains multiple plugins that make the integration easy. Let's add them and all other necessary dependencies

```
yarn add fusion-plugin-react-redux fusion-plugin-rpc-redux-react fusion-plugin-universal-events react-redux@5 redux isomorphic-fetch
```

`fusion-plugin-universal-events` is commonly required by other Fusion.js plugins and is used as an event emitter for data such as statistics and analytics. It's necessary for other redux plugins.

`fusion-plugin-react-redux` adds basic integration of React-Redux into your Fusion.js application. It handles creating your store, wrapping your element tree in a provider, and serializing/deserializing your store between server and client.

`fusion-plugin-rpc-redux-react` RPC is a natural way of expressing that a server-side function should be run in response to a client-side function call. It's an alternative to REST.

This plugin provides a higher order component that connects RPC methods to Redux as well as React component props. It also helps to cut the typical redux boilerplate when creating action creators and reducers.

But first things first, let's create a reducer in `src/redux/concerts.js`

```jsx
// @flow
import { createRPCReducer } from "fusion-plugin-rpc-redux-react";

export type ConcertT = {
  +name: string,
  +imageSource: string,
  +eventDateName: string,
  +dateOfShow: string,
  +eventHallName: string
};

const initialState = {
  loading: false,
  data: [],
  error: null
};
export default createRPCReducer<
  { loading: boolean, data: ConcertT[], error: ?string },
  { payload: any, type: string }
>(
  "getConcerts",
  {
    start: (state, action) => ({ ...state, loading: true }),
    success: (state, action) => ({
      ...state,
      loading: false,
      data: action.payload
    }),
    failure: (state, action) => {
      return {
        ...state,
        loading: false,
        error: action.payload.message
      };
    }
  },
  initialState
);
```

And `src/redux/index.js` where we combine/re-export existing reducers so we can add even more reducers in the future

```jsx
// @flow
import { combineReducers } from "redux";
import concerts from "./concerts.js";

export default combineReducers<any, any>({
  concerts
});
```

Now we need to create an RPC handler. It's a function (endpoint) that will handle the data fetching of our concerts. It will be used by server-side rendering and it can be also called by the client. Create `src/rpc/index.js`

```jsx
// @flow
import { ResponseError } from "fusion-plugin-rpc-redux-react";

export default {
  getConcerts: async () => {
    try {
      const response = await fetch("https://apis.is/concerts");
      if (response.status == 200) {
        const json = await response.json();
        return json.results;
      }
      throw response.statusText;
    } catch (e) {
      throw new ResponseError(e);
    }
  }
};
```

The next step is to put it all together in `src/main.js`

```jsx
import Redux, { ReduxToken, ReducerToken } from "fusion-plugin-react-redux";
import RPC, { RPCToken, RPCHandlersToken } from "fusion-plugin-rpc-redux-react";
import UniversalEvents, {
  UniversalEventsToken
} from "fusion-plugin-universal-events";
import { FetchToken } from "fusion-tokens";
import reducer from "./redux/index.js";
import handlers from "./rpc/index.js";
import fetch from "isomorphic-fetch";

export default () => {
  /* ... */
  app.register(RPCToken, RPC);
  app.register(UniversalEventsToken, UniversalEvents);
  __NODE__
    ? app.register(RPCHandlersToken, handlers)
    : app.register(FetchToken, fetch);
  app.register(ReduxToken, Redux);
  app.register(ReducerToken, reducer);
  /* ... */
  return app;
};
```

At this point, you should see a blank page in the browser because we still need to connect our component to the redux and declare the dependency on `getConcerts`.

Add these imports into `src/pages/home.js`

```jsx
// redux and fusion helpers
import { compose } from "redux";
import { connect } from "react-redux";
import { prepared } from "fusion-react";
import { withRPCRedux } from "fusion-plugin-rpc-redux-react";

// types
import type { ConcertT } from "../redux/concerts";
```

And this will create an HOC that connects our page to the store and it also triggers `getConcerts` fetch when doing server-side rendering

```jsx
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
```

Let's update our flow types

```jsx
class Home extends React.Component<
  {
    getConcerts: () => void,
    concerts: { data: ConcertT[], error: ?string }
  },
  { search: string }
> {
  /* ... */
}
```

And finally, replace `CONCERTS` with `this.props.concerts.data`. Now you should see the list of events again 🎉🎉🎉.

Note the client doesn't **NOT** make an XHR call to `https://apis.is/concerts` - it's all done on the server and browser already receives all events (rendered HTML elements and also as serialized redux state). **That's it!**

The Home component has also an access to `this.props.getConcerts()`, so for example, you could re-fetch the data like this

```jsx
componentDidMount() {
  // optional re-fetch on the client
  this.props.getConcerts();
}
```

For the full example you can clone and explore this repository. It has some extra code to gracefully handle fetch errors and display a nice user notification.

## More resources

For detailed documentation please visit:

- https://fusionjs.com
- https://baseui.design/
