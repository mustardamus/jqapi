'use strict'

const path = require('path')

const baseDir = __dirname
const tempDir = path.join(baseDir, 'temp')
const publicDir = path.join(baseDir, 'public')
const repoDir = path.join(tempDir, 'docs')
const repoUrl = 'https://github.com/jquery/api.jquery.com.git'
const entriesXmlGlob = path.join(repoDir, 'entries/*.xml')
const entriesJsonDir = path.join(publicDir, 'entries')
const updateIntervalMs = 1000 * 60 * 60 * 3
const entriesJsonGlob = path.join(entriesJsonDir, '*.json')
const navigationJsonPath = path.join(publicDir, 'entries.json')
const navigationDescTrim = 100

module.exports = {
  baseDir,
  tempDir,
  publicDir,
  repoDir,
  repoUrl,
  entriesXmlGlob,
  entriesJsonDir,
  updateIntervalMs,
  entriesJsonGlob,
  navigationJsonPath,
  navigationDescTrim
}
