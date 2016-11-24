/* global describe, it */

require('babel-polyfill') // needed with PhantomJS+ES2015

const $ = require('jquery')
const assert = require('assert')
// const sinon = require('sinon')

const actions = { loadEntry: function () {} }
const $el = $('<div/>')
const Content = require('../../src/js/content')
const content = new Content(actions, $el)
const fixture = require('../fixtures/multi-entry.json')
const entries = fixture.entries

describe('Content Class', () => {
  it('should have set the actions', () => {
    assert.deepEqual(content.actions, actions)
  })

  it('should have set the output element', () => {
    assert.deepEqual(content.$el, $el)
  })

  it('should create a argument template', () => {
    let stringArg = { name: 'stringArg', types: ['String'] }
    let $string = $(content.getArgumentTemplate(stringArg))
    let multiArg = { name: 'multiArg', types: ['Number', 'PlainObject'] }
    let $multi = $(content.getArgumentTemplate(multiArg))

    assert.equal($string.children('.argument-name').text(), 'stringArg')
    assert.equal($string.children('.argument-types').text(), 'String')
    assert.equal($multi.children('.argument-types').text(), 'Number, PlainObject')
  })

  it('should render a entry', () => {
    assert.equal(typeof content.render, 'function')
    assert.equal($el.html(), '')

    content.render(fixture)

    let $entries = $el.children('ul.entries')

    assert.equal($entries.length, 1)
    assert.equal($entries.children().length, entries.length)
    assert.equal($entries.find('li:eq(0) > .entry-longdesc').html(), entries[0].longdesc)
  })

  it('should generate a signature heading', () => {
    assert.equal(typeof content.generateSignatureHeading, 'function')
    assert.equal(content.generateSignatureHeading(entries[0], entries[0].signatures[0]), 'test(propertyName) -> String')
    assert.equal(content.generateSignatureHeading(entries[0], entries[0].signatures[1]), 'test(propertyNames, [propertyNames]) -> String')
    assert.equal(content.generateSignatureHeading(entries[0], entries[0].signatures[2]), 'test({ accepts: PlainObject, beforeSend: Function(jqXHR, settings), data: PlainObject|String|Array }) -> String')
  })
})
