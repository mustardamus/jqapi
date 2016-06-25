'use strict'

const assert = require('assert')
const Git = require('../lib/git.js')

const git = new Git()

describe('git lib', () => {
  it('should work', () => {
    assert.equal(git.clone(), true)
  })
})
