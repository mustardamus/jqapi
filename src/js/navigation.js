const $ = require('jquery')

module.exports = class Navigation {
  constructor ($el, entries) {
    this.$el = $el
    this.entries = entries.entries
    this.categories = entries.categories

    let $categories = this.generateCategoriesList()

    $categories.appendTo(this.$el)
  }

  generateCategoriesList () {
    let $list = $('<ul class="categories"/>')

    for (let category of this.categories) {
      $list.append(`<li>need templates</li>`)
    }

    return $list
  }
}
