export default {
  getConcerts: async (_, ctx) => {
    //const response = await fetch("/api/concerts");
    const response = await fetch("https://apis.is/concerts");
    const json = await response.json();
    return json.results;
  }
};
