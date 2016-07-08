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
      let trimLength = this.options.navigationDescTrim
      let json = require(jsonPath)
      let itemObj = {
        name: path.basename(jsonPath, '.json'),
        title: json.title,
        desc: json.desc
      }

      if (itemObj.desc.length > trimLength) {
        itemObj.desc = itemObj.desc.substr(0, trimLength) + '...'
      }

      for (let entry of json.entries) {
        for (let category of entry.categories) {
          if (!_.isArray(retObj[category])) {
            retObj[category] = []
          }

          if (!_.includes(retObj[category], itemObj)) {
            retObj[category].push(itemObj)
          }
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
