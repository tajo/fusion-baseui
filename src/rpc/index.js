// Define your handlers
// src/rpc/index.js
export default {
  greet: async ({ name }, ctx) => {
    return { greeting: "hello ${name}" };
  }
};
