const fetch = require("node-fetch")
const transfer_patient = require("./patient")
const { source, dest, checkinsert } = require("../db")
const { loaddata } = require('../faker/faker')
const log = require('../logger')

const exec = async def => {
  if (def.random) {
    await loaddata()
  }
  const config = await source('config')
  for (const entry of config) {
    await checkinsert('config', entry)
  }
  const userconfig = await source('userconfig')
  for (const entry of userconfig) {
    await checkinsert('userconfig',entry)
  }

  const patids = await source("kontakt")
    .where({ istpatient: "1", deleted: "0" })
    .whereNotNull("geburtsdatum")
    .whereNot("geburtsdatum", "")
    .select("id")
  const l = patids.length
  log.info(`found ${l} entries, selecting ${def.number}`)
  for (let i = 0; i < def.number; i++) {
    let idx = def.random ? Math.round(l * Math.random()) : i
    while (patids[idx] == "") {
      idx += 1
      if (idx >= l) {
        idx = 0
      }
    }
    const patid = patids[idx]
    patids[idx] = ""
    log.info(`Processing ${patid.id}`)
    const pat = await transfer_patient(patid.id)
    log.debug(`Finished ${pat.bezeichnung1} ${pat.bezeichnung2}, ${pat.geburtsdatum} `)
  }
  return "ok"
}

module.exports = exec
