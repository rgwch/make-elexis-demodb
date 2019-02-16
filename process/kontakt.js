/********************************************
 * This file is part of Make-Demodb         *
 * Copyright (c) 2019 by G. Weirich         *
 * License and terms: see LICENSE           *
 ********************************************/

const { source, dest, checkinsert } = require("../db")
const {
  getFirstname,
  getLastname,
  getStreetname,
  getCity,
  getPhoneNumber
} = require("../faker")
const cfg = require("config")
const def = cfg.get("process")

/**
 * check if a kontakt exists in dest. If not, transfer it from source
 * @param {*} kontakt_id
 */
const checkKontakt = async kontakt_id => {
  if (kontakt_id) {
    const exists = await dest("kontakt").where("id", kontakt_id)
    if (exists.length == 0) {
      const kontakte = await source("kontakt").where("id", kontakt_id)
      if (kontakte.length > 0) {
        const kontakt = kontakte[0]
        if (def.random) {
          kontakt.bezeichnung1 = getLastname()
          kontakt.bezeichnung2 =
            kontakt.istperson === "1" ? getFirstname(kontakt.geschlecht) : "AG"
          kontakt.strasse = getStreetname()
          const c = getCity().split(" ")
          kontakt.plz = c[0]
          kontakt.ort = c[1]
          kontakt.telefon1 = getPhoneNumber()
          kontakt.telefon2 = getPhoneNumber()
          kontakt.natelnr = getPhoneNumber()
          delete kontakt.email
          delete kontakt.website
          delete kontakt.bemerkung
          let a =
            kontakt.istperson === "1"
              ? kontakt.geschlecht === "m"
                ? "Herr"
                : "Frau"
              : "Firma"
          kontakt.anschrift = `${a}
${kontakt.bezeichnung2} ${kontakt.bezeichnung1}
${kontakt.strasse}
${c[0]} ${c[1]}`
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
}

module.exports = checkKontakt
