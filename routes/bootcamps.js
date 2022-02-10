const express = require('express')
const courseRouter = require('./courses')
const router = express.Router()
const { 
        getBootCamps,
        getBootCamp,
        deleteBootCamps,
        updateBootCamps,
        createBootCamps,
        getBootcampsInRadius,
        BootcampPhotoUpload
    }=  require('../controllers/bootcamps.js')
const advancedResult = require('../middleware/advancedResult')
const Bootcamp = require('../models/Bootcamp')

router.use('/:bootcampId/courses',courseRouter)

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
router.route('/').get(advancedResult(Bootcamp,'Courses'),getBootCamps).post(createBootCamps)
router.route('/:id').get(getBootCamp).put(updateBootCamps).delete(deleteBootCamps)
router.route('/:id/photo').put(BootcampPhotoUpload)



module.exports = router