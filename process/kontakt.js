const {source,dest}=require('../db')

/**
 * check if a kontakt exists in dest. If not, transfer it from source
 * @param {*} kontakt_id 
 */
const checkKontakt=async (kontakt_id)=>{
  const exists=await dest("kontakt").where("id",kontakt_id)
  if(exists.length==0){
    const kontakt=await source("kontakt").where("id",kontakt_id)
    await dest("kontakt").insert(kontakt[0])
  }
}

module.exports=checkKontakt
