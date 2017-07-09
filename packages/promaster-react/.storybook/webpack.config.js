// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

/*
module.exports = {
  plugins: [
    // your custom plugins
  ],
  module: {
    loaders: [
      // add your custom loaders.
    ],
  },
};
*/

/*
module.exports = {
  stats: "minimal",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFileName: "./stories/tsconfig.json"
        }
      }
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx"]
  }
};
*/


const atl = require('awesome-typescript-loader');

// load the default config generator.
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);

  // Extend it as you need.

  // For example, add typescript loader:
  config.module.rules.push({
    test: /\.tsx?$/,
    loader: "ts-loader",
    options: {
      configFileName: "./stories/tsconfig.json"
    }
  });
  config.resolve.extensions.push(".ts", ".tsx");
  if (!config.resolve.plugins) {
    config.resolve.plugins = [];
  }
  config.resolve.plugins.push(new atl.TsConfigPathsPlugin({ configFileName: "./stories/tsconfig.json" }));
  // config.resolve.extensions.push = {
  //   extensions: [".ts", ".tsx"],
  //   plugins: [
  //     new atl.TsConfigPathsPlugin({ configFileName: "./src/client/tsconfig.json" })
  //   ]
  // };

  return config;
};
