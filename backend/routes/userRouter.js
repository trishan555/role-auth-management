const router = require('express').Router()
const {
    login,
    createUser,
    getAllUser,
    userUpdate,
    logout,
    userSearch,
    verifyEmail,
    deleteUser,
    getOneUser,
} = require('../controllers/userController')

const { isUser, isAdmin, isStudent } = require('../middlewares/authMiddleware')

//user login
router.post('/login', login)

//create new user
router.post('/createuser', isAdmin, createUser)

//get all users
router.get('/allusers/', isAdmin, getAllUser)

//get single user
router.get('/get/:id', isUser, getOneUser)

//searching user by eamil
router.get('/usersearch/:item', isAdmin, userSearch)

//user update
router.post('/userupdate/:id', isStudent, userUpdate)

//verify email
router.get('/verify-email/', verifyEmail)

//delete student
router.delete('/delete/:id', deleteUser)

//user logout
router.get('/logout', logout)

module.exports = router
