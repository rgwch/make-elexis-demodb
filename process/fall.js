/********************************************
 * This file is part of Make-Demodb         *
 * Copyright (c) 2019 by G. Weirich         *
 * License and terms: see LICENSE           *
 ********************************************/

const { source, checkinsert} = require("../db")
const checkKontakt=require('./kontakt')
const {getNumber}=require('../faker')
const transfer_encounter=require('./encounter')
const cfg=require('config')
const proc=cfg.get("process")

/**
 * process a "Fall" object and handle dependend objects such as 'behandlungƒen' and 'rechnungen'
 * @param {*} fall 
 */
const transfer = async fall => {
  if (fall.garantid) {
    await checkKontakt(fall.garantid)
  }
  if (fall.kostentrid) {
    await checkKontakt(fall.kostentrid)
  }
  if(proc.anonymize){
    fall.versnummer=getNumber(10)
    fall.fallnummer=getNumber(15)
    delete fall.extinfo
  }

  await checkinsert('faelle',fall)

  const encounters=await source("behandlungen").where("fallid",fall.id)
  for(const encounter of encounters){
    await transfer_encounter(encounter)
  }
  const bills= await source('rechnungen').where("fallid",fall.id)
  for(const bill of bills){
    await checkinsert('rechnungen',bill)
    const payments=await source('zahlungen').where('rechnungsid',bill.id)
    for(const payment of payments){
      await checkinsert('zahlungen',payment)
    }
  }

}

module.exports = transfer
