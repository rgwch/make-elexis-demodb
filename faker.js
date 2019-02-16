/********************************************
 * This file is part of Make-Demodb         *
 * Copyright (c) 2019 by G. Weirich         *
 * License and terms: see LICENSE           *
 ********************************************/

const fetch = require("node-fetch")
const log = require("./logger")

/**
 * Helper to convert real names to fake names. We use the name list originally provided with the
 * Elexis Plugin "dbshaker".
 */

const firstnames_url =
  "https://raw.githubusercontent.com/rgwch/elexis-3-base/ungrad2019/bundles/ch.elexis.support.dbshaker/rsc/vornamen.txt"
const lastnames_url =
  "https://raw.githubusercontent.com/rgwch/elexis-3-base/ungrad2019/bundles/ch.elexis.support.dbshaker/rsc/nachnamen.txt"

const streets = ["weg", "gasse", "strasse", "allee", "steig", "stieg"]
const cities = [
  "9990 Elexikon",
  "9991 Oberelexikon",
  "9992 Unterelexikon",
  "9993 Webelexikon",
  "9994 Elexikingen"
]

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
  })
  const ln = await fetch(lastnames_url)
  if (ln.status != 200) {
    log.error("could not load lastnames ", ln.status)
  }
  const lastnames_raw = await ln.text()
  lastnames = lastnames_raw.split(/\s*\r?\n\r?\s*/)
}

const getRandom = arr => {
  const max = arr.length - 1
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

const getStreetname = () => {
  const name = getLastname()
  return name + getRandom(streets) + " " + 1 + Math.round(Math.random() * 200)
}
const getNumber = length => {
  let ret = ""
  for (let i = 0; i < length; i++) {
    ret += Math.round(Math.random() * 9).toString()
  }
  return ret
}

const getCity = () => {
  return getRandom(cities)
}

const getPhoneNumber = () => {
  let ret = "555 "
  ret += getNumber(3) + " "
  ret += getNumber(2) + " "
  ret += getNumber(2)
  return ret
}

module.exports = {
  loaddata,
  getFirstname,
  getLastname,
  getStreetname,
  getNumber,
  getCity,
  getPhoneNumber
}
