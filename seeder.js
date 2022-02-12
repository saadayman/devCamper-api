const fs = require('fs')
const mongoose= require('mongoose')
const dotenv = require('dotenv')
const colors = require('colors')

dotenv.config({path:'./config/config.env'})
const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')
const User= require('./models/User')
//connecet to the db    
const connectDB =async ()=>{
    let con = await mongoose.connect(process.env.URI,{useNewUrlParser:true})
}
connectDB()
const bootcamps =JSON.parse(fs.readFileSync(`./devcamper_project_resources/_data/bootcamps.json`,'utf-8'))
const courses =JSON.parse(fs.readFileSync(`./devcamper_project_resources/_data/courses.json`,'utf-8'))
const users =JSON.parse(fs.readFileSync(`./devcamper_project_resources/_data/users.json`,'utf-8'))
if(process.argv[2]==='i'){

    importData()
 

   }else if(process.argv[2]==='d'){
     deleteData()
   }


async function  importData(){
    try{
     await Bootcamp.create(bootcamps)
    await Course.create(courses)
    await User.create(users)
     console.log('database filled'.green.inverse)
     process.exit(1)
    }
    catch(error){
        console.log(error)
        process.exit(1)
    }
   
      
 
}
async function deleteData(){
   try{
    await Bootcamp.deleteMany()
   await Course.deleteMany()
   await User.deleteMany()
    console.log('database empty'.bgRed)
    process.exit(1)
   }
   catch(error){
       console.log(error)
       process.exit(1)
   }
}