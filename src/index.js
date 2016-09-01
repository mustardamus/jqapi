const $ = require('jquery')
const Navigation = require('./js/navigation')

const entries = require('../test/fixtures/entries.json')
const navigation = new Navigation($('body'), entries)
