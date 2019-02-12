const fetch = require('node-fetch')
const transfer_patient=require('./patient')
const {source,dest,checkinsert}=require('../db')

const exec=async function(def){
  const response = await fetch(
    "https://raw.githubusercontent.com/rgwch/elexis-3-core/ungrad2019/bundles/ch.elexis.core.data/rsc/createDB.script")
  if (response.status != 200) {
    throw ("bad")
  }
  const sqltext=await response.text()
  let cr1 = sqltext.replace(/#.*\r?\n/g, "")
  const createdb = cr1.split(";")
  for (const stm of createdb) {
    const trimmed = stm.trim().replace(/\s\s/g," ")
    if (trimmed.length > 0) {
      const res=await dest.raw(trimmed)
      // console.log(res)
    }
  }
  const patids=await source("kontakt").where({"istpatient":"1","deleted":"0"}).whereNotNull("geburtsdatum").whereNot("geburtsdatum","").select("id")
  const l=patids.length
  for(let i=0;i<def.number;i++){
    let idx=def.random ? Math.round(l*Math.random()) : i
    while(patids[idx]==undefined){
      idx+=1
      if(idx>=l){
        idx=0
      }
    }
    const patid=patids[idx]
    const pat=await transfer_patient(patid.id)
    console.log(pat.bezeichnung1+" "+pat.bezeichnung2+", "+pat.geburtsdatum)
  }
  return "ok"
}


module.exports = exec