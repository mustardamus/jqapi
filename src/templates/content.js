module.exports = {
  entriesList: '<ul class="entries"></ul>',

  entriesItem: (entry) => {
    return `
      <li class="entry ${entry.name} ${entry.type}">
        <div class="entry-longdesc">${entry.longdesc}</div>
      </li>
    `
  },

  signatureHeader: (type, name, args, ret) => {
    if (type === 'method') {
      return `${name}(${args.join(', ')}) -> ${ret}`
    }
  }
}
