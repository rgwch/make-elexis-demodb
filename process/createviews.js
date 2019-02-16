/********************************************
 * This file is part of Make-Demodb         *
 * Copyright (c) 2019 by G. Weirich         *
 * License and terms: see LICENSE           *
 ********************************************/

const { dest } = require("../db")
const log = require("../logger")

const rpr = `CREATE OR REPLACE VIEW rights_per_role AS SELECT r.id AS role_id, ri.id AS right_id
FROM role r LEFT JOIN role_right_joint rrj ON r.id = rrj.role_id LEFT JOIN right_ ri ON rrj.id = ri.id
ORDER BY r.id;`

const rpu = `CREATE OR REPLACE VIEW rights_per_user AS SELECT u.id AS user_id, ri.id AS right_id, ri.name AS right_name
FROM user_ u LEFT JOIN user_role_joint urj ON u.id = urj.user_id LEFT JOIN role r ON urj.id = r.id
LEFT JOIN role_right_joint rrj ON r.id = rrj.role_id LEFT JOIN right_ ri ON rrj.id = ri.id
ORDER BY u.id;`

const dr1 = "alter table bestellung_entry drop foreign key fk_bestellung_entry_bestellung_id;"
const dr2 = "alter table zusatzadresse drop foreign key fk_zusatzadresse_kontakt_id;"

const create_views = async () => {
  try {
    const no1 = await dest.raw(rpr)
    const no2 = await dest.raw(rpu)
    const no3 = await dest.raw(dr1)
    const no4 = await dest.raw(dr2)
  } catch (err) {
    log.error("Error while creating views ", err)
  }
}

module.exports = create_views
