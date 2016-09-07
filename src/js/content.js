const $ = require('jquery')
const templates = require('../templates/content')

module.exports = class Content {
  constructor (actions, $el) {
    this.actions = actions
    this.$el = $el
  }

  render (entryData) {
    let $list = $(templates.entriesList)

    for (let entry of entryData.entries) {
      let $item = this.generateEntry(entry)

      $item.appendTo($list)
    }

    this.$el.html('').append($list)
  }

  generateEntry (entry) {
    let template = templates.entriesItem(entry)
    let $entry = $(template)

    return $entry
  }
}
