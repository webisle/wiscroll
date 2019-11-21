const path = require('path');
const webpack = require('webpack');
const PrettierPlugin = require('prettier-webpack-plugin');
const getPackageJson = require('./scripts/getPackageJson');
const TerserPlugin = require('terser-webpack-plugin');

const {
  version,
  name,
  license,
  repository,
  author,
} = getPackageJson('version', 'name', 'license', 'repository', 'author');

const umdBanner = `${name} v${version} (UMD version)
(c) ${author}, ${license} license`;

const es6Banner = `${name} v${version} (ES6 Module version)
(c) ${author}, ${license} license`;

const config = {
  mode: "production",
  entry: './src/index.js',
  devServer: {
    contentBase: path.join(__dirname, 'webtest'),
    watchContentBase: true
  }
};

const umdConfig = Object.assign({}, config, {
  name: "umd",
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Wiscroll',
    libraryTarget: 'umd',
    libraryExport: "default"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ["@babel/env"],
              ["minify", {
                "keepFnName": true
              }]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(umdBanner)
  ]
});

const es6Config = Object.assign({}, config, {
  name: "es6",
  output: {
    filename: 'index.es6.js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      extractComments: false,
      terserOptions: {
        module: true,
        toplevel: true
      }
    })],
  },
  plugins: [
    new PrettierPlugin(),
    new webpack.BannerPlugin(es6Banner)
  ]
});

module.exports = [
  umdConfig, es6Config,
];
