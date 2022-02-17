const path = require('path')
const ErrorResponse = require('../utils/errorResponse')
const geocoder = require('../utils/geocoder.js')
const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/async')
const { json } = require('express/lib/response')
const advancedResult = require('../middleware/advancedResult')
exports.getBootCamps = asyncHandler(async(req,res,next)=>{
    
    
    res.status(200).json({result:res.advancedResults})

       
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
        req.body.user = req.user._id

        //Check for publishedd 

    const publishedBootcamp = await Bootcamp.findOne({user:req.user.id})
//we need to check if he already has a bootcamp 
//check if user is admin or not
if(req.user.role!=='admin' && publishedBootcamp){
    
    return next(new ErrorResponse(`user with role : ${req.user.role} has already created a bootcamp , and you cant create more than one bootcamp`))
    
}
   
        const bootcamp =  await Bootcamp.create(req.body)




        res.status(201).json({sucess:true,data:req.body,})
   

    
})
exports.deleteBootCamps=asyncHandler(async(req,res,next)=>{
   
   let bootcamp =  await Bootcamp.findById(req.params.id)
  if(!bootcamp){
    return next(new ErrorResponse(`there is not bootcamp with such id`),400)
  }
   const owner = bootcamp.user.toString()
  

if(owner !== req.user.id && req.user.role !=="admin"){
     return next(new ErrorResponse(`User with id :${req.user.id} is not the creater of this bootcamp and cannot commit this action`))
}
   bootcamp.remove()//in order to trigger a the middle ware
    res.status(200).json({sucess:true, MSG:'Bootcamp removed'})
   
    
})
exports.updateBootCamps=asyncHandler(async(req,res,next)=>{

let bootcamp =    await Bootcamp.findById(req.params.id)
 console.log(bootcamp)
 if(!bootcamp){
    return   next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
 }   
 const owner = bootcamp.user.toString()
  

if(owner !== req.user.id && req.user.role !=="admin"){
     return next(new ErrorResponse(`User with id :${req.user.id} is not the creater of this bootcamp and cannot commit this action`))
}
bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{ 
    new:true,
    runValidators:true
})

 res.json({sucess:true,data:bootcamp})
})

exports.BootcampPhotoUpload=asyncHandler(async(req,res,next)=>{
   
    const bootcamp =  await Bootcamp.findById(req.params.id)
    if(!bootcamp){
     return   next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
    }
    const owner = bootcamp.user.toString()
  
 console.log(owner,"here")
if(owner !== req.user.id && req.user.role !=="admin"){
     return next(new ErrorResponse(`User with id :${req.user.id} is not the creater of this bootcamp and cannot commit this action`))
}
   if(!req.files){
    return   next(new ErrorResponse(`no file was uploaded`,400))
   }
   const file = req.files.file
   if(!file.mimetype.startsWith('image')){
       return next(new ErrorResponse('plz upload an image file ',400))
   }
   if(file.size>process.env.MAX_FILE_UPLOAD){
       return next(new ErrorResponse(`image cannot be larger than ${process.env.MAX_FILE_UPLOAD/1000000}MB `,400))
   }
   file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`
   file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async err=>{
       if(err) {
           console.error(err)
           return next(new ErrorResponse(err.message,400))
       }
       await Bootcamp.findByIdAndUpdate(req.params.id,{photo:file.name})
       res.status(200).json({sucess:true,data:file.name})
   })
 })