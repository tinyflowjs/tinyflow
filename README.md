<div align="center">
  <img src="logo.svg" width="64">
  <h1>Tinyflow</h1>
</div>
<p align="center">
A lightweight workflow engine for all runtimes.
Highly extensive with minimal core and no dependencies.
</p>
<div align="center">

![Test suite](https://github.com/chartonomy/tinyflowjs/workflows/Test%20suite/badge.svg)
[![Build and publish](https://github.com/chartonomy/tinyflowjs/actions/workflows/publish.yml/badge.svg)](https://github.com/chartonomy/tinyflowjs/actions/workflows/publish.yml)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
![GitHub](https://img.shields.io/github/license/chartonomy/tinyflowjs)

</div>

<div align="center">

</div>

## Note: WIP

This project is close to become published. Check out the release section for current release-candidates.

## Features

- 📦 no dependencies and no runtime-specific dependencies (besides ES6 + Promises)
- 🪶 minimal core with (xkb; see the [sizes table](#file-sizes))
- 🧠 very easy to use API
- 🧩 highly extensible from the ground up
- 📝 use declarative workflows and enrich them with custom functionality

## Table of Contents

## Installation

### via NPM

```js
$ npm install @tinyflow/core
```

### via Yarn

```js
$ yarn add @tinyflow/core
```

### in Deno

```js
// from NPM
import { Tinyflow } from "npm:@tinyflow/core";
// or from cdn
import { Tinyflow } from "https://esm.sh/@tinyflow/core";
```

### in Bun

```js
$ bun install @tinyflow/core
```

### via CDN

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



### Events

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
