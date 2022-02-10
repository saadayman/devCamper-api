const express =require('express')
const router = express.Router({mergeParams:true})
const {
    getCourses,
    createCourse,
    getSingleCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses')
const advancedResult = require('../middleware/advancedResult')
const Course = require('../models/Course')
router.route('/').get(advancedResult(Course,{
    path:'bootcamp',
    select:'name description'
}),getCourses).post(createCourse)
router.route('/:id').get(getSingleCourse).put(updateCourse).delete(deleteCourse)




module.exports = router