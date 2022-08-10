const router = require('express').Router()
const {
    login,
    createUser,
    getAllUser,
    userUpdate,
    logout,
    userSearch,
} = require('../controllers/userController')

const { isUser, isAdmin } = require('../middlewares/authMiddleware')

//user login
router.post('/login', login)

//create new user
router.post('/createuser', isAdmin, createUser)

//get all users
router.get('/allusers/', isAdmin, getAllUser)

//searching user by eamil
router.get('/usersearch/:item', isAdmin, userSearch)

//user update
router.post('/userupdate/:id', isUser, userUpdate)

//user logout
router.get('/logout', logout)

module.exports = router
