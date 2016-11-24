# jQAPI - Alternative jQuery Documentation Browser

## What is jQAPI?

[api.jquery.com](https://api.jquery.com/)

## Features

## How does it work

## Development

### Getting started

### Tasks

All tasks can be executed with `npm run <task-name>`, alternatively with
`yarn run <task-name>`, if you are a cool kid.

#### `clean`

Removes the `./www` folder and re-creates it.

#### `copy:html`

Copies all `./src/*.html` files to `./www`.

#### `copy:assets`

Copies `./src/assets` to `./www/assets`.

#### `copy`

Runs `copy:html` & `copy:assets`.

#### `build:js`

Bundles the JS with [Browserify](http://browserify.org/) and applies the
[Babelify transform](https://github.com/babel/babelify) which transpiles the
ES2015 code.

The entry file is `./src/index.js` and the output file is `./www/build.js`.

#### `build:js:prod`

Same as `build:js`, but minifies the output with
[Uglify](https://github.com/mishoo/UglifyJS2).

#### `build:css`

Bundles and compiles the CSS with [Stylus](http://stylus-lang.com/).

The entry file is `./src/index.styl` and the output file is `./www/build.css`.

#### `build:css:prod`

Same as `build:css`, but minifies the output with
[CSSO](https://github.com/css/csso).

#### `build`

Runs `build:js` & `build:css`.

#### `build:prod`

Runs `build:js:prod` & `build:css:prod`.

#### `watch:js`

Same as `build:js`, but watches the build for changes and incremntally re-builds
it with [Watchify](https://github.com/substack/watchify).

#### `watch:css`

Same as `build:css`, but watches any `./src/**/*.styl` for changes and re-runs
the `build:css` task with [Chokidar](https://github.com/paulmillr/chokidar).

#### `watch`

Runs `watch:js` & `watch:css`.

#### `serve`

Serves the `./www` folder with [BrowserSync](https://browsersync.io/). Whenever
one of the `./www/build.*` files changes, the browser will automatically reload.

#### `update`

Runs `./lib/update.js` which will clone/update the official jQuery documention
repo, transforms the XML to JSON and builds the `./www/entries.json` index.

#### `update:daemon`

Same as `update`, but runs continuously. TODO: forever

#### `test:lib`

Runs all the lib tests in `./test/lib` with [Mocha](https://mochajs.org/).

#### `test:frontend`

Runs all the frontend tests in `./test/frontend` with
[Karma](https://karma-runner.github.io/1.0/index.html). It also will watch for
changes in in the tests and re-runs them without restarting the headless
browser.

#### `test:frontend:once`

Same as `test:frontend`, but will only run once.

#### `test`

Runs `test:lib` & `test:frontend:once`.

#### `start`

Runs `copy` & `serve` & `watch`. If you want to work on jQAPI, run this tasks.
But keep in mind that the `clean` task must have been run before if it's the
first time you run `start`.

#### `production`

Runs `clean` & `copy` & `build:prod` & `update`. If you want to generate a fresh
release for production, run this task.

#### `lint`

This will lint all `*.js` files with [Standard](http://standardjs.com/).

### Writing Tests

## License

Licensed under the [MIT License](./LICENSE.md).
