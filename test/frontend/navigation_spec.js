/* global describe, it */

require('babel-polyfill') // needed with PhantomJS+ES2015

const $ = require('jquery')
const assert = require('assert')

const $el = $('<div/>')
const Navigation = require('../../src/js/navigation')
const entries = require('../fixtures/entries.json')
const navigation = new Navigation($el, entries)

describe('Navigation Class', () => {
  it('should have set the output element', () => {
    assert.deepEqual(navigation.$el, $el)
  })

  it('should have set the entries and categories', () => {
    assert.deepEqual(navigation.entries, entries.entries)
    assert.deepEqual(navigation.categories, entries.categories)
  })

  it('should have generated a list of categories', () => {
    let $cats = $el.children('ul.categories')
    let firstCat = entries.categories[0]
    let $firstCat = $cats.children().eq(0)
    let $firstCatSub = $firstCat.children('ul.categories')
    let $firstCatSubFirst = $firstCatSub.children().eq(0)

    assert.equal($cats.children().length, entries.categories.length)
    assert.equal($firstCat.children('.category-name').text(), firstCat.name)
    assert.equal($firstCat.children('.category-desc').text(), firstCat.desc)
    assert.equal($firstCatSub.length, 1)
    assert.equal($firstCatSubFirst.children('.category-name').text(), firstCat.categories[0].name)
    assert.equal($firstCatSubFirst.children('.category-desc').text(), firstCat.categories[0].desc)
    assert.equal($firstCatSubFirst.children('.entries').length, 1)
  })
})
