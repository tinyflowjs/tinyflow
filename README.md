<div align="center">
  <img src="logo.svg" width="64">
  <h1>Tinyflow</h1>
</div>
<p align="center">
A lightweight workflow engine for all runtimes.
Highly extensive with minimal core and no dependencies.
</p>
<div align="center">

[![Test suite](https://github.com/tinyflowjs/tinyflow/actions/workflows/testsuite.yml/badge.svg)](https://github.com/tinyflowjs/tinyflow/actions/workflows/testsuite.yml)
[![Publish packages](https://github.com/tinyflowjs/tinyflow/actions/workflows/publish.yml/badge.svg)](https://github.com/tinyflowjs/tinyflow/actions/workflows/publish.yml)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![CodeQL](https://github.com/tinyflowjs/tinyflow/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/tinyflowjs/tinyflow/actions/workflows/codeql-analysis.yml)
[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
![GitHub License](https://img.shields.io/github/license/tinyflowjs/tinyflow)

</div>

<div align="center">

[Documentation](https://tinyflowjs.github.io/tinyflow/)
·
[Releases](https://github.com/tinyflowjs/tinyflow/releases)

</div>

> ‼️ WIP Note:
> This project is close to it's first release. Check out the [release section](https://github.com/tinyflowjs/tinyflow/releases)
for current release-candidates.

## Features

- 📦 no dependencies and no runtime-specific dependencies (besides ES6 + Promises)
- 🪶 minimal core with (xkb; see the [sizes table](#file-sizes))
- 🧠 very easy to use API
- 🧩 highly extensible from the ground up
- 📝 use declarative workflows and enrich them with custom functionality

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
  - [via NPM](#via-npm)
  - [via Yarn](#via-yarn)
  - [in Deno](#in-deno)
  - [in Bun](#in-bun)
  - [via CDN](#via-cdn)
  - [Entry Points](#entry-points)
- [Usage](#usage)
  - [Events](#events)
    - [Workflow Class Events](#workflow-class-events)
    - [Step Class Events](#step-class-events)
- [Covered environments](#covered-environments)
- [File sizes](#file-sizes)
- [Contribution and Development](#contribution-and-development)
  - [Tools / stack](#tools--stack)
  - [Development scripts](#development-scripts)
- [Security](#security)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

### Using Package Managers and Platforms

Our goal is to make Tinyflow usable anyhwere JavaScript is running.
The following table shows some options to install Tinyflow's `core` package, the most minimal deliverable:

| name       | command                                                     | tested |
|------------|-------------------------------------------------------------|--------|
| npm        | `npm install @tinyflow/core`                                |        |
| yarn       | `yarn add @tinyflow/core`                                   |
| deno (npm) | `import { Tinyflow } from "npm:@tinyflow/core";`            |
| deno (cdn) | `import { Tinyflow } from "https://esm.sh/@tinyflow/core";` |
| bun        | `bun install @tinyflow/core`                                |

### Using a CDN

- unpkg
- jsdelivr
- cdnjs
- esm.sh
- jspm
- github (not for production!)

### Entry Points

Tonyflow packages offer multiple entry point files, suited for different environments.
Nowadays, you might want to stick with ESM but we also provide cjs, es5 and iife versions of the build, including
sourcemaps and a minified version, too.

They're all placed in the respective package's `/dist` folder and committed to this repository.

## Usage

Internally there are two classes, `Workflow` and `Step` that act for the whole engine.
If you only want the `core` package then you will have to manage them manually.

Depending on your use-case, this might be exactly what you want or not want.
If you want a more comfortable solution (suitable for beginners), you might also want to install `@tinyflow/instances`.

### Minimal Example

If you want to have the most minimal size, then you will have to manage everything on your own.
Here is an example for that:

```js
import { Workflow } from '@tinyflow/core'

// create a new workflow
const workflow = new Workflow({
  name: 'checkout-cart',
  steps: {
    visit: {},
    paymentOptions: {},
    complete: {}
  }
})

// listen to workflow events
workflow.on('started', () => console.debug('workflow started'))
workflow.on('step', () => console.debug('new step is mounted', workflow.current))
workflow.on('error', ({ error }) => console.error(error))
workflow.on('end', () => {
  workflow.off() // remove all events
  console.debug('workflow ended with data', workflow.data)
})

workflow.start()

// ... at some point in your code
// update the current step's data
workflow.current.update({ some: 'data' })

// or complete the current step, causing
// workflow to move to the next step or end
workflow.current.complete()
```

### Extensions

The real power of Tinyflow is it's ability to easily extend functionality.
For this, there are two main methods (in fact, the `Tinyflow` object in `core` contains only them):

#### `Tinyflow.extend` - Extend `Tinyflow` and it's very internals

As a very simple example, we can create an id function that uses the Browser's crypto API to generate uuids: 

```js
const restoreId = Tinyflow.extend(internals => {
  const original = internals.id
  internals.id = () => window.crypto.randomUUID()
  
  // calling this method will rstore the default id generation
  return () => {
    internals.id = original
  }
})

const wf = new Workflow({ name: 'foo', steps: { one: {} }})
wf.id // "54b281b4-6ee1-4747-97a5-46543f71f359"

// call he restore function if your extension 
// should exist only for a limited time
restoreId()
```

As you can see, all internals remain scoped within that function (unless you intend to do fancy stuff...).


#### `Tinyflow.use` - Create a workflow runtime extension that executes, before a workflow or step startes

As a very simple example for this one, we can create a simple 

#### More Examples

We have more examples ready in [our documentation's examples section](./docs/examples).
Some of them can be executed directly in the browser or using node/deno/bun.

#### New Core Extensions

Some extensions might not be ready to be published yet. 
They are currently located the in the [/next folder](./next).
If you think you have a good idea for a core extension, 
then please open an issue and choose the issue template for extensions.

### Events

The `core` package brings two main classes that emit several events during the engine execution.

#### Workflow Class Events

| Name      | Info                                                                                                     | Data |
|-----------|----------------------------------------------------------------------------------------------------------|------|
| `started` | fired when the workflow has started, after all extensions were executed without error                    |
| `step`    | fired when a new step has entered                                                                        | the workflow's `data` property will contain the data from the previous step at this point
| `end`     | fired when the workflow ended; read the workflow state to know whether it ended by complete or by cancel | the workflow's `data` property will contain all steps data
| `error`   | fired when an error has been caught                                                                      |

#### Step Class Events

| Name     | Info                                                                                             | Data |
|----------|--------------------------------------------------------------------------------------------------|------|
| `started` | fired when the step has started, after all extensions were executed without error                |
| `update` | fired when a step has received new data via `update`                                             | the `data` will contain the latest updated data
| `end`    | fired when the step ended; read the it's `state` to know whether it ended by complete or by cancel | the step's `data` property will contain all steps final data
| `error`  | fired when an error has been caught                                                              |

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

You can help out with testing for these environments, so we can maximize the compatibility overall.

## File sizes

Tinyflow comes with a minimal core but also provides extensions out-of-the-box.
At the same time we build Tinyflow for multiple outputs.

The following table shows the size of the various builds, available in their respective `/dist` folders.
Note, that this overview shows only the sizes for the minified versions of each, excluding sourcemaps. 

| package               | esm             | cjs                                                                                                                              | es5                                                                                                                                        | iife |
|-----------------------|-----------------|----------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|------|
| `@tinyflow/core`      |![GitHub file size in bytes](https://img.shields.io/github/size/tinyflowjs/tinyflow/packages%2Fcore%2Fdist%2FTinyflow.min.js)| ![GitHub file size in bytes](https://img.shields.io/github/size/tinyflowjs/tinyflow/packages%2Fcore%2Fdist%2FTinyflow.cjs.min.js) | ![GitHub file size in bytes](https://img.shields.io/github/size/tinyflowjs/tinyflow/packages%2Fcore%2Fdist%2FTinyflow.es5.min.js)          |![GitHub file size in bytes](https://img.shields.io/github/size/tinyflowjs/tinyflow/packages%2Fcore%2Fdist%2FTinyflow.iife.min.js)
| `@tinyflow/instances` |![GitHub file size in bytes](https://img.shields.io/github/size/tinyflowjs/tinyflow/packages%2Finstance%2Fdist%2FwithInstances.min.js)|![GitHub file size in bytes](https://img.shields.io/github/size/tinyflowjs/tinyflow/packages%2Finstance%2Fdist%2FwithInstances.cjs.min.js)| ![GitHub file size in bytes](https://img.shields.io/github/size/tinyflowjs/tinyflow/packages%2Finstance%2Fdist%2FwithInstances.es5.min.js) |![GitHub file size in bytes](https://img.shields.io/github/size/tinyflowjs/tinyflow/packages%2Finstance%2Fdist%2FwithInstances.iife.min.js)

## Contribution and Development

We provide an [extensive contribution guideline](./CONTRIBUTING.md) and a [code of conduct](./CODE_OF_CONDUCT.md)
to help you in making your contribution a success!

### Tools / stack

* 🗪 [Babel](https://babeljs.io/) for transpiling
* 🪄 [Standard](https://standardjs.com/) for linting
* ⚗️ [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com) for testing
* 🔍 [c8](https://github.com/bcoe/c8) for code coverage
* 📚 [JSDoc](https://jsdoc.app/) for documentation
  and [jsdoc-to-markdown](https://www.npmjs.com/package/jsdoc-to-markdown) to create docs as markdown files
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
