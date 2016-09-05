/* global describe, it */

require('babel-polyfill') // needed with PhantomJS+ES2015

const $ = require('jquery')
const assert = require('assert')

const $el = $('<div/>')
const Navigation = require('../../src/js/navigation')
const fixture = require('../fixtures/entries.json')
const entries = fixture.entries
const categories = fixture.categories
const navigation = new Navigation($el, fixture)

describe('Navigation Class', () => {
  it('should have set the output element', () => {
    assert.deepEqual(navigation.$el, $el)
  })

  it('should have set the entries and categories', () => {
    assert.deepEqual(navigation.entries, entries)
    assert.deepEqual(navigation.categories, categories)
  })

  it('should have generated a list of categories, sub-categories and entries', () => {
    let $ul = $el.children('ul.categories')
    let $li1 = $ul.children().eq(0)
    let $li1Ul = $li1.children('ul.categories')
    let $li1UlLi1 = $li1Ul.children().eq(0)
    let $li1Entries = $li1UlLi1.children('.entries') 
    let slug = categories[0].categories[0].slug

    assert.equal($ul.children().length, categories.length)
    assert.equal($li1.children('.category-name').text(), categories[0].name)
    // assert.equal($li1.children('.category-desc').text(), categories[0].desc)
    assert.equal($li1Ul.length, 1)
    assert.equal($li1UlLi1.children('.category-name').text(), categories[0].categories[0].name)
    // assert.equal($li1UlLi1.children('.category-desc').text(), categories[0].categories[0].desc)
    assert.equal($li1Entries.length, 1)
    assert.equal($li1Entries.children().length, entries[slug].length)
  })

  it('should initially hide sub-categories and entries', () => {
    assert.equal($el.children('ul.categories').hasClass('hidden'), false)
    assert.equal($el.find('ul.categories li:eq(0) > ul.categories').hasClass('hidden'), true)
    assert.equal($el.find('ul.entries').hasClass('hidden'), true)
  })
})
