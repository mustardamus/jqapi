const $ = require('jquery')
const templates = require('../templates/content')

module.exports = class Content {
  constructor (actions, $el) {
    this.actions = actions
    this.$el = $el
  }

  render (entryData) {
    let $list = $(templates.entriesList)

    for (let entry of entryData.entries) {
      let $item = this.generateEntry(entry)

      $item.appendTo($list)
    }

    this.$el.html('').append($list)
  }

  generateEntry (entry) {
    let template = templates.entriesItem(entry)
    let $entry = $(template)

    return $entry
  }

  generateSignatureHeading (entry, signature) {
    let args = []

    for (let argument of signature.arguments) {
      let argStr = ''

      switch (argument.types[0]) {
        case 'PlainObject':
          let props = []

          for (let prop of argument.properties) {
            if (prop.types[0] === 'Function') {
              let funcArgs = []

              for (let arg of prop.callback.arguments) {
                funcArgs.push(arg.name)
              }

              props.push(`${prop.name}: Function(${funcArgs.join(', ')})`)
            } else {
              props.push(`${prop.name}: ${prop.types.join('|')}`)
            }
          }

          argStr = `{ ${props.join(', ')} }`
          break

        default:
          argStr = argument.name
      }

      if (argument.optional) {
        args.push(`[${argStr}]`)
      } else {
        args.push(argStr)
      }
    }

    return templates.signatureHeader(entry.type, entry.name, args, entry.return) 
  }

  getArgumentTemplate (argument) {
    let retTypes = []

    for (let argType of argument.types) {
      switch (argType.toLowerCase()) {
        case 'plainobject':
          if (argument.properties) {

          } else {
            retTypes.push(argType)
          }

          break
        case 'function':
          break
        default:
          retTypes.push(argType)
      }
    }

    return templates.argumentShort(argument.name, retTypes)
  }
}
