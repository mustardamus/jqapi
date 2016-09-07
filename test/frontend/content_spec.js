/* global describe, it */

require('babel-polyfill') // needed with PhantomJS+ES2015

const $ = require('jquery')
const assert = require('assert')
const sinon = require('sinon')

const actions = { loadEntry: function () {} }
const $el = $('<div/>')
const Content = require('../../src/js/content')
const content = new Content(actions, $el)
const fixture = require('../fixtures/multi-entry.json')

describe('Content Class', () => {
  it('should have set the actions', () => {
    assert.deepEqual(content.actions, actions)
  })

  it('should have set the output element', () => {
    assert.deepEqual(content.$el, $el)
  })

  it('should render a entry', () => {
    assert.equal(typeof content.render, 'function')
    assert.equal($el.html(), '')

    content.render(fixture)

    let $entries = $el.children('ul.entries')
    let entries = fixture.entries

    assert.equal($entries.length, 1)
    assert.equal($entries.children().length, entries.length)
    assert.equal($entries.find('li:eq(0) > .entry-longdesc').html(), entries[0].longdesc)
  })
})
