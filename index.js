const knex=require('knex')
const cfg=require('config')

const source=knex({
  client: cfg.get('source.client'),
  connection: cfg.get('source.connection')
})

/*
const dest=knex({
  client: cfg.get('dest.client'),
  connection: cfg.get('dest.connection')
})
*/

source.select("id").from('kontakt').then(patids=>{
  const num=patids.lenth
})
