const ErrorResponse = require('../utils/errorResponse')
const geocoder = require('../utils/geocoder.js')
const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/async')
const { json } = require('express/lib/response')
exports.getBootCamps = asyncHandler(async(req,res,next)=>{
    let query ;
    const reqQuery = {...req.query}
    
    //Fields to exclude 
    
    const removeFields = ['select','sortBy','page','limit']
    removeFields.forEach(param=>{
       
        delete reqQuery[param]
    })
    
    
    let queryStr = JSON.stringify(reqQuery) 
        queryStr =   queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=> "$"+match)
        query = Bootcamp.find(JSON.parse(queryStr)).populate('Courses')
        console.log(query)
    if(JSON.stringify(req.query).includes('select')){
        let fields = req.query.select
     
     fields = fields.replace(/\b(,)\b/g,' ')
      query = query.select(fields)
 
    }
    if(req.query.sortBy){
        
        const sortElm = (req.query.sortBy).replace(/\b(,)\b/g,' ')
        console.log(sortElm)
       query= query.sort(sortElm)
    }else{
      query=   query.sort('-createdAt')
    }
    
   const page = +req.query.page || 1
   const limit = +req.query.limit || 25
    const startIndex = (page-1)* limit
    const endIndex = page*limit
    const total  = await Bootcamp.countDocuments()
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

        const bootcamps = await query
        res.status(200).json({ count:bootcamps.length,bootcamps,pagination})
})
exports.getBootCamp=asyncHandler(async(req,res,next)=>{
  //TODO  get all courses when single boot camp route is hit
   
    const bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp){
      return   next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
    }
    res.status(200).json({sucess:true,bootcamp,})
   
})
//route to get bootcamps in the same range 
exports.getBootcampsInRadius = asyncHandler(async (req,res,next)=>{
    const {zipcode,distance} = req.params
     const loc =await geocoder.geocode(zipcode)
  
     const {latitude, longitude} =loc[0]
    const radius = distance/3963
    const bootcamps =  await Bootcamp.find({location:{
        $geoWithin: { $centerSphere : [[longitude,latitude],radius]}
    }
        
        
    })
    res.status(200).json({sucess:true,count:bootcamps.length,data:bootcamps})
    
})
exports.createBootCamps=asyncHandler(async (req,res,next)=>{
    
        const bootcamp =  await Bootcamp.create(req.body)
        res.status(201).json({sucess:true,data:req.body,})
   

    
})
exports.deleteBootCamps=asyncHandler(async(req,res,next)=>{
   
   const bootcamp =  await Bootcamp.findById(req.params.id)
   if(!bootcamp){
    return   next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
   }
   bootcamp.remove()//in order to trigger a the middle ware
    res.status(200).json({sucess:true, MSG:'item removed'})
   
    
})
exports.updateBootCamps=asyncHandler(async(req,res,next)=>{

 const bootcamp =    await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{ 
     new:true
 })
 if(!bootcamp){
    return   next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
 }   
 res.json({sucess:true,data:bootcamp})
})
