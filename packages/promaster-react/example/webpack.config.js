const path = require('path');
const webpack = require('webpack');
const atl = require('awesome-typescript-loader');

module.exports = {
  // context - The base directory, an absolute path, for resolving entry points and loaders from configuration.
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
        loader: 'awesome-typescript-loader',
        exclude: /^node_modules/,
        query: {
          configFileName: './example/tsconfig.json'
        }
      }
    ]
  },
  node: {
    fs: "empty",
  },
  performance: {
    hints: false
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [
      new atl.TsConfigPathsPlugin({configFileName: "./src/client/tsconfig.json"})
    ],
    alias: {
      "@promaster/promaster-react": path.resolve( __dirname, '../')
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        // Useful to reduce the size of client-side libraries, e.g. react
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new atl.CheckerPlugin(),
    // new webpack.DllReferencePlugin({
    //   context: path.join(__dirname, '../'),
    //   sourceType: "amd",
    //   name: '../vendor/vendor.bundle.js',
    //   manifest: require(path.join(__dirname, '../src/', './vendor/vendor-manifest.json'))
    // })
  ]
};
