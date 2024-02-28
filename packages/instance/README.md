# Tinyflow Instances

A simple [Tinyflow](https://github.com/tinyflowjs/tinyflow) extension to manage instances.

## Installation

The package is released at the npm registry as `@tinyflow/instances`.

You can follow the [installation instructions in the main readme](https://github.com/tinyflowjs/tinyflow?tab=readme-ov-file#installation).

## Usage

First register the extension:
```js
import { Tinyflow } from '@tinyflow/core'
import { withInstances } from '@tinyflow/instances'

const removeExtension = Tinyflow.extend(withInstances())

// ...you may later remove this extension:
removeExtension()
```

After that, you can manage instances via the `Tinyflow` object:

```js
let wf = Tinyflow.create({
  name: 'foo',
  steps: { one: {}, two: {} }
})

const instanceId = wf.id

// ... somewhere later in code
wf = Tinyflow.get(instanceId)

// or dispose the instance
Tinyflow.dispose(instanceId)
```

## API Docs
See the full the API documentation as

- [markdown version](./api.md)
- [html version](https://tinyflowjs.github.io/tinyflow/api/instances/)
