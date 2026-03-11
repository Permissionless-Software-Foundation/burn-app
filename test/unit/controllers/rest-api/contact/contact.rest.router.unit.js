/*
  Unit tests for the REST API handler for the /users endpoints.
*/

// Public npm libraries
import { assert } from 'chai'
import sinon from 'sinon'
// Local support libraries
// const adapters = require('../../../mocks/adapters')
// const UseCasesMock = require('../../../mocks/use-cases')
// const app = require('../../../mocks/app-mock')

import ContactRouter from '../../../../../src/controllers/rest-api/contact/index.js'
let uut
let sandbox
const useCases = {}
const adapters = {}
// let ctx

// import mockContextModule from '../../../mocks/ctx-mock.js'
// const mockContext = mockContextModule.context

describe('#Contact-REST-Router', () => {
  // const testUser = {}

  beforeEach(() => {
    uut = new ContactRouter({ adapters, useCases })

    sandbox = sinon.createSandbox()

    // Mock the context object.
    // ctx = mockContext()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters are not passed in', () => {
      try {
        uut = new ContactRouter()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Adapters library required when instantiating Contact REST Controller.'
        )
      }
    })

    it('should throw an error if useCases are not passed in', () => {
      try {
        uut = new ContactRouter(({ adapters }))

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Use Cases library required when instantiating Contact REST Controller.'
        )
      }
    })
  })

  describe('#attach', () => {
    it('should throw an error if app is not passed in.', () => {
      try {
        uut.attach()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Must pass app object when attaching REST API controllers.'
        )
      }
    })
  })
})
