'use strict'

const Constants = require('./../constants')
const MessageBoardHandler = require('./../handler')
const MessageBoardValidator = require('./../validator')

const routes = []

/**
 * Gets the messages.
 */
routes.push({
  method: 'GET',
  path: Constants.BASE_API + '/messages',
  config: {
    handler: MessageBoardHandler.getMessages,
    validate: MessageBoardValidator.getMessages
  }
})

/**
 * Insert message.
 */
routes.push({
  method: 'POST',
  path: Constants.BASE_API + '/messages',
  config: {
    handler: MessageBoardHandler.insertMessage,
    validate: MessageBoardValidator.insertMessage
  }
})

/**
 * /**
 * Delete the message with given messageId.
 */
routes.push({
  method: 'DELETE',
  path: Constants.BASE_API + '/messages/{messageId}',
  config: {
    handler: MessageBoardHandler.deleteMessage,
    validate: MessageBoardValidator.deleteMessage
  }
})

/**
 * Delete all messages.
 */
routes.push({
  method: 'DELETE',
  path: Constants.BASE_API + '/messages',
  config: {
    handler: MessageBoardHandler.deleteAllMessages,
    validate: MessageBoardValidator.deleteAllMessages
  }
})


module.exports = {
  routes
}
