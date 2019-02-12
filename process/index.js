const fetch = require('node-fetch')

const exec=async function(source, dest, def){
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
      console.log(res)
    }
  }
  const patids=await source.select("id").from('kontakt')
  const l=patids.length
  return l+" Datensätze transferiert."
}


module.exports = exec