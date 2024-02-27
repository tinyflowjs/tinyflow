/* eslint-env mocha */
import { Tinyflow } from '../../Tinyflow.js'
import { expect } from 'chai'
import { minimalFlow, setId, simpleId } from '@tinyflow/testutils'
import SimpleSchema from 'simpl-schema'
import Ajv from 'ajv'

describe('Integration - extensions', function () {
  let disposeExtension
  before(() => {
    disposeExtension = Tinyflow.extend(({ extensions }, { Tinyflow, Workflow }) => {
      Tinyflow.clear = () => extensions.clear()
      Tinyflow.create = def => new Workflow(def)
      return () => {
        delete Tinyflow.clear
        delete Tinyflow.create
      }
    })
  })
  after(() => {
    disposeExtension()
  })

  let instanceId
  let restoreId
  beforeEach(() => {
    instanceId = simpleId()
    restoreId = Tinyflow.extend(setId(() => instanceId))
  })
  afterEach(() => {
    Tinyflow.clear({ extensions: true })
    restoreId()
  })

  describe('for workflow (sync)', function () {
    const expectFail = ({ schema, instanceId = simpleId(), message }) => {
      const def = minimalFlow()
      def.validate = schema

      const workflow = Tinyflow.create(def)
      expect(() => workflow.start())
        .to.throw(message)
      // start prevented
      expect(workflow.state).to.equal('pending')
      expect(workflow.current).to.equal(null)
    }

    it('allows to manually validate workflow using an extensions', () => {
      Tinyflow.use('validate', (schema, { workflow }) => {
        // TODO test integration with a few schema libs
        //   like zod, jsonschema, ajv, simpl-schema etc.
        if (workflow.name !== schema.name) {
          throw new Error(`Expected name ${schema.name}, got ${workflow.name}`)
        }
        if (workflow.id !== schema.id) {
          throw new Error(`Expected name ${schema.id}, got ${workflow.id}`)
        }
        workflow.steps.forEach((step, index) => {
          const expected = schema.steps[index]
          if (step.name !== expected) {
            throw new Error(`Expected name ${expected}, got ${step.name}`)
          }
        })
      })

      expectFail({
        schema: { name: 'bar' },
        message: 'Expected name bar, got foo'
      })
      expectFail({
        instanceId,
        schema: { name: 'foo', id: '1234' },
        message: `Expected name 1234, got ${instanceId}`
      })
      expectFail({
        instanceId,
        schema: { name: 'foo', id: instanceId, steps: ['one', 'moo'] },
        message: 'Expected name moo, got two'
      })
    })
    it('works with ajv', () => {
      Tinyflow.use('validate', (schema, { workflow }) => {
        const ajv = new Ajv()
        const validate = ajv.compile(schema)
        const valid = validate(workflow)
        if (!valid) {
          const e = validate.errors[0]
          throw new Error(`${e.instancePath} ${e.message}`)
        }
      })

      expectFail({
        schema: {
          properties: {
            name: {
              type: 'string',
              minLength: 5
            },
            id: { type: 'string' }
          },
          required: ['name', 'id'],
          additionalProperties: true
        },
        message: '/name must NOT have fewer than 5 characters'
      })
    })
    it('works with SimpleSchema', () => {
      Tinyflow.use('validate', (schema, { workflow }) => {
        const instance = new SimpleSchema(schema, {
          clean: {
            autoConvert: true,
            filter: true,
            getAutoValues: true,
            removeEmptyStrings: true,
            removeNullsFromArrays: false,
            trimStrings: true
          },
          humanizeAutoLabels: false,
          requiredByDefault: false
        })
        instance.validate(workflow)
      })

      expectFail({
        schema: {
          name: { type: String, allowedValues: ['bar'] },
          id: String,
          steps: {
            type: Array
          },
          'steps.$': {
            type: Object,
            blackbox: true
          },
          custom: {
            type: Object,
            blackbox: true
          },
          current: {
            type: Object,
            blackbox: true
          },
          data: {
            type: Object,
            blackbox: true
          },
          state: String
        },
        message: 'foo is not an allowed value'
      })
    })
  })
})
