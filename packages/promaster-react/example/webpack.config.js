const path = require('path');
const webpack = require('webpack');
const atl = require('awesome-typescript-loader');

module.exports = {
  // context - The base directory, an absolute path, for resolving entry points and loaders from configuration.
  stats: "minimal",
  context: path.resolve(__dirname, '.'),
  devtool: 'sourcemap',
  entry: './src/index',
  output: {
    path: path.join(__dirname, '../dist/example'),
    filename: 'example-bundle.js',
    // the url to the output directory resolved relative to the HTML page
    publicPath: '/assets/'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFileName2: "./example/tsconfig.json"
        }
      }
    ]
  },
  node: {
    fs: "empty",
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [
      new atl.TsConfigPathsPlugin({ configFileName: "./src/client/tsconfig.json" })
    ],
    alias: {
      "@promaster/promaster-react": path.resolve(__dirname, '../src')
    }
  },
  plugins: [
    new atl.CheckerPlugin(),
  ],
  devServer: {
    stats: {
      assets: false,
      hash: false,
      chunks: false,
      errors: true,
      errorDetails: true,
    },
    overlay: true
  }
};
