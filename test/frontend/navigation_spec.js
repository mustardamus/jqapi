/* global describe, it */

require('babel-polyfill') // needed with PhantomJS+ES2015

const $ = require('jquery')
const assert = require('assert')
const sinon = require('sinon')

const actions = { loadEntry: function () {} }
const $el = $('<div/>')
const Navigation = require('../../src/js/navigation')
const fixture = require('../fixtures/entries.json')
const entries = fixture.entries
const categories = fixture.categories
const navigation = new Navigation(actions, $el)

describe('Navigation Class', () => {
  it('should have set the actions', () => {
    assert.deepEqual(navigation.actions, actions)
  })

  it('should have set the output element', () => {
    assert.deepEqual(navigation.$el, $el)
  })

  it('should have generated a list of categories, sub-categories and entries', () => {
    assert.equal(typeof navigation.render, 'function')
    assert.equal($el.html(), '')

    navigation.render(fixture)

    assert.deepEqual(navigation.entries, entries)
    assert.deepEqual(navigation.categories, categories)

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
    assert.equal($el.children('ul.categories').hasClass('active'), false)
    assert.equal($el.find('ul.categories li:eq(0) > ul.categories').hasClass('active'), false)
    assert.equal($el.find('ul.entries').hasClass('active'), false)
  })

  it('should show entries and sub-categories when clicking on a category', () => {
    let $li1 = $el.children('ul.categories').children().eq(0)

    assert.equal($li1.hasClass('active'), false)
    $li1.trigger('click')
    assert.equal($li1.hasClass('active'), true)
    $li1.trigger('click')
    assert.equal($li1.hasClass('active'), false)
  })

  it('should set a entry to active if clicked', () => {
    let $li1 = $el.find('ul.categories > li:eq(0) > ul.categories > li:eq(0) > ul.entries > li:eq(0)')
    let $li2 = $el.find('ul.categories > li:eq(1) > ul.entries > li:eq(0)')

    assert.equal($li1.hasClass('active'), false)
    $li1.trigger('click')
    assert.equal($li1.hasClass('active'), true)
    $li2.trigger('click')
    assert.equal($el.find('.entry.active').length, 1)
    assert.equal($li2.hasClass('active'), true)
  })

  it('should trigger a load action on entry click', () => {
    let $li = $el.find('ul.categories > li:eq(1) > ul.entries > li:eq(0)')

    sinon.spy(actions, 'loadEntry')
    $li.trigger('click')

    let entryData = actions.loadEntry.getCall(0).args[0]

    assert.equal(actions.loadEntry.calledOnce, true)
    assert.ok(entryData.name)
    assert.ok(entryData.title)
    assert.ok(entryData.desc)
  })
})
