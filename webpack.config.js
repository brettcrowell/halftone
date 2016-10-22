var webpack = require("webpack");
var path = require("path");
module.exports = {
  context: __dirname,
  devtool: 'source-map',
  entry: "./src/main.js",
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "assets/",
    filename: "halftone.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a valid name to reference
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};