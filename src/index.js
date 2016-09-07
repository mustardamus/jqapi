const $ = require('jquery')
const actions = require('./js/actions')
const Navigation = require('./js/navigation')
const Content = require('./js/content')

const content = new Content(actions, $('#content'))

actions.events.on('navigation:data', (e, entries) => {
  const navigation = new Navigation(actions, $('#navigation'), entries)
})

actions.events.on('entry:data', (e, entry) => {
  content.render(entry)
})

actions.loadNavigation()
