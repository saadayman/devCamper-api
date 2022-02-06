const ErrorResponse = require('../utils/errorResponse')
const geocoder = require('../utils/geocoder.js')
const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/async')
exports.getBootCamps = asyncHandler(async(req,res,next)=>{

 
        const bootcamps = await Bootcamp.find()
        res.status(200).json({ count:bootcamps.length,bootcamps})
})
exports.getBootCamp=asyncHandler(async(req,res,next)=>{


    const bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp){
      return   next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
    }
    res.status(200).json({sucess:true,bootcamp})
   
})
//route to get bootcamps in the same range 
exports.getBootcampsInRadius = asyncHandler(async (req,res,next)=>{
    const {zipcode,distance} = req.params
     const loc =await geocoder.geocode(zipcode)
     console.log(loc)
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
   
   const bootcamp =  await Bootcamp.findByIdAndDelete(req.params.id)
   if(!bootcamp){
    return   next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
   }
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
