'use strict'

const _ = require('lodash')
const fs = require('fs-extra')
const glob = require('glob')
const path = require('path')
const config = require('../config')

module.exports = class Git {
  constructor (opt) {
    this.options = _.assign(config, opt)
  }

  generate () {
    let retObj = {}
    let paths = glob.sync(this.options.entriesJsonGlob)

    for (let jsonPath of paths) {
      let name = path.basename(jsonPath, '.json')
      let json = require(jsonPath)
      let title = json.title
      let desc = json.desc
      let trimLength = this.options.navigationDescTrim

      if (desc.length > trimLength) {
        desc = desc.substr(0, trimLength) + '...'
      }

      for (let entry of json.entries) {
        for (let category of entry.categories) {
          if (!_.isArray(retObj[category])) {
            retObj[category] = []
          }

          retObj[category].push({ name, title, desc })
        }
      }
    }

    return retObj
  }

  create () {
    let jsonPath = this.options.navigationJsonPath
    let json = this.generate()

    fs.ensureFileSync(jsonPath)
    fs.writeFileSync(jsonPath, JSON.stringify(json), 'utf8')
  }
}
