'use strict'

const mongoose = require('mongoose')
const Connection = require('./../connection')
const Schema = mongoose.Schema


const metaSchema = new Schema({

  source: { type: String },
  time: {
    type: Number,
    default: Date.now,
    index: true
  }
}, {_id: false})


/*
 * This schema is used to store the messages of the MessageBoard.
 */
const messageSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  meta: metaSchema
}, { collection: 'messages' })


module.exports = Connection.messageBoardDbConnect.model('messages', messageSchema)
