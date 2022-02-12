const express =require('express')
const router = express.Router({mergeParams:true})
const {
    getUsers,
    createUser,
    getSingleUser,
    updateUser,
    deleteUser
} = require('../controllers/users')
const { protect, authorize } = require('../middleware/auth')
const advancedResult = require('../middleware/advancedResult')
const User = require('../models/User')
router.use(protect)
router.use(authorize('admin'))
router.route('/')
.get(advancedResult(User),getUsers)
.post(createUser)
router.route('/:id')
.get(getSingleUser)
.put(updateUser)
.delete(deleteUser)




module.exports = router