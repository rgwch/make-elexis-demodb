const checkKontakt = require("./kontakt")
const { source, dest, checkinsert } = require("../db")
const transfer_encounter=require('./encounter')

const transfer = async fall => {
  if (fall.garantid) {
    await checkKontakt(fall.garantid)
  }
  if (fall.kostentrid) {
    await checkKontakt(fall.kostentrid)
  }
  const encounters=await source("behandlungen").where("fallid",fall.id)
  for(const encounter of encounters){
    transfer_encounter(encounter)
  }
  await checkinsert('faelle',fall)
}

module.exports = transfer
