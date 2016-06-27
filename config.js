'use strict'

const path = require('path')

const baseDir = __dirname
const tempDir = path.join(baseDir, 'temp')
const repoDir = path.join(tempDir, 'docs')
const repoUrl = 'https://github.com/jquery/api.jquery.com.git'

module.exports = { baseDir, tempDir, repoDir, repoUrl }
