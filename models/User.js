const crypto = require('crypto')
const mongoose = require('mongoose')
const jwt= require('jsonwebtoken')
const bcrypt  = require('bcryptjs')
const UserSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please Enter a name'],
        
    },
    email:{
        type:String,
        required:[true,'Please Enter an email'],
        match:[/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,'Please Enter a valid Email']
    },
    role:{
        type:String,
        enum:['user','publisher'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'Please Enter a password'],
        minlength:6,
        select:false//when selecting a user through api it will not show the password
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    createdAt:{
        type:Date,
        default:Date.now
    }
})
UserSchema.pre('save',async function(next){
   
    if(!this.isModified('password')){
        next()
    }
    const salt =await bcrypt.genSalt(10)

     this.password = await bcrypt.hash(this.password,salt)   
    
    
})

//Sign Jwt adn return 
UserSchema.methods.getSignedJwtToken = function(){
return  jwt.sign({id:this._id},process.env.SECRET_VALUE,{
    expiresIn:`${process.env.JWT_EXPIRE}`//30D 
})


}
UserSchema.methods.matchPasswords = async function(enteredPassword){
   return await bcrypt.compare(enteredPassword,this.password)
}
UserSchema.methods.getResetPasswordToken= function(){
const resetToken = crypto.randomBytes(20).toString('hex')//since it return a buffer

//has the token and set to field in model
this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
console.log(this.resetPasswordToken)
//set expire 
this.resetPasswordExpire = Date.now()+10*60*1000
return resetToken
}
module.exports = mongoose.model('User',UserSchema)