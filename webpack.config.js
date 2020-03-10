const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const env = process.env.NODE_ENV;

const isDev = env === "development";

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 8080,
    historyApiFallback: true
  },
  entry: ["babel-polyfill", path.join(__dirname, "./src/index.js")],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "js/[name].min.js"
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".scss", "css"],
    alias: {
      components: path.join(__dirname, "src/components"),
      containers: path.join(__dirname, "src/containers"),
      store: path.join(__dirname, "src/store"),
      hooks: path.join(__dirname, "src/hooks"),
      helpers: path.join(__dirname, "src/helpers"),
      config: path.join(__dirname, "config"),
    }
  },
  devtool: isDev ? "source-map" : false,
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [isDev ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./index.html",
      filename: "index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[name].css",
      ignoreOrder: true
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ]
};
