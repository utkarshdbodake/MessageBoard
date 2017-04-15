
'use strict'

const _ = require('lodash')

const message1 = {
  text: 'Test hello world 1',
  meta: {
    source: '127.0.0.1'
  }
}

const message2 = {
  text: 'Test hello world 2',
  meta: {
    source: '127.0.0.2'
  }
}

const message3 = {
  text: 'Test hello world 3',
  meta: {
    source: '127.0.0.3'
  }
}

const messages = [ message1, message2, message3 ]

module.exports = {
  message: () => _.cloneDeep(message1),
  messages: () => _.cloneDeep(messages)
}
