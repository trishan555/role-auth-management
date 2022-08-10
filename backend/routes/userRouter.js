const router = require('express').Router()
const {
    login,
    createUser,
    getAllUser,
    userUpdate,
    logout,
    userSearch,
} = require('../Controllers/userController')

//get all users with backend pagination
router.get('/allusers/', getAllUser)

//search a user by eamil
router.get('/usersearch/:item', userSearch)

//user registraion
router.post('/userReg/:id', userUpdate)

//user logout
router.get('/logout', logout)

//user login
router.post('/login', login)

//create new user
router.post('/createuser', createUser)

module.exports = router
