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
if (process.env.NODE_ENV === "production") {
  const cloudwatchConfig = {
    logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
    logStreamName: `${process.env.CLOUDWATCH_GROUP_NAME}-${process.env.NODE_ENV}`,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: "us-east-1",
    messageFormatter: ({ level, message, additionalInfo }) =>
      `[${level}] : ${message} \nAdditional Info: ${JSON.stringify(
        additionalInfo
      )}}`,
  };
  logger.add(new WinstonCloudWatch(cloudwatchConfig));
}
module.exports = logger;
