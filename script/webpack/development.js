const { join } = require('path')
const { mapValues } = require('lodash')
const { maxThreads, srcFolder, basicEntryPoints } = require('../utils/common')
const webpack = require('webpack')
const HappyPack = require('happypack')
const cssnext = require('postcss-cssnext')
const postcssUrl = require('postcss-url')
const postcssImport = require('postcss-import')

const happyThreadPool = HappyPack.ThreadPool({ size: maxThreads })
const happyTempDir = join(__dirname, '..', '..', 'tmp', 'happypack')
const babelTempDir = join(__dirname, '..', '..', 'tmp', 'babel')

function generateConfig ({ port }) {
  const hmrModules = [
    'react-hot-loader/patch',
    `webpack-hot-middleware/client?path=http://assets.butterfly.dev:${port}/__webpack_hmr?timeout=2000&reload=true`
  ]
  const entryPoints = mapValues(basicEntryPoints, scripts => hmrModules.concat(scripts))

  return {
    debug: true,
    devtool: 'cheap-module-eval-source-map',
    cache: true,
    node: { fs: 'empty' },
    entry: entryPoints,
    output: {
      path: '/',
      publicPath: `http://assets.butterfly.dev:${port}/build/`,
      filename: '[name].js'
    },
    module: {
      loaders: [
        {
          test: /\.js(x?)$/,
          loader: 'babel',
          query: {
            plugins: ['react-hot-loader/babel'],
            cacheDirectory: babelTempDir
          },
          exclude: /(node_modules)/,
          happy: { id: 'js' }
        },
        { test: /\.json$/, loader: 'json' },
        { test: /\.css$/, loader: 'style!css!postcss', happy: { id: 'css' } },
        { test: /\.(jpg|png)$/, loader: 'file' },
        { test: /\.svg$/, loader: 'file' },
        { test: /\.svg\?raw$/, loader: 'raw' },
        { test: /\.svg\?react$/, loader: 'babel!react-svg' }
      ]
    },
    resolve: {
      root: srcFolder
    },
    postcss (webpack) {
      return [
        postcssImport({ addDependencyTo: webpack, skipDuplicates: true, path: [srcFolder] }),
        postcssUrl(),
        cssnext({ features: { rem: false } })
      ]
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'boot',
        minChunks: Infinity,
        filename: '[name].chunk.js'
      }),
      new webpack.optimize.CommonsChunkPlugin('manifest', 'manifest.chunk.js'),
      new HappyPack({ id: 'js', threadPool: happyThreadPool, tempDir: happyTempDir, verbose: false }),
      new HappyPack({ id: 'css', threadPool: happyThreadPool, tempDir: happyTempDir, verbose: false }),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ]
  }
}

module.exports = {
  generateConfig
}
