'use strict'

const _ = require('lodash')
const fs = require('fs-extra')
const shell = require('shelljs')
const config = require('../config')

module.exports = class Git {
  constructor (opt) {
    this.options = _.assign(config, opt)

    if (!shell.which('git')) {
      throw new Error('"git" command not found')
    }
  }

  update () {
    if (!fs.existsSync(this.options.repoDir)) {
      return this.clone()
    } else {
      return this.pull()
    }
  }

  clone () {
    let cmd = 'git clone ' + this.options.repoUrl + ' ' + this.options.repoDir

    return (shell.exec(cmd).code === 0)
  }

  pull () {
    shell.cd(this.options.repoDir)

    return (shell.exec('git pull').code === 0)
  }
}
