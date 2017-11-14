const log4js = require('log4js');
const LOG_LEVEL = 'info';

log4js.configure({
  appenders: { CONSOLE: { type: 'console' }},
  categories: { default: { appenders: ['CONSOLE'], level: LOG_LEVEL } }
});

module.exports = log4js.getLogger();
