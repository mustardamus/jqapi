const $ = require('jquery')
const actions = require('./js/actions')
const Navigation = require('./js/navigation')

actions.events.on('navigation:data', (e, entries) => {
  const navigation = new Navigation($('body'), entries)
})

actions.loadNavigation()
