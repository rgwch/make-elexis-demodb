/********************************************
 * This file is part of Make-Demodb         *
 * Copyright (c) 2019 by G. Weirich         *
 * License and terms: see LICENSE           *
 ********************************************/

const transfer_fall = require("./fall")
const { source, dest, checkinsert, checktransfer } = require("../db")
const checkKontakt = require("./kontakt.js")
const transfer_articles = require("./article")

/**
 * Process a 'patient' entry and handle dependent objects such as 'articles', 'faelle',
 * 'konto', 'laborwerte', 'briefe', 'auf'
 * @param {*} patid 
 */
const transfer = async patid => {
  const pat = await checkKontakt(patid)
  const cases = await source("faelle").where({
    patientid: patid,
    deleted: "0"
  })
  for (const fall of cases) {
    await transfer_fall(fall)
  }
  // check reference contacts
  const refs = await source('kontakt_adress_joint').where('myid', patid)
  for (const ref of refs) {
    await checkinsert('kontakt_adress_joint', ref)
    await checkKontakt(ref.otherid)
  }
  const articles = await source('patient_artikel_joint').where("patientid", patid)
  for (const article of articles) {
    await transfer_articles(article)
  }
  const konto = await source('konto').where('patientid',patid)
  for(const movement of konto){
    await checkinsert('konto',movement)
    await checktransfer('rechnungen',movement.rechnungsid)
    await checktransfer('zahlungen', movement.zahlungsid)
  }
  const briefe = await source('briefe').where('patientid',patid)
  for(const brief of briefe){
    await checkinsert('briefe',brief)
    await checkKontakt(brief.absenderid)
    await checkKontakt(brief.destid)
  }

  const laborwerte=await source('laborwerte').where('patientid',patid)
  for(const laborwert of laborwerte){
    await checkinsert('laborwerte',laborwert)
    const item=await checktransfer('laboritems',laborwert.itemid)
    if(item){
      await checkKontakt(item.laborid)
    }
    await checkKontakt(laborwert.originid)
  }

  const aufs=await source('auf').where('patientid',patid)
  for(const auf of aufs){
    await checkinsert('auf',auf)
  }
  return pat
}

module.exports = transfer
