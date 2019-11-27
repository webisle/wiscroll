import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
const pkg = require('./package.json');
 
export default {
  input: 'src/index.js',
  output: {
    file: 'webtest/wiscroll.js',
    format: 'umd',
    name: pkg['umd:name']
  },
  plugins: [
    serve({
        contentBase: 'webtest/',
    }),
    livereload()
  ]
}