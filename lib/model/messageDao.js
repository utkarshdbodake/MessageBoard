'use strict'

const Promise = require('bluebird')
const MessageSchema = require('./schema/message')
const Constants = require('./../constants')


/**
 * @typedef {Object} Meta
 *
 * @property {String} [source]
 * @property {Number} [time]
 */

/**
 * @typedef {Object} Message
 *
 * @property {String} text
 * @property {Meta} meta
 */


/**
 * Gets the messages.
 *
 * @param {Number} timeCursor
 * @param {String} direction
 * @param {Number} pageSize
 * return {Promise<Message[]>}
 */
const getMessages = function (timeCursor, direction, pageSize) {
  return Promise.try(() => {

    const query = {}

    if (timeCursor) {

      if (direction === Constants.PAGINATION.DIRECTION.BACKWARD) {
        query['meta.time'] = {$gt: timeCursor}
      }
      else if (direction === Constants.PAGINATION.DIRECTION.FORWARD) {
        query['meta.time'] = {$lt: timeCursor}
      }
    }

    const sortOrder = { 'meta.time': -1 }

    if (pageSize) {
      return MessageSchema.find(query).limit(pageSize).sort(sortOrder).lean().exec()
    }

    return MessageSchema.find(query).sort(sortOrder).lean().exec()
  })
}


/**
 * Inserts the new message.
 *
 * @param {Message} message
 * @return {Promise}
 */
const insert = function (message) {

  const messageObject = new MessageSchema({
    text: message.text,
    meta: {
      source: message.meta.source
    }
  })

  return messageObject.save()
}


/**
 * Deletes the message with the given message id.
 *
 * @param {Mongo.ObjectId} messageId
 * @return {Promise}
 */
const deleteOne = function (messageId) {

  return MessageSchema.remove({ _id: messageId })
}


/**
 * Deletes all the messages.
 *
 * @return {Promise}
 */
const deleteAll = function () {

  return MessageSchema.remove()
}


module.exports = {
  insert,
  getMessages,
  deleteOne,
  deleteAll
}
