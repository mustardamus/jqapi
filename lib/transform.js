'use strict'

const _ = require('lodash')
const cheerio = require('cheerio')

module.exports = class Transform {
  constructor (xml) {
    this.$ = cheerio.load(xml, { xmlMode: true })
  }

  toJSON () {
    return {
      title: this.getTopTitle(),
      desc: this.getTopDesc(),
      entries: this.$('entry').map((i) => {
        let $entry = this.getEntry(i)
        let retObj = this.getEntryMetas($entry)

        retObj.versions = this.getEntryVersions($entry)
        retObj.categories = this.getEntryCategories($entry)
        retObj.signatures = this.getEntrySignatures($entry)
        retObj.examples = this.getEntryExamples($entry)

        return retObj
      }).get()
    }
  }

  getTopTitle () {
    let firstEntry = this.$('entry').get(0)
    let titleEl = this.$(firstEntry).children('title')

    if (titleEl.length) {
      return titleEl.text()
    } else {
      return null
    }
  }

  getTopDesc () {
    let desc = this.$('entries > desc').html()

    if (!desc) {
      desc = this.$('entry > desc').html()
    }

    return desc
  }

  getEntry (index) {
    let entry = this.$('entry').get(index)

    if (entry) {
      return this.$(entry)
    } else {
      return null
    }
  }

  getEntryMetas ($entry) {
    return {
      name: $entry.attr('name'),
      type: $entry.attr('type'),
      return: $entry.attr('return'),
      desc: $entry.children('desc').html(),
      longdesc: $entry.children('longdesc').html()
    }
  }

  getEntrySlugs ($entry) {
    return $entry.find('category').map((i, el) => {
      return this.$(el).attr('slug')
    }).get()
  }

  getEntryVersions ($entry) {
    let retArr = []

    for (let slug of this.getEntrySlugs($entry)) {
      if (slug.indexOf('version/') !== -1) {
        retArr.push(slug.replace('version/', ''))
      }
    }

    return retArr
  }

  getEntryCategories ($entry) {
    let retArr = []

    for (let slug of this.getEntrySlugs($entry)) {
      if (slug.indexOf('version/') === -1) {
        for (let cat of slug.split('/')) {
          if (!_.includes(retArr, cat)) {
            retArr.push(cat)
          }
        }
      }
    }

    return retArr
  }

  getArgumentCallbackMetas ($argument) {
    let retObj = {}

    retObj.arguments = $argument.find('argument').map((i, el) => {
      let $cbArg = this.$(el)

      return {
        name: $cbArg.attr('name'),
        type: $cbArg.attr('type')
      }
    }).get()

    retObj.returns = $argument.find('return type').map((i, el) => {
      return this.$(el).attr('name')
    }).get()

    return retObj
  }

  getElementMetas ($element) {
    let retObj = {
      name: $element.attr('name'),
      desc: $element.find('desc').html(),
      types: []
    }

    if ($element.attr('type')) {
      retObj.types.push($element.attr('type'))
    } else {
      retObj.types = $element.find('type').map((i, el) => {
        return this.$(el).attr('name')
      }).get()
    }

    if ($element.attr('default')) {
      retObj.default = $element.attr('default')
    }

    if ($element.attr('optional') === 'true') {
      retObj.optional = true
    }

    if (retObj.types.length && retObj.types[0].toLowerCase() === 'function') {
      retObj.callback = this.getArgumentCallbackMetas($element)
    }

    return retObj
  }

  getArgumentPropertiesMetas ($argument) {
    return $argument.find('property').map((i, el) => {
      return this.getElementMetas(this.$(el))
    }).get()
  }

  getSignatureArguments ($signature) {
    return $signature.find('> argument').map((i, el) => {
      let $arg = this.$(el)
      let retObj = this.getElementMetas($arg)

      if ($arg.find('property').length) {
        retObj.properties = this.getArgumentPropertiesMetas($arg)
      }

      return retObj
    }).get()
  }

  getEntrySignatures ($entry) {
    return $entry.find('signature').map((i, el) => {
      let $sig = this.$(el)

      return {
        added: $sig.children('added').text(),
        arguments: this.getSignatureArguments($sig)
      }
    }).get()
  }

  getEntryExamples ($entry) {
    const clean = function (val) {
      if (val) {
        return val.replace('<![CDATA[\n', '').replace('\n]]>', '')
      } else {
        return ''
      }
    }

    return $entry.find('example').map((i, el) => {
      let $ex = this.$(el)

      return {
        desc: $ex.children('desc').html(),
        code: clean($ex.children('code').html()),
        css: clean($ex.children('css').html()),
        html: clean($ex.children('html').html())
      }
    }).get()
  }
}
