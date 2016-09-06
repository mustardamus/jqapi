/* global describe, before, after, it */

const assert = require('assert')
const sinon = require('sinon')
const actions = require('../../src/js/actions')

describe('Actions', function () {
  before(function () {
    this.xhr = sinon.useFakeXMLHttpRequest()
    let requests = this.requests = []

    this.xhr.onCreate = function (xhr) {
      requests.push(xhr)
    }

    sinon.spy(actions.events, 'trigger')
  })

  after(function () {
    this.xhr.restore()
    actions.events.trigger.restore()
  })

  it('should load the navigation index', function () {
    let fixture = {
      works: true
    }

    actions.loadNavigation()

    assert.equal(this.requests.length, 1)
    assert.equal(this.requests[0].url, '/entries.json')

    this.requests[0].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(fixture))

    let args = actions.events.trigger.getCall(0).args

    assert.equal(actions.events.trigger.calledOnce, true)
    assert.equal(args[0], 'navigation:data')
    assert.deepEqual(args[1], fixture)
  })

  it('should load a requested entry', function () {
    return
    let fixture = {
      name: 'entry',
      title: 'Entry',
      desc: 'Entry Desc'
    }

    actions.loadEntry(fixture)

    assert.equal(this.requests.length, 1)
    assert.equal(this.requests[0].url, '/entries/entry.json')

    this.requests[0].respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(fixture))

    let args = actions.events.trigger.getCall(0).args

    assert.equal(actions.events.trigger.calledOnce, true)
    assert.equal(args[0], 'entry:data')
    assert.deepEqual(args[1], fixture)
  })
})
