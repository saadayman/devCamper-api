const Course = require('../models/Course')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../models/Bootcamp')

exports.getCourses = asyncHandler(async (req,res,next)=>{
 
   
        if(req.params.bootcampId){
            const courses   = await Course.find({bootcamp:req.params.bootcampId})
            return res.status(200).json({sucess:true,count:courses.length,courses})
        }else{
         return  res.status(200).json({sucess:true,result:res.advancedResults})
        }
        
  

    res.status(200).json({sucess:true,count:courses.length,courses})
    

})
exports.getSingleCourse= asyncHandler(async (req,res,next)=>{
    const course = await Course.findById(req.params.id).populate({
        path:'bootcamp',
        select:'name description'
    })
    if(!course){
        return next(new ErrorResponse(`Resource not found with id ${req.params.id}`) ,400)
    }
    res.status(200).json({sucess:true,course})
})


exports.createCourse = asyncHandler(async (req,res,next)=>{
    req.body.bootcamp = req.params.bootcampId
    req.body.user = req.user.id
    const bootcamp = await Bootcamp.findById(req.body.bootcamp)
    if(!bootcamp){
        return next(new ErrorResponse('You cant create course without Bootcamp being existed maker sure bootcamp id is correct'),400)
    }
    const owner = bootcamp.user.toString()
  
 
if(owner !== req.user.id && req.user.role !=="admin"){
     return next(new ErrorResponse(`User with id :${req.user.id} is not the creater of this bootcamp and cannot commit this action`))
}
    const course = await Course.create(req.body)
    res.status(201).json({sucess:true,course})

    
})  

exports.updateCourse= asyncHandler(async (req,res,next)=>{


    let course = await Course.findById(req.params.id)
    if(!course){
        return next(new ErrorResponse(`resource not found with id of ${req.params.id}`,400))
        }
        const owner = course.user.toString()
  
       
       if(owner !== req.user.id && req.user.role !=="admin"){
            return next(new ErrorResponse(`User with id :${req.user.id} is not the creater of this bootcamp and cannot commit this action`),401)
       }
      course = await Course.findByIdAndUpdate( req.body,{new:true,runValidators:true})
    res.status(200).json({sucess:true,course})
})
exports.deleteCourse = asyncHandler(async(req,res,next)=>{
    const course = await Course.findById(req.params.id)
    if(!course){
        return next(new ErrorResponse(`reosurce not found with id of ${req.params.id}`),400)
    }
    const owner = course.user.toString()
  
       
    if(owner !== req.user.id && req.user.role !=="admin"){
         return next(new ErrorResponse(`User with id :${req.user.id} is not the creater of this bootcamp and cannot commit this action`),401)
    }
    course.remove()
    res.status(200).json({sucess:true,msg:"Course Removed"})
})
