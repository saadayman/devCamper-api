const express =require('express')
const router = express.Router({mergeParams:true})
const {
    getCourses,
    createCourse,
    getSingleCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses')
const { protect } = require('../middleware/auth')
const advancedResult = require('../middleware/advancedResult')
const Course = require('../models/Course')
router.route('/').get(advancedResult(Course,{
    path:'bootcamp',
    select:'name description'
}),getCourses).post(protect,createCourse)
router.route('/:id').get(getSingleCourse)
.put(protect,updateCourse)
.delete(protect,deleteCourse)




module.exports = router