var fs = require("fs");
var path = require('path');
var webpack = require("webpack");
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/js/main.js',
  output: {
    path: path.resolve("dist"),
    filename: 'app.js'
  },
  module: {
    loaders: [
      { test: /bootstrap\/js\//, loader: 'imports-loader?jQuery=jquery' },
      { test: /\.(js|jsx|es6)$/, exclude: /node_modules(?!\/uport-lib)/, loader: "babel-loader"},
      { test: /\.scss$/, loader: "style-loader!css-loader!sass-loader" },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, include: [/bootstrap/, /font-awesome/], loader: 'url-loader?limit=10000&minetype=application/font-woff' },
      { test: /\.(ttf|eot|svg|woff(2)?)(\S+)?$/, include: [/bootstrap/, /font-awesome/, /react-notifications/], loader: 'file-loader' }
    ],
    noParse: [/\.min\.js$/]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './src/index.html', to: "index.html" },
      { from: './src/images', to: "images" },
    ]),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
  })
  ],
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty"
  },
  devtool: '#inline-source-map'
};
