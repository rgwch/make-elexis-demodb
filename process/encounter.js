const { dest, checkinsert, checktransfer } = require('../db')
const { checkKontakt } = require('./kontakt')

const transfer = async (encounter) => {
  await checkKontakt(encounter.mandantid)
  await checktransfer("rechnungen", encounter.rechnungsid)
  await checkinsert("behandlungen", encounter)
}

module.exports = transfer