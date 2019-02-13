const transfer_fall = require("./fall")
const { source, dest, checkinsert } = require("../db")

const transfer = async patid => {
  const patset = await source("kontakt").where("id", patid)
  const pat = patset[0]
  await checkinsert("kontakt", pat)
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
