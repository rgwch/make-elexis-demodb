/********************************************
 * This file is part of Make-Demodb         *
 * Copyright (c) 2019 by G. Weirich         *
 * License and terms: see LICENSE           *
 ********************************************/

const transfer_patient = require("./patient")
const { source, dest, copytable,checktransfer } = require("../db")
const { loaddata } = require("../faker")
const create_views = require('./createviews')
const log = require("../logger")

const fetchRecent = async num => {
  try {
    const sql = source('behandlungen').join('faelle', "behandlungen.fallid", "=", "faelle.id").distinct('faelle.patientid')
      .select('behandlungen.datum').orderBy('behandlungen.datum', "desc").limit(num)
    console.log(sql.toSQL())  
    const ids=await(sql)  
    return ids.map(el=>el.patientid);
  } catch (err) {
    log.error("Error while fetching recent", err)
  }
}

const fetchRandom = async num => {
  const patids = await source("kontakt")
    .where({ istpatient: "1", deleted: "0" })
    .whereNotNull("geburtsdatum")
    .whereNot("geburtsdatum", "")
    .select("id")
  const l = patids.length
  const ret = []
  for (let i = 0; i < num; i++) {
    let idx = Math.round(l * Math.random())
    while (ret.some(i=>ret[i]==patids[idx].id)) {
      idx += 1;
      if (idx >= l) {
        idx = 0
      }
    }
    ret.push(patids[idx].id)
  }
  return ret;
}
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

  log.info(`selecting ${def.number} patients`)
  const selected = def.random ? await fetchRandom(def.number) : await fetchRecent(def.number)
  for (const patid of selected) {
    log.info(`Processing ${patid}`)
    const pat = await transfer_patient(patid)
    const termine=await source("agntermine").where("patid",patid)
    await dest("agntermine").insert(termine)
    await checktransfer("agntermine",patid,"patid")
    if (pat) {
      log.debug(`Finished ${pat.bezeichnung1} ${pat.bezeichnung2}, ${pat.geburtsdatum} `)
    }
  }
  await create_views()
  return "ok"
}


module.exports = exec
