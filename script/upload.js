#!/usr/bin/env node
process.env.DEBUG = 'bf:*'

const debug = require('debug')('bf:script/upload')
const program = require('commander')
const hasha = require('hasha')
const mime = require('mime')
const AWS = require('aws-sdk')
const async = require('async')
const moment = require('moment')
const { join, relative } = require('path')
const { readFileSync: readFile } = require('fs')
const recursiveReaddit = require('recursive-readdir')
const { bucket: Bucket } = require('./utils/common')

// cli

program
.description('upload /public to S3')
.parse(process.argv)

// locals

const s3 = new AWS.S3()
const publicFolder = join(__dirname, '../public')

// read public folder and upload to S3

debug('upload files to %s', Bucket)
recursiveReaddit(publicFolder, ['.*'], (err, files) => {
  if (err) throw err

  async.eachLimit(files, 3, (file, next) => {
    const Key = relative(publicFolder, file)
    const Body = readFile(file)
    const params = {
      Bucket,
      Key,
      Body,
      ACL: 'public-read',
      ContentType: mime.lookup(file),
      Expires: moment().add(1, 'year').toDate(),
      CacheControl: 'public, max-age=5184000' // 2 months
    }

    s3.getObject({ Bucket, Key }, (err2, data) => {
      if (err2 && err2.name !== 'NoSuchKey') return next(err2)
      if (err2 && err2.name === 'NoSuchKey') {
        debug('put %s', Key)
        s3.putObject(params, (err3) => {
          if (err3) return next(err3)
          next()
        })
      } else if (data && hasha(Body.toString()) === hasha(data.Body.toString())) {
        return next()
      } else {
        return next(new Error(`You can\'t rewrite existing object "${Key}"`))
      }
    })
  }, (err2) => {
    if (err2) throw err2
    debug('done')
  })
})
