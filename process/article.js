/********************************************
 * This file is part of Make-Demodb         *
 * Copyright (c) 2019 by G. Weirich         *
 * License and terms: see LICENSE           *
 ********************************************/

const { checkinsert, checktransfer } = require("../db")
const checkKontakt = require("./kontakt")
const log = require("../logger")

/**
 * process articles. We must deal with the fact that Elexis currently has several article 
 * implementations in different tables in parallel.
 */
const exec = async joint => {
  await checkinsert("patient_artikel_joint", joint)
  await checkKontakt(joint.prescriptor)
  let id
  let article
  if (joint.artikel) {
    const ref = joint.artikel.split("::")
    id = ref[1]
    switch (ref[0]) {
      case "ch.artikelstamm.elexis.common.ArtikelstammItem":
      case "at.medevit.ch.artikelstamm.elexis.common.ArtikelstammItem":
        await checktransfer("artikelstamm_ch", ref[1])
        break
      case "ch.elexis.artikel_ch.data.Medikament":
      case "ch.elexis.artikel_ch.data.Medical":
      case "ch.elexis.artikel_ch.data.MiGelArtikel":
      case "ch.elexis.medikamente.bag.data.BAGMedi":
      case "ch.elexis.core.eigenartikel.Eigenartikel":
        article = await checktransfer("artikel", ref[1])
        break
      default:
        log.warn("Unknown article type: ", ref[0])
    }
  } else {
    if (joint.artikelid) {
      id = joint.artikelid
      article = await checktransfer("artikel", joint.artikelid)
    }
  }
  if(article && article.lieferantid){
    await checkKontakt(article.lieferantid)
  }
  if(article){
    /* Doesn't work for now cause of database constraints. So no stock data.
    const stockentries=await source('stock_entry').where('article_id',id)
    for(const entry of stockentries){
      await checkinsert('stock_entry',entry)
      const stocks=await source('stock').where('id',entry.stock)
      for(const stock of stocks){
        await checkinsert('stock',stock)
      }
    }
    */
   if(joint.rezeptid){
     await checktransfer('rezepte',joint.rezeptid)
   }
  }
  // await checktransfer("artikel_details", id)
}

module.exports = exec
