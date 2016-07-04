'use strict'

const Git = require('../lib/git')
const Transform = require('../lib/transform')
const Traverse = require('../lib/traverse')
const config = require('../config')

const transformCallback = function (path, val) {
  console.log('Processing:', path)
  const transform = new Transform(val)
  return JSON.stringify(transform.toJSON())
}

const git = new Git()
const traverse = new Traverse(transformCallback)

const update = function () {
  console.log('Updating the repo...')
  git.update()
  console.log('Done.')

  console.log('Traversing and transform files...')
  traverse.processFiles()
  console.log('Done.')
}

if (process.argv.pop() === '--daemon') {
  update()
  setInterval(update, config.updateIntervalMs)
} else {
  update()
  console.log('To run this task in a daemon call with: node tasks/update.js --daemon')
}
