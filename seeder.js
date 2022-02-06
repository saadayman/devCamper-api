const fs = require('fs')
const mongoose= require('mongoose')
const dotenv = require('dotenv')

dotenv.config({path:'./config/config.env'})
const Bootcamp = require('./models/Bootcamp')
//connecet to the db    
const connectDB =async ()=>{
    let con = await mongoose.connect(process.env.URI,{useNewUrlParser:true})
}
connectDB()

fs.readFile('./devcamper_project_resources/_data/bootcamps.json',async (err,data)=>{
    if(process.argv[2]==='i'){
   
     await Bootcamp.insertMany(JSON.parse(data.toString()))
  console.log('database filled')
  process.exit(1)
    }else if(process.argv[2]==='d'){
        await Bootcamp.deleteMany()
          console.log('database empty')
          process.exit(1)
    }
}) 
