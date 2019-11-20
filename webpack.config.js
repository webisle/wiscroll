const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/wiscroll.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'wiscroll.js'
  }
};
