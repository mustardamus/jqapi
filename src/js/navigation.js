const $ = require('jquery')
const templates = require('../templates/navigation')

module.exports = class Navigation {
  constructor ($el, entries) {
    this.$el = $el
    this.entries = entries.entries
    this.categories = entries.categories

    let $categories = this.generateCategoriesList(this.categories)

    $categories.appendTo(this.$el)
  }

  generateCategoriesList (categories) {
    let listTemplate = templates.categoriesList
    let $categoryList = $(listTemplate)

    for (let category of categories) {
      let itemTemplate = templates.categoriesItem(category)
      let $categoryItem = $(itemTemplate)

      if (category.categories) {
        let $subList = this.generateCategoriesList(category.categories)
        $subList.appendTo($categoryItem)
      }

      $categoryItem.appendTo($categoryList) 
    }

    return $categoryList
  }
}
