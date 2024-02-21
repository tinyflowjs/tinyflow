# Tinyflow

![Test suite](https://github.com/chartonomy/tinyflowjs/workflows/Test%20suite/badge.svg)
[![Build and publish](https://github.com/chartonomy/tinyflowjs/actions/workflows/publish.yml/badge.svg)](https://github.com/chartonomy/tinyflowjs/actions/workflows/publish.yml)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
![GitHub](https://img.shields.io/github/license/chartonomy/tinyflowjs)

A lightweight workflow engine for all runtimes.
Highly extensive with minimal core and no dependencies.


## Features

- works with many JavaScript runtimes that support at least ES6 and Promises
- minimal core (xyzkb minified)
- very easy to use API
- highly extensible; writing an extension is a real no-brainer
- use declarative workflows and enrich them with custom functionality

## Installation

## Usage

Internally there are two classes, `Workflow` and `Step` that act for the whole engine.

### Events

| Class    | Name      | Info                                                                                                     | Data |
|----------|-----------|----------------------------------------------------------------------------------------------------------|------|
| Workflow | `started` | fired when the workflow has started, after all extensions were executed without error                    | 
| Workflow | `step`    | fired when a new step has entered                                                                        |
| Workflow | `end`     | fired when the workflow ended; read the workflow state to know whether it ended by complete or by cancel |
| Workflow | `error`   | fired when an error has been caught                                                                      |


### Examples

#### A simple log extension

```js
Tinyflow.use('log', ({ workflow, step }) => {
  if (workflow) {
    workflow.on('')
  }
  if (step) {
    
  }
})
```

#### Restore

```js
const restore = (definitions, snapshot) => {
  if (instances.has(snapshot.id)) {
    throw new TinyflowError(`There is already an active workflow by id ${snapshot.id}`)
  }

  const instanceId = snapshot.id
  const wfOptions = { instanceId }
  const wf = Tinyflow.create(definitions, wfOptions)
  wf.start()
  wf.step(snapshot.current.name, { stepId: snapshot.current.id })

  if (typeof snapshot.current.data === 'object') {
    wf.current.update(snapshot.current.data)
  }

  return wf
}
```

## API Documentation

## Covered environments

Our goal is to Tinyflow executable in as many environments as possible.
The following list shows, what's currently covered:

| Environment        | latest versions | known issues |
|--------------------|-----------------|--------------|
| Node.js            |                 |              |
| Deno               |                 |              |
| Bun                |                 |              |
| Cloudflare workers |                 |              |

| Browser         | tested versions | known issues |
|-----------------|-----------------|--------------|
| Chrome          |                 |              |
| Safari          |                 |              |
| Safari (iOS)    |                 |              |
| Firefox         |                 |              |
| Opera           |                 |              |
| Android Webview |                 |              |
| ...             |                 |              |


## Contribution and Development

We provide an [extensive contribution guideline](./CONTRIBUTING.md) and a [code of conduct](./CODE_OF_CONDUCT.md)
to help you in making your contribution a success!

### Tools / stack

* 🗪 [Babel](https://babeljs.io/) for transpiling
* 🪄 [Standard](https://standardjs.com/) for linting
* ⚗️ [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com) for testing
* 🔍 [c8](https://github.com/bcoe/c8) for code coverage
* 📚 [JSDoc](https://jsdoc.app/) for documentation and [jsdoc-to-markdown](https://www.npmjs.com/package/jsdoc-to-markdown) to create docs as markdown files
* ⚡ [GitHub actions](https://github.com/features/actions) for continuous integration
* 📦 [Rollup](https://rollupjs.org) for bundling

All tools are defined as **`dev-dependencies`**!


### Development scripts

We provide a default set of dev-tools via npm scripts. Run a script via

```shell
$ npm run <command>
```

where `<command>` is one of the following available commands:

| command         | description                                       | output     |
|-----------------|---------------------------------------------------|------------|
| `lint`          | runs the linter in read-mode                      |            |
| `lint:fix`      | runs the linter; fixes minor issues automatically |            |
| `test`          | runs the tests once                               |            |
| `test:watch`    | runs the tests; re-runs them on code changes      |            |
| `test:coverage` | runs the tests once and creates a coverage report | `coverage` |
| `docs`          | creates API documentation                         | `docs`     |
| `build`         | builds the bundles for several target platforms   | `dist`     |
| `build:full`    | runs `build` and `docs`                           | see above  |


## Security

Please read our [security policy](./SECURITY.md) to get to know which versions are covered.

## License

MIT, see [license file](LICENSE)
