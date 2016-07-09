'use strict'

const _ = require('lodash')
const fs = require('fs-extra')
const glob = require('glob')
const path = require('path')
const cheerio = require('cheerio')
const config = require('../config')

module.exports = class Navigation {
  constructor (opt) {
    this.options = _.assign(config, opt)
  }

  getEntries () {
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

  getCategoryMeta ($category) {
    let desc = $category.children('desc').html() || ''

    return {
      slug: $category.attr('slug'),
      name: $category.attr('name'),
      desc: desc.replace('<![CDATA[', '').replace(']]>', '')
    }
  }

  parseCategories ($category) {
    return $category.find('> category').map((i, el) => {
      let $cat = cheerio(el)
      let metas = this.getCategoryMeta($cat)

      if ($cat.find('> category').length) {
        metas.categories = this.parseCategories($cat)
      }

      return metas
    }).get()
  }

  getCategories () {
    let xml = fs.readFileSync(this.options.categoriesXmlPath, 'utf8')
    let $ = cheerio.load(xml, { xmlMode: true })

    return this.parseCategories($('categories'))
  }

  create () {
    let jsonPath = this.options.navigationJsonPath
    let json = {
      entries: this.getEntries(),
      categories: this.getCategories()
    }

    fs.ensureFileSync(jsonPath)
    fs.writeFileSync(jsonPath, JSON.stringify(json), 'utf8')
  }
}
