
const advancedResult = (model,populate)=>async (req,res,next)=>{
    let query ;
    const reqQuery = {...req.query}
   
    //Fields to exclude 
    
    const removeFields = ['select','sortBy','page','limit']
    removeFields.forEach(param=>{
       
        delete reqQuery[param]
    })
    
    
    let queryStr = JSON.stringify(reqQuery) 
        queryStr =   queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=> "$"+match)
        query = model.find(JSON.parse(queryStr))
        
    if(JSON.stringify(req.query).includes('select')){
        let fields = req.query.select
     
     fields = fields.replace(/\b(,)\b/g,' ')
      query = query.select(fields)//('name description')
 
    }
    if(req.query.sortBy){
        
        const sortElm = (req.query.sortBy).replace(/\b(,)\b/g,' ')
      
       query= query.sort(sortElm)
    }else{
      query=   query.sort('-createdAt')
    }
    
   const page = +req.query.page || 1
   const limit = +req.query.limit || 25
    const startIndex = (page-1)* limit
    const endIndex = page*limit
    const total  = await model.countDocuments()
    const pagination = {}
    if(endIndex < total){
        pagination.next={
            page:  page+1,
            limit
        }
    }
    if(startIndex>0){
        pagination.prev={
            page:page-1,
            limit
        }
    }

    query = query.skip(startIndex).limit(limit)
    if(populate){
        query = query.populate(populate)
    }
    const results = await query
    res.advancedResults = {
        sucess:true,
        count:results.length,
        pagination,
        data:results
    }
    next()
}

module.exports = advancedResult