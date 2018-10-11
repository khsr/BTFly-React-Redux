const { join, dirname, basename } = require('path')
const { srcFolder, basicEntryPoints } = require('../utils/common')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const cssnext = require('postcss-cssnext')
const postcssUrl = require('postcss-url')
const postcssImport = require('postcss-import')
const cssnano = require('cssnano')

function generateConfig ({ publicPath, versionsFilePath }) {
  const entryPoints = basicEntryPoints
  const assetsJsonFullPath = versionsFilePath || join(__dirname, '../../tmp', 'assets.json')
  const assetsJsonPath = { path: dirname(assetsJsonFullPath), filename: basename(assetsJsonFullPath) }

  return {
    node: { fs: 'empty' },
    entry: entryPoints,
    output: {
      path: join(__dirname, '..', '..', 'public', 'build'),
      publicPath: `${publicPath}/`,
      filename: '[name]-[chunkhash].js',
      chunkFilename: '[name]-[chunkhash].chunk.js'
    },
    module: {
      loaders: [
        {
          test: /\.js(x?)$/,
          loader: 'babel',
          exclude: /(node_modules)/
        },
        { test: /\.json$/, loader: 'json' },
        { test: /\.css$/, loader: ExtractTextPlugin.extract('css!postcss') },
        { test: /\.(jpg|png)$/, loader: 'url?limit=10000&name=img-[sha512:hash:base64:7].[ext]!image-webpack' },
        { test: /\.svg$/, loader: 'url?limit=10000&name=img-[sha512:hash:base64:7].[ext]!image-webpack' },
        { test: /\.svg\?raw$/, loader: 'raw!image-webpack' },
        { test: /\.svg\?react$/, loader: 'babel!react-svg' }
      ]
    },
    resolve: {
      root: srcFolder
    },
    postcss (webpack) {
      return [
        postcssImport({ addDependencyTo: webpack, path: [srcFolder] }),
        postcssUrl(),
        cssnext({ features: { rem: false } }),
        cssnano({ autoprefixer: false, zindex: false })
      ]
    },
    imageWebpackLoader: {
      pngquant: {
        quality: '80-90',
        speed: 4
      },
      svgo: {
        plugins: [
          { removeViewBox: false },
          { removeEmptyAttrs: false }
        ]
      }
    },
    plugins: [
      new ProgressBarPlugin(),
      new AssetsPlugin({
        filename: assetsJsonPath.filename,
        path: assetsJsonPath.path,
        fullPath: false,
        prettyPrint: true
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'boot',
        minChunks: Infinity,
        filename: '[name]-[chunkhash].chunk.js'
      }),
      // Extract chunks table from boot chunk into separate file
      // for better long term caching
      new webpack.optimize.CommonsChunkPlugin('manifest', '[name]-[chunkhash].chunk.js'),
      new ExtractTextPlugin('[name]-[chunkhash].css'),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.UglifyJsPlugin({
        comments: false,
        sourceMap: false,
        compress: {
          screw_ie8: true,
          drop_console: false,
          warnings: false
        }
      })
    ]
  }
}

module.exports = {
  generateConfig
}
