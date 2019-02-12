
const transfer=async (source,dest,patid)=>{
  const patset=await source('kontakt').where("id",patid)
  const pat=patset[0]
  await dest("kontakt").insert(pat)
  return pat
}

module.exports=transfer