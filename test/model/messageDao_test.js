'use strict'

const Promise = require('bluebird')
const co = Promise.coroutine
const should = require('should')
const MessageDao = require('./../../lib/model/messageDao')
const Constants = require('./../../lib/constants')
const Fixtures = require('./../fixtures')


describe('test messageDao', function () {

  before(() => MessageDao.deleteAll())

  afterEach(() => MessageDao.deleteAll())


  describe('test getMessages', function () {

    it('get all the messages in a board', () => {
      return co(function* () {

        const messages = Fixtures.messages()

        yield MessageDao.insert(messages[0])
        yield MessageDao.insert(messages[1])
        yield MessageDao.insert(messages[2])

        const result = yield MessageDao.getMessages()

        result.length.should.eql(3)
      })()
    })

    it('with pageSize limiter', () => {
      return co(function* () {

        const messages = Fixtures.messages()

        yield MessageDao.insert(messages[0])
        yield MessageDao.insert(messages[1])
        yield MessageDao.insert(messages[2])

        const result = yield MessageDao.getMessages(null, null, 2)

        result.length.should.eql(2)
      })()
    })

    it('with timeCursor and backward direction', () => {
      return co(function* () {

        const messages = Fixtures.messages()

        yield MessageDao.insert(messages[0])
        yield MessageDao.insert(messages[1])
        yield MessageDao.insert(messages[2])

        const result = yield MessageDao.getMessages(new Date().getTime(), Constants.PAGINATION.DIRECTION.BACKWARD, null)

        result.length.should.eql(0)
      })()
    })

    it('with timeCursor and forward direction', () => {
      return co(function* () {

        const messages = Fixtures.messages()

        yield MessageDao.insert(messages[0])
        yield MessageDao.insert(messages[1])
        yield MessageDao.insert(messages[2])

        const result = yield MessageDao.getMessages(new Date().getTime(), Constants.PAGINATION.DIRECTION.FORWARD, null)

        result.length.should.eql(3)
      })()
    })

    it('sorted with descending times', () => {
      return co(function* () {

        const messages = Fixtures.messages()

        yield MessageDao.insert(messages[0])
        yield MessageDao.insert(messages[1])
        yield MessageDao.insert(messages[2])

        const result = yield MessageDao.getMessages(new Date().getTime(), Constants.PAGINATION.DIRECTION.FORWARD, null)

        const timeGap1 = result[0].meta.time - result[1].meta.time
        const timeGap2 = result[1].meta.time - result[2].meta.time

        timeGap1.should.be.above(0)
        timeGap2.should.be.above(0)
      })()
    })
  })


  describe('test insert', function () {

    it('with correct arguments, return success', () => {

      const message = Fixtures.message()

      return MessageDao.insert(message)
    })

    it('with some compulsory arguments missing', () => {

      const message = { meta: {} }

      return MessageDao.insert(message)

        .catch(err => should.exist(err))
    })
  })


  describe('test deleteOne', function () {

    it('with wrong _id', () => {

      return MessageDao.deleteOne('12345')

        .catch(err => should.exist(err))
    })

    it('success deleting', () => {
      return co(function* () {

        const messages = Fixtures.messages()

        yield MessageDao.insert(messages[0])

        const result = yield MessageDao.getMessages(new Date().getTime(), Constants.PAGINATION.DIRECTION.FORWARD, null)

        yield MessageDao.deleteOne(result[0]._id)
      })()
    })
  })


  describe('test deleteAll', function () {

    it('all messages already deleted', () => {

      return MessageDao.deleteAll()
    })

    it('success deleting all messages', () => {
      return co(function* () {

        const messages = Fixtures.messages()

        yield MessageDao.insert(messages[0])
        yield MessageDao.insert(messages[1])
        yield MessageDao.insert(messages[2])

        const result = yield MessageDao.getMessages(null, null, null)

        result.length.should.eql(3)

        yield  MessageDao.deleteAll()

        const result1 = yield MessageDao.getMessages(null, null, null)

        result1.length.should.eql(0)
      })()
    })
  })
})
