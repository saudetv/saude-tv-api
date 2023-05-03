require("dotenv").config({
  path: ".env",
});

const winston = require("winston"),
  WinstonCloudWatch = require("winston-cloudwatch");
const logger = new winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      timestamp: true,
      colorize: true,
    }),
  ],
});

const cloudwatchConfig = {
  logGroupName: "healthy-tv-api",
  logStreamName: `healthy-tv-api-${process.env.NODE_ENV}`,
  awsRegion: "us-east-1",
  messageFormatter: ({ level, message, additionalInfo }) =>
    `[${level}] : ${message} \nAdditional Info: ${JSON.stringify(
      additionalInfo
    )}}`,
};
logger.add(new WinstonCloudWatch(cloudwatchConfig));

module.exports = logger;
