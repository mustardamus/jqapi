const $ = require('jquery')

class Actions {
  constructor () {
    this.events = $(window)
  }

  loadNavigation () {
    $.getJSON('/entries.json', (res) => {
      this.events.trigger('navigation:data', res)
    })
  }

  loadEntry (entryData) {
    $.getJSON(`/entries/${entryData.name}.json`, (res) => {
      this.events.trigger('entry:data', res)
    })
  }
}

module.exports = new Actions()
