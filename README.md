# jQAPI - Alternative jQuery Documentation Browser


## What is jQAPI? / Why was it born?

This is a alternative interface to the
[official jQuery documentation](https://api.jquery.com). First and foremost I
want to point out that the content is solely the work of the awesome jQuery
team and contributers (used under the MIT license).

Back in 2011 I started to work professionally as a web-developer and I was
mainly using [jQuery](https://jquery.com) and [Ruby on Rails](...). When I was
navigating the RoR docs, I was using [RailsAPI](...), which is also a
alternative browser to the official documentation. A big shoutout goes to
[whoever](made railsapi.com), the creator of the RailsAPI website. jQAPI was
heavily inspired by it.

As much as I loved the speed of finding things I needed in RailsAPI, I hated how
much time I had to spend on the official jQuery docs to find the information I
was looking for. Back then there was a different website for the jQuery docs,
but even with the 'newer' interface (which looks sleak, no doubt) I am not
entirely happy.

To cut a long story short: I built a interface modeled after RailsAPI in a
couple of days, because I wanted it. Once shared with the world it was very well
accepted and used among many developers.

Ever since I released a couple of versions of jQAPI which was built with
[Ruby]() as the back-end (the scraper, XML -> JSON part) and JavaScript/jQuery
for the front-end.

Now you are looking at the all-JS version of jQAPI, which uses
[Node.js]() to transform the content. On top of that, this version includes
extended documentation for the project and is mostly covered by tests. That way
I hope more people will contribute to the project.

It was quite for a while because I was busy with life and different projects.
But with your help (feedback, bug reporting, contributing) I hope that we can
keep it active and save developers around the world time looking for needed
information, and therefore give them more time to write actual code.


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
