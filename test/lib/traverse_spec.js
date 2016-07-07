/* global describe, it */

'use strict'

const assert = require('assert')
const fs = require('fs-extra')
const path = require('path')
const sinon = require('sinon')
const Traverse = require('../../lib/traverse')

const opt = {
  entriesXmlGlob: path.join(__dirname, '../fixtures/*.xml'),
  entriesJsonDir: path.join(__dirname, '../../temp/test-entries')
}
const transformCallback = function (xmlPath, val) { return 'success' }
const transformSpy = sinon.spy(transformCallback)

const traverse = new Traverse(opt, transformSpy)

describe('Traverse Class', function () {
  it('should have initialized with options', () => {
    assert.equal(opt.entriesXmlGlob, traverse.options.entriesXmlGlob)
    assert.equal(opt.entriesJsonDir, traverse.options.entriesJsonDir)
  })

  it('should have initialized with a transform callback', () => {
    assert.equal(typeof traverse.transformCallback, 'function')
  })

  it('should have a processFiles method', () => {
    assert.equal(typeof traverse.processFiles, 'function')
  })

  it('should have created the output directory', () => {
    fs.removeSync(opt.entriesJsonDir)
    assert.equal(fs.existsSync(opt.entriesJsonDir), false)
    traverse.processFiles()
    assert.equal(fs.existsSync(opt.entriesJsonDir), true)
  })

  it('should have called the transform callback', () => {
    assert.equal(transformSpy.callCount, 2)
  })

  it('should have transformed the files', () => {
    let jsonPath = path.join(opt.entriesJsonDir, 'multi-entry.json')

    assert.equal(fs.existsSync(jsonPath), true)
    assert.equal(fs.readFileSync(jsonPath, 'utf8'), 'success')
  })
})
