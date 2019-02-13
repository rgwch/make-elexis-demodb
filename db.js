const knex = require("knex")
const cfg = require("config")
const log = require("./logger")

const source = knex({
  client: cfg.get("source.client"),
  connection: cfg.get("source.connection")
})

const dest = knex({
  client: cfg.get("dest.client"),
  connection: cfg.get("dest.connection")
})

/**
 * check if an element exists in a table. If not, insert it.
 * @param {string} table the table to check
 * @param {object} element the (full) element to check
 */
const checkinsert = async (table, element) => {
  if (!element) {
    log.warn(`element is undefined in checkinsert ${table}. Aborting`)
  } else {
    log.debug(`Checkinsert ${element.id} in ${table}`)
    const exists = await dest(table).where("id", element.id)
    if (exists.length === 0) {
      log.debug(`${element.id} does not exist`)
      await dest(table).insert(element)
      log.debug(`Inserted ${element.id} in ${table}.`)
    } else {
      log.debug(`${element.id} already exists in ${table}`)
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
    log.warn("id is undefined. Aborting")
  } else {
    try {
      const elems = await source(table).where("id", id)
      if (elems.length === 0) {
        log.warn(`coult not retrieve ${id} from ${table}`)
      } else {
        const elem = elems[0]
        log.debug(`fetched ${elem.id} from source`)
        const exists = await dest(table).where("id", elem.id)
        if (exists.length === 0) {
          log.debug(`${id} does not exist`)
          await dest(table).insert(elem)
        } else {
          log.debug(`${elem.id} already exists`)
          return undefined
        }
      }
    } catch (err) {
      log.error("An Error was thrown in checkTransfer: ", err)
      // never mind
    }
  }
}

module.exports = { source, dest, checkinsert, checktransfer }
