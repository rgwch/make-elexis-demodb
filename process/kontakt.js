/********************************************
 * This file is part of Make-Demodb         *
 * Copyright (c) 2019 by G. Weirich         *
 * License and terms: see LICENSE           *
 ********************************************/

const { source, dest, checkinsert } = require("../db")
const { getFirstname, getLastname } = require("../faker")
const cfg = require("config")
const def = cfg.get("process")

/**
 * check if a kontakt exists in dest. If not, transfer it from source
 * @param {*} kontakt_id
 */
const checkKontakt = async kontakt_id => {
  const exists = await dest("kontakt").where("id", kontakt_id)
  if (exists.length == 0) {
    const kontakte = await source("kontakt").where("id", kontakt_id)
    if (kontakte.length > 0) {
      const kontakt = kontakte[0]
      if (def.random) {
        if (kontakt.istorganisation == "1") {
          kontakt.bezeichnung1 = getLastname()
          kontakt.bezeichnung2 = "AG"
        } else {
          kontakt.bezeichnung2 = getFirstname(kontakt.geschlecht)
          kontakt.bezeichnung1 = getLastname()
        }
      }
      await dest("kontakt").insert(kontakt)
      const zusatzadressen = await source("zusatzadresse").where("kontakt_id", kontakt.id)
      for (const za of zusatzadressen) {
        await checkinsert("zusatzadresse", za)
      }
      return kontakt
    }
  }
}

module.exports = checkKontakt
