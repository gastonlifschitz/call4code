require('express-async-errors');

const winston = require('winston');

module.exports = function() {
  const format = winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  );

  winston.exceptions.handle(
    new winston.transports.Console({
      format
    }),
    new winston.transports.File({
      filename: 'uncaughtException.log',
      format: winston.format.simple()
    })
  );

  //subscription to process
  process.on('uncaughtRejection', ex => {
    throw ex;
  });

  winston.add(
    new winston.transports.File({
      filename: 'logfile.log',
      level: 'error'
    })
  );

  console.log('Winston loaded.');
};
