const log4js = require('log4js');
const LOG_LEVEL = 'info';

log4js.configure({
  appenders: { SAVA_TO_LEANCLOUD: { type: 'console' }, SAVE_TO_FILE: { type: 'file', filename: 'cli.log'}},
  categories: { default: { appenders: ['SAVA_TO_LEANCLOUD', 'SAVE_TO_FILE'], level: LOG_LEVEL } }
});

module.exports = log4js.getLogger();
