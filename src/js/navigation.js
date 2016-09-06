const $ = require('jquery')
const templates = require('../templates/navigation')

module.exports = class Navigation {
  constructor ($el, entries) {
    this.$el = $el
    this.entries = entries.entries
    this.categories = entries.categories
    this.activeClass = 'active'
    this.categoriesClass = 'categories'
    this.categoryClass = 'category'
    this.entriesClass = 'entries'
    this.entryClass = 'entry'

    let $categories = this.generateCategoriesList(this.categories)

    $categories.appendTo(this.$el)
  }

  generateCategoriesList (categories) {
    let listTemplate = templates.categoriesList
    let $categoryList = $(listTemplate)

    for (let category of categories) {
      let itemTemplate = templates.categoriesItem(category)
      let $categoryItem = $(itemTemplate)

      $categoryItem.on('click', (e) => {
        this.onCategoryItemClick($categoryItem, category)
        e.stopPropagation()
      })

      if (category.categories) {
        let $subList = this.generateCategoriesList(category.categories)
        $subList.appendTo($categoryItem)
      }

      let $entriesList = this.generateEntriesList(category.slug)

      if ($entriesList) {
        $entriesList.appendTo($categoryItem)
        $categoryItem.appendTo($categoryList)
      }
    }

    return $categoryList
  }

  generateEntriesList (categorySlug) {
    let entries = this.entries[categorySlug]

    if (!entries) {
      console.log('Can not find entries of category', categorySlug)
      return false
    }

    let listTemplate = templates.entriesList
    let $entriesList = $(listTemplate)

    for (let entry of entries) {
      let itemTemplate = templates.entriesItem(entry)
      let $entryItem = $(itemTemplate)

      $entryItem.on('click', (e) => {
        this.onEntryItemClick($entryItem, entry)
        e.stopPropagation()
      })

      $entryItem.appendTo($entriesList)
    }

    return $entriesList
  }

  onCategoryItemClick ($categoryItem, categoryData) {
    $categoryItem.toggleClass(this.activeClass)
  }

  onEntryItemClick ($entryItem, entryData) {
    $(`.${this.entryClass}.${this.activeClass}`, this.$el).removeClass(this.activeClass)
    $entryItem.addClass(this.activeClass)
  }
}
