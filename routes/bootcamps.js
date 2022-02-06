const express = require('express')

const router = express.Router()
const { 
        getBootCamps,
        getBootCamp,
        deleteBootCamps,
        updateBootCamps,
        createBootCamps,
        getBootcampsInRadius
    }=  require('../controllers/bootcamps.js')
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
router.route('/').get(getBootCamps).post(createBootCamps)
router.route('/:id').get(getBootCamp).put(updateBootCamps).delete(deleteBootCamps)



module.exports = router