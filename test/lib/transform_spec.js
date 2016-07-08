/* global describe, it */

'use strict'

const fs = require('fs-extra')
const path = require('path')
const assert = require('assert')
const Transform = require('../../lib/transform')

describe('Transform Class for multiple entries', () => {
  const xmlPath = path.join(__dirname, '../fixtures/multi-entry.xml')
  const xmlFixture = fs.readFileSync(xmlPath, 'utf8')
  const jsonPath = path.join(__dirname, '../fixtures/multi-entry.json')
  const jsonFixture = require(jsonPath)
  const transform = new Transform(xmlFixture)

  it('should have created a cheerio function', () => {
    assert.equal(typeof transform.$, 'function')
  })

  it('should have a .toJSON() method', () => {
    assert.equal(typeof transform.toJSON, 'function')
  })

  it('should get top title', () => {
    assert.equal(transform.getTopTitle(), jsonFixture.title)
  })

  it('should get top desc', () => {
    assert.equal(transform.getTopDesc(), jsonFixture.desc)
  })

  it('should get a cheerio object of a entry', () => {
    assert.equal(typeof transform.getEntry(0), 'object')
    assert.equal(transform.getEntry(11), null)
  })

  it('should get single entry metas', () => {
    let entry = transform.getEntry(0)
    let metas = transform.getEntryMetas(entry)
    let fixture = jsonFixture.entries[0]

    assert.equal(metas.name, fixture.name)
    assert.equal(metas.type, fixture.type)
    assert.equal(metas.return, fixture.return)
    assert.equal(metas.desc, fixture.desc)
    assert.equal(metas.longdesc, fixture.longdesc)
  })

  it('should get single entry slugs', () => {
    let entry = transform.getEntry(0)
    let slugs = transform.getEntrySlugs(entry)
    let checkArr = [
      'category 1',
      'category 2',
      'category 2/sub',
      'version/1.0',
      'version/1.4'
    ]

    assert.deepEqual(slugs, checkArr)
  })

  it('should get single entry versions', () => {
    let entry = transform.getEntry(0)
    let versions = transform.getEntryVersions(entry)

    assert.deepEqual(versions, jsonFixture.entries[0].versions)
  })

  it('should get single entry categories', () => {
    let entry = transform.getEntry(0)
    let categories = transform.getEntryCategories(entry)

    assert.deepEqual(categories, jsonFixture.entries[0].categories)
  })

  it('should get callback metas from a function argument', () => {
    let entry = transform.getEntry(1)
    let signature = entry.find('signature').get(1)
    let argument = transform.$(signature).find('> argument').get(1)
    let metas = transform.getArgumentCallbackMetas(transform.$(argument))
    let fixture = jsonFixture.entries[1].signatures[1].arguments[1]

    assert.deepEqual(metas, fixture.callback)
  })

  it('should get properties metas from a object argument', () => {
    let entry = transform.getEntry(0)
    let signature = entry.find('signature').get(2)
    let argument = transform.$(signature).find('> argument').get(0)
    let metas = transform.getArgumentPropertiesMetas(transform.$(argument))
    let fixture = jsonFixture.entries[0].signatures[2].arguments[0]

    assert.deepEqual(metas, fixture.properties)
  })

  it('should get arguments from a entry signature', () => {
    let entry = transform.getEntry(1)
    let signature1 = entry.find('signature').get(0)
    let signature2 = entry.find('signature').get(1)
    let arguments1 = transform.getSignatureArguments(transform.$(signature1))
    let arguments2 = transform.getSignatureArguments(transform.$(signature2))
    let fixture = jsonFixture.entries[1]

    assert.deepEqual(arguments1, fixture.signatures[0].arguments)
    assert.deepEqual(arguments2, fixture.signatures[1].arguments)
  })

  it('should get single entry signatures', () => {
    let entry = transform.getEntry(1)
    let signatures = transform.getEntrySignatures(entry)

    assert.deepEqual(signatures, jsonFixture.entries[1].signatures)
  })

  it('should get single entry examples', () => {
    let entry = transform.getEntry(0)
    let examples = transform.getEntryExamples(entry)

    assert.deepEqual(examples, jsonFixture.entries[0].examples)
  })

  it('should return the whole transform in json', () => {
    assert.deepEqual(transform.toJSON(), jsonFixture)
  })
})

describe('Transform Class for a single entry', () => {
  const xmlPath = path.join(__dirname, '../fixtures/single-entry.xml')
  const xmlFixture = fs.readFileSync(xmlPath, 'utf8')
  const jsonPath = path.join(__dirname, '../fixtures/single-entry.json')
  const jsonFixture = require(jsonPath)
  const transform = new Transform(xmlFixture)

  it('should return the whole transform in json', () => {
    assert.deepEqual(transform.toJSON(), jsonFixture)
  })
})
