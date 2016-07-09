/* global describe, it */

'use strict'

const _ = require('lodash')
const assert = require('assert')
const fs = require('fs-extra')
const path = require('path')
const Navigation = require('../../lib/navigation')

const opt = {
  entriesJsonGlob: path.join(__dirname, '../fixtures/*-entry.json'),
  navigationJsonPath: path.join(__dirname, '../../temp/test-navigation.json'),
  navigationDescTrim: 10,
  categoriesXmlPath: path.join(__dirname, '../fixtures/categories.xml')
}

const navigation = new Navigation(opt)

describe('Navigation Class', function () {
  it('should have initialized with options', () => {
    assert.equal(navigation.options.entriesJsonGlob, opt.entriesJsonGlob)
    assert.equal(navigation.options.navigationJsonPath, opt.navigationJsonPath)
    assert.equal(navigation.options.categoriesXmlPath, opt.categoriesXmlPath)
  })

  it('should have a getEntries, getCategories and create method', () => {
    assert.equal(typeof navigation.getEntries, 'function')
    assert.equal(typeof navigation.create, 'function')
  })

  it('should have generated the navigation entries based on fixtures', () => {
    let entries = navigation.getEntries()

    assert.equal(_.isObject(entries), true)
    assert.equal(_.size(entries), 5)
  })

  it('should have stored the entries in categories keys', () => {
    let entries = navigation.getEntries()

    assert.equal(_.isArray(entries['category 2']), true)
    assert.equal(entries['category 2'].length, 2)
    assert.equal(_.isArray(entries['sub']), true)
    assert.equal(entries['sub'].length, 1)
  })

  it('should have the correct metas on the entries', () => {
    let entry = navigation.getEntries().sub[0]
    let jsonPath = path.join(__dirname, '../fixtures/multi-entry.json')
    let json = require(jsonPath)

    assert.equal(entry.name, path.basename(jsonPath, '.json'))
    assert.equal(entry.title, json.title)
    assert.equal(entry.desc, json.desc)
  })

  it('should have trimmed a long description', () => {
    assert.equal(navigation.getEntries().single[0].desc, '.test() a ...')
  })

  it('should save the navigation json to file', () => {
    fs.removeSync(opt.navigationJsonPath)
    assert.equal(fs.existsSync(opt.navigationJsonPath), false)
    navigation.create()
    assert.equal(fs.existsSync(opt.navigationJsonPath), true)
  })

  it('should have the correct json structure', () => {
    let json = require(opt.navigationJsonPath)
    let fixturePath = path.join(__dirname, '../fixtures/categories.json')
    let fixture = require(fixturePath)

    assert.equal(_.isObject(json.entries), true)
    assert.equal(_.size(json.entries), 5)
    assert.equal(_.isArray(json.categories), true)
    assert.equal(_.size(json.categories), 3)
    assert.deepEqual(json.categories, fixture)
  })
})
