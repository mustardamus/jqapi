const $ = require('jquery')
const actions = require('./js/actions')
const Navigation = require('./js/navigation')
const Content = require('./js/content')

const navigation = new Navigation(actions, $('#navigation'))
const content = new Content(actions, $('#content'))

actions.events.on('navigation:data', (e, entries) => {
  navigation.render(entries)
})

actions.events.on('entry:data', (e, entry) => {
  content.render(entry)
})

actions.loadNavigation()
