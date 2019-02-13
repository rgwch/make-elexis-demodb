const checkKontakt = require("./kontakt")
const { source, dest, checkinsert, checktransfer } = require("../db")
const transfer_encounter=require('./encounter')

const transfer = async fall => {
  if (fall.garantid) {
    await checktransfer('kontakt', fall.garantid)
  }
  if (fall.kostentrid) {
    await checktransfer('kontakt', fall.kostentrid)
  }
  await checkinsert('faelle',fall)

  const encounters=await source("behandlungen").where("fallid",fall.id)
  for(const encounter of encounters){
    await transfer_encounter(encounter)
  }
}

module.exports = transfer
