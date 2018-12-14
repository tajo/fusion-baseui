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
