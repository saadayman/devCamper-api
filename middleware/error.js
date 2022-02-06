const ErrorResponse = require("../utils/errorResponse")

const errorHandler =(err,req,res,next)=>{
    let error = {...err}
error.message = err.message
    console.log(err)
if(err.name==="CastError"){
    const message = `resource not found with id of ${err.value}` 
   error =  new ErrorResponse(message,404)
    
}
// Mongoose duplicate key 
if(err.code===11000){
    const message = `duplicate field vlaue entered  `
    error = new ErrorResponse(message,400)
}
if(err.name==="ValidationError"){
    const message = Object.values(err.errors)
    error= new ErrorResponse(message,400)
}
res.status(error.statusCode || 500).json({
    sucess:false,
    error:error.message || 'server error'
 })
//passing next is important  because we need to make it not hanging 
//next()

}
module.exports  = errorHandler