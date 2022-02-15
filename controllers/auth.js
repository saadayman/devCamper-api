const ErrorResponse = require('../utils/errorResponse')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const asyncHandler = require('../middleware/async')
const sendEmail = require('../utils/sendEmail')

const crypto = require('crypto')
const isEligibleRequest = require('express-fileupload/lib/isEligibleRequest')
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

//Logout User 
// get /api/v1/auth/logout
//private
exports.logOut= asyncHandler(async(req,res,next)=>{
    
     res.cookie('token','none',{
         expires:new Date(Date.now()+10*1000)
         ,httpOnly:true,
     })
  
     res.status(200).json({sucess:true})
})

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
    //route update user details  
  // route put /api/v1/auth/me/updatedetails 
  //acess private
  exports.updateDetails=asyncHandler(async(req,res,next)=>{
      const fieldsToUpdate = {
          email:req.body.email,
          name:req.body.name
      }
    const user = await User.findByIdAndUpdate(req.user.id,fieldsToUpdate,{new:true,runValidators:true})
    console.log(req.user)
    res.status(200).json({
        sucess:true,
        data:user
    })
})
  //route to get the curretn logged in user 
  // route Get /api/v1/auth/me 
  //acess private
  exports.upadatePassword=asyncHandler(async(req,res,next)=>{
    
    //we need to check if entered password is correct 
    const user = await User.findById(req.user.id).select('+password')
    if(!(await user.matchPasswords(req.body.password))){
        return next(new ErrorResponse(`Password Entered is  not correct`,400))
    }
    user.password = req.body.newpassword
   await user.save()
    
   sendTokenResponse(user,200,res)
})
  //@desc Forgot Password 
  // route post /api/v1/auth/forgotpassword 
  //acess public
  exports.forgotPassword=asyncHandler(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return next(new ErrorResponse('There is no  such user in db',404))
    }
    //Get reset token
    const resetToken = user.getResetPasswordToken()
    await user.save({validateBeforeSave: false})
    //create reset url 
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`
    const message = `you are receiving this email because you are or someone else has requested the reset of password.Please make a PUT request to : \n\n ${resetUrl}`
    try {
        await sendEmail({
            email:user.email,
            subject:'Password reset token',
            message

        })
        res.status(200).json({sucess:true,data:'Email sent'})
    } catch (error) {
        console.log(err)
        user.resetPasswordToken=undefined
        user.resetPasswordExpire=undefined
        await user.save({validateBeforeSave:false})
        next(new ErrorResponse('Email could not be send',500))
    }
   
})
exports.resetPassword = asyncHandler(async(req,res,next)=>{
    const resetToken= crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({resetPasswordToken:resetToken,
    resetPasswordExpire:{
        $gt:Date.now()
    }
    })
    if(!user){
        return next(new ErrorResponse(`token sent is not correct or token is expired`,404))
    }
    user.password = req.body.password
    user.resetPasswordExpire = undefined
    user.resetPasswordToken = undefined
    await user.save()
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