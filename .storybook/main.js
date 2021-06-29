// import { configure } from "@storybook/react";

// // function loadStories() {
// //   require("../packages/_stories/lib");
// //   require("../packages/_stories/lib/react-properties-selector");
// //   require("../packages/_stories/lib/react-property-selectors");
// // }

// // configure(loadStories, module);

// function loadStories() {
//   // const req = require.context("../packages", true, /^\.\/[^\/]+\/lib\/.*stories\.jsx?$/);
//   // const req = require.context("../packages", true, /\.stories\.(ts|tsx)$/);
//   // require("../packages/_stories/src/react-property-selectors");
//   const x = require("../packages/react-property-selectors/src/__stories__/amount-format-selector/olle.stories");
//   console.log("x", x);

//   // req.keys().forEach((filename) => req(filename));
// }

// configure(loadStories, module);

module.exports = {
  stories: ["../packages/*/src/**/*.stories.@(ts|tsx)"],
  // addons: ["@storybook/addon-essentials"],
};
