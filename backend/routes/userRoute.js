const router = require('express').Router()
const userController = require('../controllers/userController')

// Register User
router.post('/register', userController.registerUser)
// Login User
router.post('/login', userController.loginUser)
//get users
router.get('/allusers', userController.getUsers)

// verify Token
router.get('/verify', userController.verifiedToken)

module.exports = router
