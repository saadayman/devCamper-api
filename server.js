const express = require('express')

const dotenv = require('dotenv')
const bootcamps = require('./routes/bootcamps.js')
const {logger}= require('./middleware/logger')
const morgan = require('morgan')
dotenv.config({path:'./config/config.env'})

const app = express()
if(process.env.NODE_ENV==='development'){
app.use(morgan('tiny'))
}
//mount routes 
app.use('/api/v1/bootcamps',bootcamps)

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`SERVER RUNNING ON PORT ${PORT}`)
})