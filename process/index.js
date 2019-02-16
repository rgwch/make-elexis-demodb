/********************************************
 * This file is part of Make-Demodb         *
 * Copyright (c) 2019 by G. Weirich         *
 * License and terms: see LICENSE           *
 ********************************************/

const transfer_patient = require("./patient")
const { source, copytable } = require("../db")
const { loaddata } = require("../faker")
const create_views=require('./createviews')
const log = require("../logger")

/**
 * Main module of the processing. First, transfer some tables fully, then select the requested
 * number of random patient entries and process them.
 * @param {*} def
 */
const exec = async def => {
  if (def.random) {
    await loaddata()
  }
  await copytable("config")
  await copytable("userconfig")
  await copytable("vk_preise")
  await copytable("user_")
  await copytable("role")
  await copytable("user_role_joint")
  await copytable("right_")
  await copytable("role_right_joint")
  await copytable("xid")
  await copytable("etiketten")
  await copytable("etiketten_object_link")
  await copytable("etiketten_objclass_link")
  await copytable("dbimage")
  await copytable("reminders")
  await copytable("reminders_responsible_link")

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
    if (pat) {
      log.debug(`Finished ${pat.bezeichnung1} ${pat.bezeichnung2}, ${pat.geburtsdatum} `)
    }
  }
  await create_views()
  return "ok"
}

module.exports = exec
