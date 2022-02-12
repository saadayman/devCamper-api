const express =require('express')
const router = express.Router({mergeParams:true})
const {
    getCourses,
    createCourse,
    getSingleCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses')
const { protect, authorize } = require('../middleware/auth')
const advancedResult = require('../middleware/advancedResult')
const Course = require('../models/Course')
router.route('/').get(advancedResult(Course,{
    path:'bootcamp',
    select:'name description'
}),getCourses).post(protect,authorize('publisher','admin'),createCourse)
router.route('/:id').get(getSingleCourse)
.put(protect,authorize('publisher','admin'),updateCourse)
.delete(protect,authorize('publisher','admin'),deleteCourse)




module.exports = router