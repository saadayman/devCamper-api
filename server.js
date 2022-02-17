const express = require('express')
const connectDB=require('./config/db')
const dotenv = require('dotenv')
const bootcamps = require('./routes/bootcamps.js')
const courses  = require('./routes/courses.js')
const users = require('./routes/users')
const reviews = require('./routes/reviews')
const {logger}= require('./middleware/logger')
const morgan = require('morgan')
const  colors =require('colors')
const errorHandler = require('./middleware/error')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const path = require('path')
const auth = require('./routes/auth')
const MongoSanitize = require('express-mongo-sanitize')
const  helmet  = require('helmet')
const xss_clean  = require('xss-clean')
const  rateLimit  = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')
dotenv.config({path:'./config/config.env'})

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
if(process.env.NODE_ENV==='development'){
app.use(morgan('tiny'))
}

connectDB();
app.use(fileUpload())
//sanittize data
app.use(MongoSanitize())
//set security headres
app.use(helmet.contentSecurityPolicy({
    directives: {
     defaultSrc: ["'self'"],
     styleSrc: ["'self'","'unsafe-inline'" ,'unpkg.com', 'cdn.jsdelivr.net', 
     'fonts.googleapis.com', 'use.fontawesome.com'],
     scriptSrc: ["'self'","'unsafe-inline'",'js.stripe.com'],
     frameSrc: ["'self'",'js.stripe.com'],
     fontSrc:["'self'",'fonts.googleapis.com','fonts.gstatic.com','use.fontawesome.com','cdn. joinhoney.com']
   }
  }));
//prevent XSS attacks
app.use(xss_clean())
//allow cors 
app.use(cors())
app.use(express.static(path.join(__dirname,'public')))
//RATE LIMITING 
const limiter = rateLimit({
    windowMs:10*60*1000,//10 mins
    max:100
})
app.use(limiter)
//prevent http param piollution
app.use(hpp())
//mount routes 

app.use('/api/v1/bootcamps',bootcamps)
app.use('/api/v1/courses',courses)
app.use('/api/v1/auth',auth)
app.use('/api/v1/users',users)
app.use('/api/v1/reviews',reviews)

app.use(errorHandler)
const PORT = process.env.PORT || 5000

const server = app.listen(PORT,()=>{
    console.log(`SERVER RUNNING ON PORT ${PORT}`.yellow.bold)
})
process.on('unhandledRejection',(err,promise)=>{
console.log(`Error ${err.message}`.red.bold)
server.close(()=>process.exit(1))
})