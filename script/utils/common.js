const { readdirSync: readdir } = require('fs')
const { cpus } = require('os')
const { join } = require('path')

const bucket = 'assets.butterflyhacks.com'
const maxThreads = cpus().length
const srcFolder = join(__dirname, '../../src')
const appsFolder = join(srcFolder, 'apps')
const apps = readdir(appsFolder)
const basicEntryPoints = Object.assign(
  apps.reduce((result, app) => {
    result[app] = [join(appsFolder, app)]
    return result
  }, {}),
  { boot: [join(srcFolder, 'components', 'boot/index.js')] }
)

module.exports = {
  maxThreads, srcFolder, appsFolder, apps, bucket, basicEntryPoints
}
