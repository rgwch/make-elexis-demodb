const knex = require("knex")
const cfg = require("config")

const source = knex({
  client: cfg.get("source.client"),
  connection: cfg.get("source.connection")
})

const dest = knex({
  client: cfg.get("dest.client"),
  connection: cfg.get("dest.connection")
})

const checkinsert = async (table, element) => {
  const exists = await dest(table).where("id", element.id)
  if (exists.length == 0) {
    return await dest(table).insert(element)
  }
}

const checktransfer = async (table, id) => {
  try {
    const elem = await source(table).where("id", id)
    return await dest(table).insert(elem)
  } catch (err) {
    // never mind
  }
}

module.exports = { source, dest, checkinsert, checktransfer }
