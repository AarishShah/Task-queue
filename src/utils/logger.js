const winston = require('winston');

// Logger setup for task completion
const logger = winston.createLogger(
  {
    transports: [new winston.transports.File({ filename: 'task_logs.log' }),],
  });

// Function to log tasks
const logTask = (message) =>{
  logger.info(message);
};

module.exports = { logTask };
