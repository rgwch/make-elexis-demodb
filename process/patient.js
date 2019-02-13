const transfer_fall = require("./fall")
const { source, dest, checkinsert } = require("../db")
const checkKontakt = require("./kontakt.js")

const transfer = async patid => {
  const pat=await checkKontakt(patid)
  const cases = await source("faelle").where({
    patientid: patid,
    deleted: "0"
  })
  for (const fall of cases) {
    await transfer_fall(fall)
  }
  return pat
}

module.exports = transfer
