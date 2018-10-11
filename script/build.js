#!/usr/bin/env node
process.env.DEBUG = 'bf:*'
process.env.NODE_ENV = 'production'

const debug = require('debug')('bf:script/build')
const program = require('commander')
const { join } = require('path')
const { sync: mkdirp } = require('mkdirp')
const { bucket, apps } = require('./utils/common')
const webpack = require('webpack')
const { generateConfig } = require('./webpack/production')

// cli

program
.description('build src')
.option('--no-override', 'disable build-versions.json update')
.parse(process.argv)

// locals
const buildFolder = join(__dirname, '../public/build')
const versionsFile = join(__dirname, '../../butterfly-server/src/build-versions.json')
const publicPath = `https://${bucket}/build`
const versionsFilePath = program.override ? versionsFile : null

// webpack initialization

const webpackConfig = generateConfig({ apps, publicPath, versionsFilePath })
const compiler = webpack(webpackConfig)

// run build

debug('compile %j', apps)
mkdirp(buildFolder)
compiler.run((err, stats) => {
  if (err) throw err
  debug(stats.toString({
    chunks: false,
    colors: true,
    children: false
  }))
  debug('done')
})
