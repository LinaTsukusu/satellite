import * as log4js from 'log4js'

log4js.configure({
  appenders: {
    system: {type: 'console'},
  },
  categories: {
    default: {
      appenders: ['system'],
      level: 'trace',
    },
  },
})

export const logger = log4js.getLogger('system')
