const processor = require("./process")
const mysql = require("mysql2")
const cfg = require("config")
const log=require('./logger')


const conn = mysql.createConnection({
  host: cfg.get("dest.connection.host"),
  user: cfg.get("dest.connection.user"),
  password: cfg.get("dest.connection.password")
})

const destdb = cfg.get("dest.connection.database")
log.debug(`dropping database ${destdb}`)
conn.query("DROP DATABASE " + destdb, err => {
  if(err){
    log.info("Errmsg ",err)
  }
  log.debug(`creating database ${destdb}`)
  conn.query("CREATE DATABASE " + destdb, err => {
    if (err) {
      log.error("Fatal error ",err)
      throw err
    }
    conn.end()
    
    processor(cfg.get("process"))
      .then(result => {
        console.log(result)
        process.exit(0)
      })
      .catch(err => {
        console.log("***FEHLER*** " + err)
        process.exit(-1)
      })
  })
})
