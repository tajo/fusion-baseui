// @flow
import { ResponseError } from "fusion-plugin-rpc-redux-react";

export default {
  getConcerts: async () => {
    try {
      const response = await fetch("https://apis.is/concerts");
      // Error: Network
      // const response = await fetch("http://exampleofnetworkerror.com");

      // Error: Status code is not 200
      //const response = await fetch("http://httpstat.us/500");
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
