/* global describe, it */

'use strict'

const path = require('path')
const assert = require('assert')
const fs = require('fs-extra')
const sinon = require('sinon')
const Git = require('../../lib/git.js')

const opt = {
  tempDir: path.join(__dirname, '../../temp'),
  repoDir: path.join(__dirname, '../../temp/test'),
  repoUrl: 'https://github.com/mustardamus/test.git'
}
const git = new Git(opt)

describe('Git Class', function () {
  this.timeout(10000)

  it('should initialize with options', () => {
    assert.equal(opt.tempDir, git.options.tempDir)
    assert.equal(opt.repoDir, git.options.repoDir)
    assert.equal(opt.repoUrl, git.options.repoUrl)
  })

  it('should have a update, clone and pull method', () => {
    assert.equal(typeof git.update, 'function')
    assert.equal(typeof git.clone, 'function')
    assert.equal(typeof git.pull, 'function')
  })

  it('should call clone() on update() if local repo does not exist', () => {
    fs.removeSync(opt.tempDir)
    sinon.spy(git, 'clone')

    assert.equal(fs.existsSync(opt.tempDir), false)
    assert.equal(git.update(), true)
    assert.equal(git.clone.calledOnce, true)
    assert.equal(fs.existsSync(opt.tempDir), true)
    assert.equal(fs.existsSync(opt.repoDir), true)
    assert.equal(fs.readFileSync(opt.repoDir + '/README.md', 'utf8'), 'success\n')

    git.clone.restore()
  })

  it('should call pull() on update() if local repo exists', () => {
    sinon.spy(git, 'pull')

    assert.equal(fs.existsSync(opt.repoDir), true)
    assert.equal(git.update(), true)
    assert.equal(git.pull.calledOnce, true)

    git.pull.restore()
  })
})
