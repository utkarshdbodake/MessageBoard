'use strict'


const Constants = {

  MONGO: {
    HOST: process.env.MONGO_HOST || 'localhost',
    PORT: process.env.MONGO_PORT || 27017,
    DATABASE: 'messageboard'
  },

  SERVER: {
    PORT: process.env.SERVER_PORT || 5000
  },

  BASE_API: '/message-board/api/v1/public',

  SECRET_TOKEN: process.env.SECRET_TOKEN || 'sdb~5$43@2ed*cv&4=32ew#fv',

  PAGINATION: {
    DIRECTION: {
      BACKWARD: 'backward',
      FORWARD: 'forward'
    }
  }
}

module.exports = Constants
