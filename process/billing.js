/********************************************
 * This file is part of Make-Demodb         *
 * Copyright (c) 2019 by G. Weirich         *
 * License and terms: see LICENSE           *
 ********************************************/

const { source, checkinsert, checktransfer } = require("../db")
const checkKontakt = require("./kontakt")
const log = require("../logger")

const transfer = async leistung => {
    if (leistung) {
        await checkinsert('leistungen', leistung)
        if (leistung.userid) {
            await checkKontakt(leistung.userid)
        }
        let table = ""
        switch (leistung.klasse) {
            case "at.medevit.ch.artikelstamm.elexis.common.ArtikelstammItem":
            case "ch.artikelstamm.elexis.common.ArtikelstammItem":
                table = "artikelstamm_ch"; break;
            case "ch.elexis.data.Artikel":    
            case "ch.elexis.core.eigenartikel.Eigenartikel":    
            case "ch.elexis.artikel_ch.data.Medical":
            case "ch.elexis.artikel_ch.data.Medikament":
            case "ch.elexis.data.Medical":
            case "ch.elexis.data.Medikament":
            case "ch.elexis.eigenartikel.Eigenartikel":
            case "ch.elexis.artikel_ch.data.MiGelArtikel":
            case "ch.elexis.medikamente.bag.data.BAGMedi":
            case "ch.elexis.data.Eigenartikel":
                table = "artikel"; break;
            case "ch.elexis.data.LaborLeistung":
                table = "ch_medelexis_labortarif2009"; break;
            case "ch.elexis.data.TarmedLeistung":
                await checktransfer("tarmed_extension", leistung.leistg_code)
                table = "tarmed"; break;
            case "ch.elexis.labortarif2009.data.Labor2009Tarif":
            case "ch.elexis.data.LaborLeistung":
                table = "ch_medelexis_labortarif2009"; break;
            case "ch.elexis.privatrechnung.data.Leistung ":
                table = "ch_elexis_privatrechnung"; break;
            case "ch.berchtold.emanuel.privatrechnung.data.Leistung":
                table="ch_berchtold_privatrechnung"; break;    
            case "ch.elexis.data.Eigenleistung":
                table="eigenleistungen"; break;    
            case "ch.elexis.data.PhysioLeistung":
                table="ch_elexis_arzttarife_ch_physio"; break;    
            default:
                log.warn("unknown billing class ", leistung.klasse)
        }
        await checktransfer(table, leistung.leistg_code)
    } else {
        log.warn("undefined billing")
    }
    let table = ""
    switch (leistung.klasse) {
      case "at.medevit.ch.artikelstamm.elexis.common.ArtikelstammItem":
      case "ch.artikelstamm.elexis.common.ArtikelstammItem":
        table = "artikelstamm_ch"
        break
      case "ch.elexis.data.Artikel":
      case "ch.elexis.core.eigenartikel.Eigenartikel":
      case "ch.elexis.artikel_ch.data.Medical":
      case "ch.elexis.artikel_ch.data.Medikament":
      case "ch.elexis.data.Medical":
      case "ch.elexis.data.Medikament":
      case "ch.elexis.eigenartikel.Eigenartikel":
      case "ch.elexis.artikel_ch.data.MiGelArtikel":
      case "ch.elexis.medikamente.bag.data.BAGMedi":
      case "ch.elexis.data.Eigenartikel":
        table = "artikel"
        break
      case "ch.elexis.data.LaborLeistung":
        table = "ch_medelexis_labortarif2009"
        break
      case "ch.elexis.data.TarmedLeistung":
        table = "tarmed"
        break
      case "ch.elexis.labortarif2009.data.Labor2009Tarif":
      case "ch.elexis.data.LaborLeistung":
        table = "ch_medelexis_labortarif2009"
        break
      case "ch.elexis.privatrechnung.data.Leistung ":
        table = "ch_elexis_privatrechnung"
        break
      case "ch.berchtold.emanuel.privatrechnung.data.Leistung":
        table = "ch_berchtold_privatrechnung"
        break
      case "ch.elexis.data.Eigenleistung":
        table = "eigenleistungen"
        break
      case "ch.elexis.data.PhysioLeistung":
        table = "ch_elexis_arzttarife_ch_physio"
        break
      default:
        log.warn("unknown billing class ", JSON.stringify(leistung))
    }
    if (table) {
      await checktransfer(table, leistung.leistg_code)
    }
  } else {
    log.warn("undefined billing")
  }
}

module.exports = transfer
