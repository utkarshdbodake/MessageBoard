'use strict'

const Joi = require('joi')


const getMessages = {

  query: Joi.object({
    timeCursor: Joi.number().integer().positive(),
    direction: Joi.string(),
    pageSize: Joi.number()
  }).and('timeCursor', 'direction').options({allowUnknown: true})
}


const insertMessage = {

  payload: Joi.object({
    message: Joi.object({
      text: Joi.string().required()
    }).required()
  }).options({allowUnknown: true})
}

const deleteMessage = {

  headers: Joi.object({
    'secret-token': Joi.string().required()
  }).options({ allowUnknown: true }),

  params: {
    messageId: Joi.string().required().description('Please enter prescriptionId') //compulsory authUid in params
  }
}

const deleteAllMessages = {

  headers: Joi.object({
    'secret-token': Joi.string().required()
  }).options({ allowUnknown: true })
}


module.exports = {
  getMessages,
  insertMessage,
  deleteMessage,
  deleteAllMessages
}
