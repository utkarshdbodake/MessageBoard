'use strict'

const boom = require('boom')
const Constants = require('./../constants')
const MessageBoardController = require('../controller/messageBoardController')


/**
 * @param {Object} err
 * @param res
 * @private
 */
const _handleError = function (err, res) {

  const boomError = boom.create(400, err.message)

  if (err.data) {
    Object.assign(boomError.output.payload, { details: err.data })
  }

  return res(boomError)
}


/**
 * Gets the messages from the message board.
 * All messages are sorted as per the time in descending order.
 * ie. Latest first
 *
 * @param {Object} req
 * @param res
 */
const getMessages = function (req, res) {

  const timeCursor = parseInt(req.query.timeCursor)
  const direction = req.query.direction
  const pageSize = req.query.pageSize

  MessageBoardController.getMessages(timeCursor, direction, pageSize)

    .then(result => res(null, result))

    .catch(err => _handleError(err, res))
}

/**
 * Inserts the given message.
 *
 * @param {Object} req
 * @param res
 */
const insertMessage = function (req, res) {

  const message = req.payload.message
  const ipAddress = req.headers['x-forwarded-for'] || req.info.remoteAddress

  MessageBoardController.insertMessage(message, ipAddress)

    .then(() => res(null, { success: true, message: 'Message inserted successfully' }))

    .catch((err) => _handleError(err, res))
}


/**
 * Delete the message with the given message id.
 *
 * @param {Object} req
 * @param res
 */
const deleteMessage = function (req, res) {

  const messageId = req.params.messageId
  const secretToken = req.headers['secret-token']

  if (secretToken != Constants.SECRET_TOKEN) {

    return _handleError(new Error(`Invalid given secretToken ${secretToken}`), res)
  }

  MessageBoardController.deleteMessage(messageId)

    .then(result => {
      const message = result.responseMessage || `Message with id ${messageId} successfully deleted`
      res(null, { success: true, message: message })
    })

    .catch((err) => _handleError(err, res))
}


/**
 * Deletes all the messages.
 *
 * @param {Object} req
 * @param res
 */
const deleteAllMessages = function (req, res) {

  const secretToken = req.headers['secret-token']

  if (secretToken !== Constants.SECRET_TOKEN) {

    return _handleError(new Error('Invalid secretToken'), res)
  }

  MessageBoardController.deleteAllMessages()

    .then(result => {
      const message = result.responseMessage || 'All messages deleted successfully'
      res(null, { success: true, message: message })
    })

    .catch((err) => _handleError(err, res))
}


module.exports = {
  getMessages,
  insertMessage,
  deleteMessage,
  deleteAllMessages
}
