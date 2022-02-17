const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:[true,'Please enter a title for the review'],
        maxlength:100

    },
    text:{
        type:String,
        required:[true,'please add some text']
    },
    rating:{
        type:Number,
        min:1,
        max:10,
        required:[true,'Please Add a rating between 1 and 10']
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref:'Bootcamp',
        required:true,

    }, 
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true,
       
  
      }
})

//this prevents user form submitting more than one review per bootcamp
ReviewSchema.index({ bootcamp:1, user:1},{unique: true })


ReviewSchema.statics.getAverageRate =  async function(bootcampId){
    const ArrayofObjs = await this.aggregate([
        {
            $match:{bootcamp:bootcampId}, 
           
        },
        {
        $group:{
            _id:'$bootcamp',
            averageRate:{$avg:'$rating'}
        }}
    ])
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
            averageRate:ArrayofObjs[0].averageRate
        })
    } catch (error) {
        console.log(error)
    }
    }
    ReviewSchema.post('save',async function(next){
        this.constructor.getAverageRate(this.bootcamp)
        console.log(this)
      
      })
      ReviewSchema.pre('remove',async function(next){
          this.constructor.getAverageRate(this.bootcamp)
      
      })
module.exports = mongoose.model('Review',ReviewSchema)