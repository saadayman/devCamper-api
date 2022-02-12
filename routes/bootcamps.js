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
const { protect, authorize } = require('../middleware/auth')

router.use('/:bootcampId/courses',courseRouter)

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
router.route('/').get(advancedResult(Bootcamp,'Courses'),getBootCamps).post(protect,authorize('publisher','admin'),createBootCamps)
router.route('/:id').get(getBootCamp).put(protect,authorize('publisher','admin'),updateBootCamps).delete(protect,authorize('publisher','admin'),deleteBootCamps)
router.route('/:id/photo').put(protect,authorize('publisher','admin'),BootcampPhotoUpload)



module.exports = router