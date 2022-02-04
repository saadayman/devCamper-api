const express = require('express')
const connectDB=require('./config/db')
const dotenv = require('dotenv')
const bootcamps = require('./routes/bootcamps.js')
const {logger}= require('./middleware/logger')
const morgan = require('morgan')
const  colors =require('colors')


dotenv.config({path:'./config/config.env'})

const app = express()
if(process.env.NODE_ENV==='development'){
app.use(morgan('tiny'))
}
//mount routes 
app.use('/api/v1/bootcamps',bootcamps)
connectDB();
const PORT = process.env.PORT || 5000

const server = app.listen(PORT,()=>{
    console.log(`SERVER RUNNING ON PORT ${PORT}`.yellow.bold)
})
process.on('unhandledRejection',(err,promise)=>{
console.log(`Error ${err.message}`.red.bold)
server.close(()=>process.exit(1))
})