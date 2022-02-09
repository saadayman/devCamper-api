const express =require('express')
const router = express.Router({mergeParams:true})
const {
    getCourses,
    createCourse,
    getSingleCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses')
router.route('/').get(getCourses).post(createCourse)
router.route('/:id').get(getSingleCourse).put(updateCourse).delete(deleteCourse)




module.exports = router