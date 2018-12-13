// @flow

import { createRPCReducer } from "fusion-plugin-rpc-redux-react";
const initialState = {
  loading: false,
  data: [],
  error: undefined
};
export default createRPCReducer(
  "getConcerts",
  {
    start: (state, action) => ({ ...state, loading: true }),
    success: (state, action) => ({
      ...state,
      loading: false,
      data: action.payload
    }),
    failure: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload.error
    })
  },
  initialState
);
