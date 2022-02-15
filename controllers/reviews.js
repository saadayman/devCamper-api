const Review = require('../models/Review')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../models/Bootcamp')
exports.getReviews = asyncHandler(async (req,res,next)=>{
 
   
    if(req.params.bootcampId){
        const reviews   = await Review.find({bootcamp:req.params.bootcampId})
        return res.status(200).json({sucess:true,count:reviews.length,reviews})
    }else{
     return  res.status(200).json({
         sucess:true
        ,
        result:res.advancedResults})
    }
    





})
exports.getSingleReview = asyncHandler(async(req,res,next)=>{
    const review = await Review.findById(req.params.id).populate({
        path:'bootcamp',
        select:'name description'
    })
    if(!review){
        return next(new ErrorResponse('There is no review with this id = '+req.params.id,404))
    }
    res.status(200).json({sucess:true,review})
})
exports.createReview=asyncHandler(async(req,res,next)=>{
    //we are creating a review for a specific bootcamp so we need to make sure that it is existed 
    //api/v1/bootcamps/:bootcampId/reviews
    req.body.bootcamp = req.params.bootcampId
    req.body.user = req.user.id
    const bootcamp = await Bootcamp.findById(req.params.bootcampId)    
    if(!bootcamp){
        return next(new ErrorResponse(`No bootcamp with such id`,400))
    }
    const review =  await Review.create(req.body)
    res.status(201).json({sucess:true,review})

})
//Delete //api/v1/bootcamp/:bootcampId/reviews/:id
exports.deleteReview= asyncHandler(async (req,res,next)=>{
    const bootcamp = await Bootcamp.findById(req.params.bootcampId)    
    if(!bootcamp){
        return next(new ErrorResponse(`No bootcamp with such id`,400))
    }
    const review = await Review.findById(req.params.id)
    if(!review){
        return next(new ErrorResponse(`There is no review`,401))
    }
    const owner = review.user.toString()
    if(owner!==req.user.id && req.user.role!=='admin'){
        return next(new ErrorResponse(`user with id ${req.user.id} is not the owner of this review`,401))
    }
    await review.remove()
    res.status(200).json({sucess:true})
})

exports.updateReview = asyncHandler(async (req,res,next)=>{
    let review = await Review.findById(req.params.id)
    if(!review){
        return next(new ErrorResponse(`No review with such id`,400))
    }
    const owner = review.user.toString()
    if(owner!==req.user.id && req.user.role!=='admin'){
        return next(new ErrorResponse(`user with id ${req.user.id} is not the owner of this review`,401))
    }
    review = await Review.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true})
  
        res.status(200).json({sucess:true,review})

    
})