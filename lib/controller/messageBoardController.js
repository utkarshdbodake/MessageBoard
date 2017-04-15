'use strict'

const _ = require('lodash')
const Promise = require('bluebird')
const mongoose = require('mongoose')

const MessageDao = require('./../model/messageDao')



/**
 * Deserializes the messages.
 *
 * @param {Message[]} messages
 * @private
 */
const _deserializeMessages = function (messages) {

  for (const message of messages) {

    message.id = message._id
    delete message._id
    delete message.__v
  }

  return messages
}


/**
 * Gets the messages from the message board.
 * All messages are sorted as per the time in descending order.
 * ie. Latest first
 *
 * @param {Number} timeCursor
 * @param {String} direction
 * @param {Number} pageSize
 * @return {Promise<Message[]>}
 */
const getMessages = function (timeCursor, direction, pageSize) {


  return MessageDao.getMessages(timeCursor, direction, pageSize)

    .then(messages => _deserializeMessages(messages))
}


/**
 * Inserts the given message.
 *
 * @param {Message} message
 * @param {String} ipAddress
 * @return {Promise}
 */
const insertMessage = function (message, ipAddress) {

  message.meta = message.meta || {}
  message.meta.source = ipAddress

  return MessageDao.insert(message)
}


/**
 * Delete the message with the given message id.
 *
 * @param {String} messageId
 * @return {Promise}
 */
const deleteMessage = function (messageId) {

  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return Promise.reject(new Error(`Invalid messageId ${messageId}`))
  }

  messageId = mongoose.Types.ObjectId(messageId) // eslint-disable-line new-cap

  return MessageDao.deleteOne(messageId)

    .then(res => {

      if (_.get(res, 'result.n') === 0) {
        res.responseMessage = `Message with id ${messageId} is not present in public message board.`
      }

      return res
    })
}


/**
 * Deletes all the messages.
 *
 * @return {Promise}
 */
const deleteAllMessages = function () {

  return MessageDao.deleteAll()

    .then(res => {

      if (_.get(res, 'result.n') === 0) {
        res.responseMessage = `There are no messages in public message board to delete.`
      }

      return res
    })
}


module.exports = {
  getMessages,
  insertMessage,
  deleteMessage,
  deleteAllMessages
}
