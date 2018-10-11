#!/usr/bin/env DEBUG=bf:* node

const debug = require('debug')('bf:script/dev-server')
const program = require('commander')
const express = require('express')
const logger = require('morgan-debug')
const compression = require('compression')
const { join } = require('path')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpack = require('webpack')
const { generateConfig } = require('./webpack/development')

// cli

program
.description('start development server to serve assets')
.option('-p, --port <n>', 'port [3000]', '3000')
.parse(process.argv)

// init app

const port = parseInt(program.port, 10)
const webpackConfig = generateConfig({ port })
const compiler = webpack(webpackConfig)
const app = express()

// setup middleware

app.use(logger(debug, 'tiny'))
app.use(compression())
app.use(webpackMiddleware(compiler, {
  noInfo: true,
  quiet: false,
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    children: false
  }
}))
app.use(webpackHotMiddleware(compiler, { log: debug }))
app.use(express.static(join(__dirname, '../public')))

// listen

app.listen(port)
debug('listen on localhost:%s', port)
