// @flow
import App from "fusion-react";
import Router from "fusion-plugin-react-router";
import Styletron from "fusion-plugin-styletron-react";
import UniversalEvents, {
  UniversalEventsToken
} from "fusion-plugin-universal-events";
import Redux, { ReduxToken, ReducerToken } from "fusion-plugin-react-redux";
import RPC, { RPCToken, RPCHandlersToken } from "fusion-plugin-rpc-redux-react";
import { FetchToken } from "fusion-tokens";
import reducer from "./redux/index.js";
import handlers from "./rpc/index.js";
import ProxyPlugin from "./proxyPlugin";

import fetch from "isomorphic-fetch";

import root from "./root.js";

export default () => {
  const app = new App(root);
  app.register(Styletron);
  app.register(Router);
  app.register(ProxyPlugin);

  app.register(RPCToken, RPC);
  app.register(UniversalEventsToken, UniversalEvents);
  __NODE__
    ? app.register(RPCHandlersToken, handlers)
    : app.register(FetchToken, fetch);
  app.register(ReduxToken, Redux);
  app.register(ReducerToken, reducer);
  return app;
};
