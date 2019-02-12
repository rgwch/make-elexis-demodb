const {dest, checkinsert, checktransfer} =require('../db')

const transfer= async (encounter)=>{
  await checktransfer("kontakt",encounter.mandantid)
  await checktransfer("rechnungen",encounter.rechnungsid)
  await checkinsert("behandlungen",encounter)
}

module.exports=transfer