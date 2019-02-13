const winston = require("winston")
const cfg = require("config")

const logger = winston.createLogger({
  level: cfg.get("process.loglevel"),
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
})

module.exports=logger
