'use strict'

const mongoose = require('mongoose')
const Constants = require('../../constants')


/**
 * Construct the Mongo database to connect to.
 *
 * @return {string}
 * @private
 */
const _getMessageBoardDbUrl = () => {
  return `mongodb://${Constants.MONGO.HOST}:${Constants.MONGO.PORT}/${Constants.MONGO.DATABASE}`
}


const socketOptions = {
  socketOptions: {
    keepAlive: 30000,         // number of ms the connection needs to timeout until a new connection is made
    connectTimeoutMS: 30000,  //maximum amount of time driver will wait for a connection to be established with the server
    socketTimeoutMS: 60000,   //how long to wait for responses from the server
    reconnectTries: 10,
    reconnectInterval: 5000   //Server will wait 5000 milliseconds between retries
  }
}

/*
 Mongoose can take both a connection string and a separate `user`
 and `pass` in options. Both work, but setting explicit user and
 pass overrides the ones in the URI.
 */
const mongoOptions = {
  promiseLibrary: require('bluebird'),
  server: socketOptions
}

const messageBoardDbConnect = mongoose.createConnection(_getMessageBoardDbUrl(), mongoOptions)

messageBoardDbConnect.on('error', err => {
  console.log(`MessageBoard: Mongoose failed to connect to the DB, err ${JSON.stringify(err)}`)
  process.exit(1)
})

messageBoardDbConnect.on('open', () => {
  console.log('MessageBoard: Mongoose has connected to the DB.')
})

messageBoardDbConnect.on('close', str => {
  console.log(`MessageBoard: Mongoose has disconnected from the db: ${str}.`)
})

module.exports = {
  messageBoardDbConnect: messageBoardDbConnect
}
