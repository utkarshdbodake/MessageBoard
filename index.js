'use strict'

const Hapi = require('hapi')
const Constants = require('./lib/constants')
const MessageBoardRouter = require('./lib/routes')
const MongoConnection = require('./lib/model/connection') // eslint-disable-line no-unused-vars

const server = new Hapi.Server()


server.connection({
  port: Constants.SERVER.PORT
})

server.route(MessageBoardRouter.routes)

server.start(err => {

  if (err) {
    throw err
  }
})

server.route({
  method: 'GET',
  path: '/ping',
  handler: function (req, res) {
    return res('PONG')
  }
})
