const jwt = require('jsonwebtoken')
const asyncHandler = require('../middleware/async')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const errorResponse = require('../utils/errorResponse')


//protect routes
exports.protect =  asyncHandler(async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    // else if(req.cookies.token){
    //      token = req.cookies.token
    //  }
    //Make sure token exists 
    if(!token){
        return next(new ErrorResponse('Not authorized to acess this route'),401)
    }
    try{
        //VERIFYING THE TOKEN 
        const decoded = jwt.verify(token,process.env.SECRET_VALUE)
     
        req.user = await User.findById(decoded.id)//currently logged in user
        next()
    }
    catch(err){
        return next(new ErrorResponse('Not authorized to acess this route'),401)
    }
})


//Grant access to specific roles
exports.authorize = (...roles)=>{
    console.log(roles)
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`,403))
        }
        next()
    }
}