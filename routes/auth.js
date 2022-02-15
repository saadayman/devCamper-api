const express = require('express')
const router = express.Router()
const {register, login, getMe , forgotPassword,resetPassword, updateDetails, upadatePassword, logOut}= require('../controllers/auth')
const { protect } = require('../middleware/auth')

router.post('/register',register)
router.post('/login',login)
router.get('/me',protect,getMe)
router.get('/logout',protect,logOut)
router.post('/forgotpassword',forgotPassword)
router.put('/resetpassword/:token',resetPassword)
router.put('/updatedetails',protect,updateDetails)
router.put('/updatepassword',protect,upadatePassword)


module.exports = router