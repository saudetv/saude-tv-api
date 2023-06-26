require("dotenv").config({
  path: ".env",
});

const winston = require("winston");
const AWS = require("aws-sdk");
const WinstonCloudWatch = require("winston-cloudwatch");
const { Mutex } = require("async-mutex");

const cloudwatchConfig = {
  logGroupName: "healthy-tv-api",
  logStreamName: `healthy-tv-api-${process.env.NODE_ENV}`,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion: "us-east-1",
  messageFormatter: ({ level, message, additionalInfo }) =>
    `[${level}] : ${message} \nAdditional Info: ${JSON.stringify(
      additionalInfo
    )}}`,
};

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      timestamp: true,
      colorize: true,
    }),
    new WinstonCloudWatch(cloudwatchConfig),
  ],
});

// Configurar o AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
});

// Criar uma nova instância do CloudWatchLogs
const cloudwatchlogs = new AWS.CloudWatchLogs();

logger.on("error", function (error) {
  console.log("Erro ao escrever no CloudWatch: ", error);
});

let sequenceToken = null;
const logBuffer = [];
const mutex = new Mutex();

async function logToCloudWatch(level, message) {
  const release = await mutex.acquire();
  logBuffer.push({
    message: `${level}: ${message}`,
    timestamp: Date.now(),
  });
  release();
}

async function processBuffer() {
  const release = await mutex.acquire();
  if (logBuffer.length === 0) {
    release();
    return;
  }
  const logEvents = logBuffer.splice(0, logBuffer.length);
  release();

  const params = {
    logEvents: logEvents,
    logGroupName: "healthy-tv-api",
    logStreamName: `healthy-tv-api-${process.env.NODE_ENV}`,
    sequenceToken: sequenceToken,
  };

  cloudwatchlogs.putLogEvents(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      sequenceToken = data.nextSequenceToken;
    }
  });
}

const originalLog = logger.log;

logger.log = function (level, message) {
  originalLog.apply(logger, arguments);
  logToCloudWatch(level, message);
};

module.exports = logger;

// Inicia um loop que envia logs ao CloudWatch a cada 5 segundos
setInterval(processBuffer, 5000);
