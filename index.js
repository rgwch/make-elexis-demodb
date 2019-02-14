/********************************************
 * This file is part of Make-Demodb         *
 * Copyright (c) 2019 by G. Weirich         *
 * License and terms: see LICENSE           *
 ********************************************/

const processor = require("./process")
const cfg = require("config")
const spawn = require('child_process')

/**
 * Entry point. We first launch the shellscript copy_structure which should create an empty destination database
 * with same structure as the source database. Then we launch process/index.js to copy the requested data.
 */
const conn=cfg.get("dest.connection")
spawn.execFileSync("./copy_structure",[conn.user,conn.password,cfg.get("source.connection.database"),conn.database])

processor(cfg.get("process"))
  .then(result => {
    console.log(result)
    process.exit(0)
  })
  .catch(err => {
    console.log("***FEHLER*** " + err)
    process.exit(-1)
  })
