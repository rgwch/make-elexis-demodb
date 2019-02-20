/********************************************
 * This file is part of Make-Demodb         *
 * Copyright (c) 2019 by G. Weirich         *
 * License and terms: see LICENSE           *
 ********************************************/

const { source, checkinsert, checktransfer } = require('../db')
const checkKontakt = require('./kontakt')
const checkBilling = require("./billing")

/**
 * process an encounter and handle dependend objects such as 'leistungen' and 'diagnosen'.
 * @param {object} encounter 
 */
const transfer = async (encounter) => {
  await checkKontakt(encounter.mandantid)
  await checktransfer("rechnungen", encounter.rechnungsid)
  await checkinsert("behandlungen", encounter)
  const leistungen = await source('leistungen').where('behandlung', encounter.id)
  for (const leistung of leistungen) {
    await checkBilling(leistung)
  }
  const dgs = await source('behdl_dg_joint').where('behandlungsid', encounter.id)
  for (const dg of dgs) {
    await checkinsert('behdl_dg_joint', dg)
    await checktransfer('diagnosen', dg.diagnoseid)
  }
}

module.exports = transfer