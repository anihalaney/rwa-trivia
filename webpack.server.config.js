const path = require('path');
const webpack = require('webpack');



module.exports = {
  entry: { server: './server.ts' },
  resolve: { extensions: ['.js', '.ts'] },
  mode: 'none',
  target: 'node',
  externals: [/(node_modules|main(\\|\/)..*(\\|\/).js)/],
  output: {
    path: path.join(__dirname, `functions/server/functions`),
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
    rules: [
      { test: /\.ts$/, loader: 'ts-loader', exclude: /^(?!.*\.spec\.ts$).*\.ts$/  },
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