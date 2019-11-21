const path = require('path');
const webpack = require('webpack');
const PrettierPlugin = require("prettier-webpack-plugin");
const getPackageJson = require('./scripts/getPackageJson');

const {
  version,
  name,
  license,
  repository,
  author,
} = getPackageJson('version', 'name', 'license', 'repository', 'author');

const banner = `${name} v${version}
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
    new webpack.BannerPlugin(banner)
  ]
});

const es6Config = Object.assign({}, config, {
  name: "es6",
  output: {
    filename: 'index.es6.js',
    path: path.resolve(__dirname, 'dist')
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
    new PrettierPlugin(),
    new webpack.BannerPlugin(banner)
  ]
});

module.exports = [
  umdConfig, es6Config,
];
