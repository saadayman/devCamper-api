const ErrorResponse = require('../utils/errorResponse')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const asyncHandler = require('../middleware/async')

//@desc Register  AUSER 
//@route post api/v1/auth/register
exports.register=asyncHandler(async(req,res,next)=>{
  const {name,email,password,role}= req.body
  // method 
  /*const saltRounds= 10;
  bycrypt.genSalt(saltRounds,(err,salt)=>
  {
      if(err){
      return    next(new ErrorResponse(err,400))
      }
      bycrypt.hash(password,salt,(err,hash)=>{
          if(err){
            return    next(new ErrorResponse(err,400))
          }
            console.log(hash)

      })

  })*/
  //create our user 
  const user = await User.create({
      name,
      email,
      role,
      password
  })
  sendTokenResponse(user,200,res)
})
//@desc login  AUSER 
//@route post api/v1/auth/login
exports.login=asyncHandler(async(req,res,next)=>{
    const {email,password}= req.body
    //validation 
    if(!(email && password)){
     return  next(new ErrorResponse('Please fill in all fields',400))
    }
    //check if user or not 
   const user = await User.findOne({email}).select('+password')
   if(!user){
    return next(new ErrorResponse(`invaild credentials `,401))
   }
  const isMatch =await  user.matchPasswords(password)
    if(!isMatch){
        return next(new ErrorResponse('invaild credentials',401))
    }
   
   sendTokenResponse(user,200,res)
})


//get token from model, create cookie and send response
const sendTokenResponse=(user,statusCode,res)=>{
    //CREATE TOKEN 
    const token = user.getSignedJwtToken()
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly:true
    }

    if(process.env.NODE_ENV==="production"){
        options.secure= true
    }
    res
    .status(statusCode)
    .cookie('token',token,options)
    .json({
        sucess:true,
        token
    })
   
  }
  //route to get the curretn logged in user 
  // route Get /api/v1/auth/me 
  //acess private
  exports.getMe=asyncHandler(async(req,res,next)=>{
      const user = await User.findById(req.user.id)
      console.log(req.user)
      res.status(200).json({
          sucess:true,
          data:user
      })
  })