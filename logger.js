/********************************************
 * This file is part of Make-Demodb         *
 * Copyright (c) 2019 by G. Weirich         *
 * License and terms: see LICENSE           *
 ********************************************/

const winston = require("winston")
const cfg = require("config")

const logger = winston.createLogger({
  level: cfg.get("process.loglevel"),
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
})

module.exports=logger
