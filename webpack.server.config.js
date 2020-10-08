const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'none',
  entry: { server: './server.ts' },
  externals: [],
  target: 'node',
  resolve: { extensions: ['.js', '.ts'] },
  optimization: {
    minimize: false
  },
  output: {
    path: path.join(__dirname, `functions/dist`),
    library: 'app',
    libraryTarget: 'umd',
    filename: '[name].js'
  },
  // This is required to solve SDK_VERSION issue 
  // https://github.com/firebase/firebase-js-sdk/issues/1754
  resolve: {
    alias: {
      ['firebase/app']: path.resolve(__dirname, 'node_modules/firebase/app/dist/index.cjs.js')
    }
  },
  module: {
    noParse: /polyfills-.*\.js/,
    rules: [
      { test: /\.ts$/, loader: 'ts-loader', exclude: /^(?!.*\.spec\.ts$).*\.ts$/ },
      {
        test: /(\\|\/)@angular(\\|\/)core(\\|\/).+\.js$/,
        parser: { system: true }
      }
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      /(.+)?angular(\\|\/)core(.+)?/,
      path.join(__dirname, 'src'), // location of your src
      {} // a map of your routes
    ),
    new webpack.ContextReplacementPlugin(
      /(.+)?express(\\|\/)(.+)?/,
      path.join(__dirname, 'src'),
      {}
    )


  ]
};