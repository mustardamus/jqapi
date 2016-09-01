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
    let $cats = $('ul.categories', $el)

    assert.equal($cats.children().length, entries.categories.length)
  })
})
