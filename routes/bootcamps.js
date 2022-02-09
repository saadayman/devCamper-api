const express = require('express')
const courseRouter = require('./courses')
const router = express.Router()
const { 
        getBootCamps,
        getBootCamp,
        deleteBootCamps,
        updateBootCamps,
        createBootCamps,
        getBootcampsInRadius
    }=  require('../controllers/bootcamps.js')
router.use('/:bootcampId/courses',courseRouter)
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
router.route('/').get(getBootCamps).post(createBootCamps)
router.route('/:id').get(getBootCamp).put(updateBootCamps).delete(deleteBootCamps)



module.exports = router