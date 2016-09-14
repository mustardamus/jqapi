module.exports = {
  entriesList: '<ul class="entries"></ul>',

  entriesItem: (entry) => {
    return `
      <li class="entry ${entry.name} ${entry.type}">
        <div class="entry-longdesc">${entry.longdesc}</div>
      </li>
    `
  },

  argumentShort: (name, types) => {
    return `
      <div class="argument">
        <span class="argument-name">${name}</span>
        <span class="argument-types">${types.join(', ')}</span>
      </div>
    `
  },

  signatureHeader: (type, name, args, ret) => {
    if (type === 'method') {
      return `${name}(${args.join(', ')}) -> ${ret}`
    }
  }
}
