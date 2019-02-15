/********************************************
 * This file is part of Make-Demodb         *
 * Copyright (c) 2019 by G. Weirich         *
 * License and terms: see LICENSE           *
 ********************************************/

const knex = require("knex")
const cfg = require("config")
const log = require("./logger")

/**
 * Some database related functions
 */

 /**
  * knex connection to the source database
  */
const source = knex({
  client: cfg.get("source.client"),
  connection: cfg.get("source.connection")
})

/**
 * knex connection to the destination database
 */
const dest = knex({
  client: cfg.get("dest.client"),
  connection: cfg.get("dest.connection")
})

/**
 * check if an element exists in a table of dest. If not, insert it.
 * @param {string} table the table to check
 * @param {object} element the (full) element to check
 */
const checkinsert = async (table, element) => {
  if (!element) {
    log.warn(`element is undefined in checkinsert ${table}. Skipping`)
  } else {
    log.debug(`Checkinsert ${element.id} in ${table}`)
    try {
      const exists = await dest(table).where("id", element.id)
      if (exists.length === 0) {
        log.debug(`${element.id} does not exist`)
        await dest(table).insert(element)
        log.debug(`Inserted ${element.id} in ${table}.`)
      } else {
        log.debug(`${element.id} already exists in ${table}`)
      }
    } catch (err) {
      log.error("Error in checkinsert ", err)
    }
  }
}

/**
 * Check if an element with the given id exists in a dest table.
 * If not, fetch that element from the source table and insert
 * it in the dest table
 * @param {string} table name of the table
 * @param {string} id id of the element to check
 */
const checktransfer = async (table, id) => {
  log.debug(`Checktransfer ${id} in ${table}`)
  if (!id) {
    log.info("id is undefined. Skipping")
  } else {
    try {
      const elems = await source(table).where("id", id)
      if (elems.length === 0) {
        log.warn(`could not retrieve ${id} from ${table}`)
      } else {
        const elem = elems[0]
        log.debug(`fetched ${elem.id} from source`)
        const exists = await dest(table).where("id", elem.id)
        if (exists.length === 0) {
          log.debug(`${id} does not exist`)
          await dest(table).insert(elem)
          log.debug(`inserted ${elem.id} into ${table}`)
          return elem
        } else {
          log.debug(`${elem.id} already exists`)
          return undefined
        }
      }
    } catch (err) {
      log.error("An Error was thrown in checkTransfer: ", err)
      return undefined
    }
  }
}

/**
 * Copy a whole table with all rows from source to dest
 * @param {string} tablename 
 */
const copytable = async tablename => {
  try {
    const entries = await source(tablename)
    for (const entry of entries) {
      await dest(tablename).insert(entry)
    }
  } catch (err) {
    log.error(`Error while copying table ${tablename}: `, err)
  }
}

module.exports = { source, dest, checkinsert, checktransfer, copytable }
