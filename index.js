const processor = require("./process")
const mysql = require("mysql2")
const cfg = require("config")
const log = require('./logger')
const spawn = require('child_process')

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
