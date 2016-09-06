const $ = require('jquery')
const actions = require('./js/actions')
const Navigation = require('./js/navigation')

actions.events.on('navigation:data', (e, entries) => {
  const navigation = new Navigation(actions, $('body'), entries)
})

actions.events.on('entry:data', (e, data) => {
  console.log('ow yeah', data)
})

actions.loadNavigation()
