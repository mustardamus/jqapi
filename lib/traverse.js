'use strict'

const _ = require('lodash')
const fs = require('fs-extra')
const glob = require('glob')
const path = require('path')
const config = require('../config')

module.exports = class Traverse {
  constructor (opt, transformCallback) {
    if (_.isFunction(opt)) {
      transformCallback = opt
      opt = {}
    }

    if (!transformCallback) {
      transformCallback = function (path, val) { return val }
    }

    this.options = _.assign(config, opt)
    this.transformCallback = transformCallback
  }

  processFiles () {
    let paths = glob.sync(this.options.entriesXmlGlob)
    let jsonDir = this.options.entriesJsonDir

    fs.ensureDirSync(jsonDir)

    for (let xmlPath of paths) {
      let basename = path.basename(xmlPath, '.xml')
      let jsonPath = path.join(jsonDir, basename + '.json')

      this.processFile(xmlPath, jsonPath)
    }
  }

  processFile (xmlPath, jsonPath) {
    let xmlContent = fs.readFileSync(xmlPath, 'utf8')
    let jsonContent = this.transformCallback(xmlPath, xmlContent)

    fs.writeFileSync(jsonPath, jsonContent, 'utf8')
  }
}
