require("dotenv").config({
  path: ".env",
});

const winston = require("winston");

// Configuração do logger sem CloudWatch
const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      timestamp: true,
      colorize: true,
    }),
  ],
});

logger.on("error", function (error) {
  console.log("Erro no Logger: ", error);
});

module.exports = logger;
