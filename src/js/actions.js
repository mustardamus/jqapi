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
      let data = Object.assign(entryData, res)
      this.events.trigger('entry:data', data)
    })
  }
}

module.exports = new Actions()
