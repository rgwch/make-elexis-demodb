const transfer_fall = require("./fall")
const { source, dest, checkinsert } = require("../db")
const checkKontakt = require("./kontakt.js")
const transfer_articles = require("./article")

const transfer = async patid => {
  const pat = await checkKontakt(patid)
  const cases = await source("faelle").where({
    patientid: patid,
    deleted: "0"
  })
  for (const fall of cases) {
    await transfer_fall(fall)
  }
  // check reference contacts
  const refs = await source('kontakt_adress_joint').where('myid', patid)
  for (const ref of refs) {
    await checkinsert('kontakt_adress_joint', ref)
    await checkKontakt(ref.otherid)
  }
  const articles = await source('patient_artikel_joint').where("patientid", patid)
  for (const article of articles) {
    await transfer_articles(article)
  }
  return pat
}

module.exports = transfer
