'use strict'

const should = require('should')
const rewire = require('rewire')
const Fixtures = require('./../fixtures')
const MessageBoardControllerRewire = rewire('./../../lib/controller/messageBoardController')

describe('test messageBoardController', function () {

  describe('test _deserializeMessages', function () {

    const _deserializeMessages = MessageBoardControllerRewire.__get__('_deserializeMessages')

    it('deserializes messages successfully', (done) => {

      const testId = 'testId'
      let messages = Fixtures.messages()

      for (const message of messages) {
        message._id = testId
        message.__v = 1
      }

      const deserializedMessages = _deserializeMessages(messages)

      should.not.exist(deserializedMessages[0]._id)
      should.not.exist(deserializedMessages[0].__v)
      deserializedMessages[0].id.should.eql(testId)
      done()
    })
  })
})
