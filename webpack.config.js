const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + "/src/index.html",
  filename: "index.html",
  inject: "body",
});

module.exports = {
  context: path.resolve(__dirname, "src"),

  plugins: [
    HTMLWebpackPluginConfig,
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "src"),
    },
    compress: true,
    port: 8080,
  },

  entry: {
    main: path.resolve(__dirname, "src/app.js"),
  },

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "deploy"),
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: function () {
                return [require("precss"), require("autoprefixer")];
              },
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },
    ],
  },
};
