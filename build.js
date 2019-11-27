const resolve = require('rollup-plugin-node-resolve');
const {rollup} = require('rollup');
const {terser} = require('rollup-plugin-terser');
const babel = require('rollup-plugin-babel');
const pkg = require('./package.json');
const fs = require('fs');
const gzipSize = require('gzip-size');
const prettyBytes = require('pretty-bytes');

const umdBanner = `/*!
 * ${pkg.name} v${pkg.version} (ES5 UMD version)
 * (c) ${pkg.author}, ${pkg.license} license
 */`;

const esmBanner = `/*!
 * ${pkg.name} v${pkg.version} (ES6 Module version)
 * (c) ${pkg.author}, ${pkg.license} license
 */`;

rollup({
  input: 'src/index.js',
  plugins: [
    resolve(),
    babel({
      "presets": [
        ['@babel/preset-env'],
      ]
    }),
    terser()
  ]
}).then((bundle) => {
  bundle.write({
    banner: umdBanner,
    file: pkg['umd:main'],
    format: 'umd',
    name: pkg['umd:name']
  }).then(() => {
    const data = fs.readFileSync(pkg['umd:main'], 'utf8');
    const bytes = gzipSize.sync(data);
    console.info(`Gzipped UMD size: ${ prettyBytes(bytes) }`);
  });
});

rollup({
  input: 'src/index.js',
  plugins: [
    terser()
  ]
}).then((bundle) => {
  bundle.write({
    banner: esmBanner,
    file: pkg.module,
    format: 'esm'
  }).then(() => {
    const data = fs.readFileSync(pkg.module, 'utf8');
    const bytes = gzipSize.sync(data);
    console.info(`Gzipped ESM size: ${ prettyBytes(bytes) }`);
  });
});