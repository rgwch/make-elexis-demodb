const knex=require('knex')
const cfg=require('config')
const processor=require('./process')

const source=knex({
  client: cfg.get('source.client'),
  connection: cfg.get('source.connection')
})


const prov=knex({
  client: cfg.get('dest.client'),
  connection: cfg.get('dest.connection')
})

const destdb=cfg.get('dest.connection.database')
prov.raw("DROP DATABASE "+destdb).then(res=>{
  return res
}).then(res=>{
  return  prov.raw("CREATE DATABASE "+destdb).then(res=>{
    return res
  })
}).then(res=>{

  const dest=knex({
    client: cfg.get('dest.client'),
    connection: cfg.get('dest.connection')
  })
  
  processor(source,dest,cfg.get('process')).then(result=>{
    console.log(result)
  }).catch(err=>{
    console.log("***FEHLER*** "+err)
  })

})
  

