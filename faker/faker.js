const fetch = require('node-fetch')
const log = require('../logger')

const firstnames_url = "https://raw.githubusercontent.com/rgwch/elexis-3-base/ungrad2019/bundles/ch.elexis.support.dbshaker/rsc/vornamen.txt"
const lastnames_url = "https://raw.githubusercontent.com/rgwch/elexis-3-base/ungrad2019/bundles/ch.elexis.support.dbshaker/rsc/nachnamen.txt"

const firstnamesFemale = []
const firstnamesMale = []
let lastnames

const loaddata = async () => {
  const fn = await fetch(firstnames_url)
  if (fn.status != 200) {
    log.error("Could not load firstnames ", fn.status)
  }
  const firstnamesRaw = await fn.text()
  const firstnames = firstnamesRaw.split(/\s*\r?\n\s*/)
  firstnames.forEach(element => {
    const tuple = element.split(/\s*,\s*/)
    const name = tuple[0].trim()
    if (tuple.length == 1) {
      firstnamesFemale.push(name)
      firstnamesMale.push(name)
    } else {
      if (tuple[1].trim() == "m") {
        firstnamesMale.push(name)
      } else {
        firstnamesFemale.push(name)
      }
    }
  });
  const ln = await fetch(lastnames_url)
  if (ln.status != 200) {
    log.error("could not load lastnames ", ln.status)
  }
  const lastnames_raw = await ln.text()
  lastnames = lastnames_raw.split(/\s*\r?\n\r?\s*/)
}


const getRandom = (arr) => {
  const max = arr.length
  const idx = Math.round(Math.random() * max)
  return arr[idx]

}
const getFirstname = gender => {
  if (gender == "m") {
    return getRandom(firstnamesMale)
  } else {
    return getRandom(firstnamesFemale)
  }
}

const getLastname = () => {
  return getRandom(lastnames)
}

module.exports={loaddata,getFirstname,getLastname}
