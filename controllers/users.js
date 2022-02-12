const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')
const asyncHandler = require('../middleware/async')



//@desc get all users
//@route get api/v1/auth/users
exports.getUsers=asyncHandler(async(req,res,next)=>{
    res.status(200).json({result:res.advancedResults})

})
//get single user 
//route get api/v1/auth/users/:id
exports.getSingleUser=asyncHandler(async(req,res,next)=>{
    const user =await User.findById(req.params.id)
    res.status(200).json({sucess:true,data:user})
  //@desc login  AUSER 
  //@route post api/v1/auth/login
})
//creates user 
//post /api/v1/auth/users
exports.createUser=asyncHandler(async(req,res,next)=>{
    const user =await User.create(req.body)
    res.status(201).json({sucess:true,data:user})
  //@desc login  AUSER 
  //@route post api/v1/auth/login
})

//put req to api/v1/auth/users/:id
exports.updateUser=asyncHandler(async(req,res,next)=>{
    const user =await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    res.status(301).json({sucess:true,data:user})
  //@desc login  AUSER 
  //@route post api/v1/auth/login
})
exports.deleteUser=asyncHandler(async(req,res,next)=>{
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({sucess:true})
  //@desc login  AUSER 
  //@route post api/v1/auth/login
})