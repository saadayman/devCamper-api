const mongoose= require('mongoose')

   const connectDB = async ()=>{
     const con = await mongoose.connect(process.env.URI,{
            useNewUrlParser:true
        })
        console.log('connected to Db'.cyan.underline.bold)
     
   }
   module.exports  = connectDB