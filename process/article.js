const { source, dest, checkinsert, checktransfer } = require('../db')
const checkKontakt = require('./kontakt')
const log = require('../logger')



const exec = async joint => {
    await checkinsert("patient_artikel_joint", joint)
    await checkKontakt(joint.prescriptor)
    if (joint.artikel) {
        const ref = joint.artikel.split("::")
        switch (ref[0]) {
            case "ch.artikelstamm.elexis.common.ArtikelstammItem":
            case "at.medevit.ch.artikelstamm.elexis.common.ArtikelstammItem":
                await checktransfer('artikelstamm_ch', ref[1])
                break;
            case "ch.elexis.artikel_ch.data.Medikament":
            case "ch.elexis.artikel_ch.data.Medical":
            case "ch.elexis.artikel_ch.data.MiGelArtikel":
            case "ch.elexis.medikamente.bag.data.BAGMedi":
            case "ch.elexis.core.eigenartikel.Eigenartikel":
                await checktransfer('artikel', ref[1])
                break;
            default:
                log.warn("Unknown article type: ",ref[0])
        }
    }else{
        if(joint.artikelid){
            await checktransfer('artikel',joint.artikelid)
        }
    }
}

module.exports=exec
