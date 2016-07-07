module.exports = function (karma) {
  karma.set({
    browsers: ['PhantomJS'],
    frameworks: ['browserify', 'mocha'],
    files: ['test/frontend/**/*_spec.js'],
    reporters: ['spec'],
    preprocessors: {
      'test/frontend/**/*_spec.js': [ 'browserify' ]
    },
    browserify: {
      debug: true
    }
  })
}
