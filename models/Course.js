const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:[true,'Please enter a title for the course'],
        

    },
    description:{
        type:String,
        minlength:[10,'description cannot be less than 10 char'],
        required:[true,'please Add a description']
        
    },
    weeks:{
        type:Number,
    
        required:[true,'please Add a number of weeks']
        
    },
    tuition:{
        type:Number,
        required:[true,'Please enter the tuition cost']
    },
    minimumSkill:{
        type:String,
        required:[true,'Please enter skills'],
        enum:['beginner','intermediate','advanced']
    },
    scholarShipAvailable:{
        type:Boolean,
        default:false
    },
    createdAt: {
        type:Date,
        default:Date.now },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref:'Bootcamp', 
        required:true
    }
})
CourseSchema.statics.getAverageCost =  async function(bootcampId){
const ArrayofObjs = await this.aggregate([
    {
        $match:{bootcamp:bootcampId}, 
       
    },
    {
    $group:{
        _id:'$bootcamp',
        averageCost:{$avg:'$tuition'}
    }}
])
try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
        averageCost:Math.ceil(ArrayofObjs[0].averageCost/10)*10
    })
} catch (error) {
    console.log(error)
}
}
CourseSchema.post('save',async function(next){
  this.constructor.getAverageCost(this.bootcamp)

})
CourseSchema.pre('remove',async function(next){
    this.constructor.getAverageCost(this.bootcamp)

})
module.exports = mongoose.model('Course',CourseSchema)