const processor = require("./process")
const mysql = require("mysql2")
const cfg = require("config")

const conn = mysql.createConnection({
  host: cfg.get("dest.connection.host"),
  user: cfg.get("dest.connection.user"),
  password: cfg.get("dest.connection.password")
})

const destdb = cfg.get("dest.connection.database")
conn.query("DROP DATABASE " + destdb, err => {
  conn.query("CREATE DATABASE " + destdb, err => {
    if (err) {
      throw err
    }
    conn.end()
    processor(cfg.get("process"))
      .then(result => {
        console.log(result)
      })
      .catch(err => {
        console.log("***FEHLER*** " + err)
      })
  })
})
