const express =require('express')
const router = express.Router({mergeParams:true})
const {
  getReviews,getSingleReview, createReview, deleteReview, updateReview
} = require('../controllers/reviews.js')
const { protect, authorize } = require('../middleware/auth')
const advancedResult = require('../middleware/advancedResult')
const Course = require('../models/Course')
const Review = require('../models/Review.js')

router.route('/')
.get(advancedResult(Review,{
    path:'bootcamp',
    select:'name description'
}),getReviews)
.post(protect,authorize('user','admin'),createReview)
router.route('/:id')
.get(getSingleReview)
.delete(protect,authorize('user','admin'),deleteReview)
.put(protect,authorize('user','admin'),updateReview)




module.exports = router