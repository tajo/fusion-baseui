import { createPlugin } from "fusion-core";

export default createPlugin({
  middleware() {
    return (ctx, next) => {
      if (ctx.method === "GET" && ctx.path === "/api/concerts") {
        return fetch("https://apis.is/concerts")
          .then(response => response.json())
          .then(result => {
            ctx.body = result;
            return next();
          });
      } else {
        return next();
      }
    };
  }
});
