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
    let first = entries.categories[0]
    let $first = $cats.children().eq(0)
    let $firstSub = $first.children('ul.categories')

    assert.equal($cats.children().length, entries.categories.length)
    assert.equal($first.children('.category-name').text(), first.name)
    assert.equal($first.children('.category-desc').text(), first.desc)
    assert.equal($firstSub.length, 1)
    assert.equal($firstSub.children().eq(0).children('.category-name').text(), first.categories[0].name)
    assert.equal($firstSub.children().eq(0).children('.category-desc').text(), first.categories[0].desc)
  })
})
