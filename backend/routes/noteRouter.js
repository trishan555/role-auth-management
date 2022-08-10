const router = require('express').Router()
const {
    getAllNote,
    createNote,
    updateNote,
    deleteNote,
} = require('../controllers/noteController')

const { isStudent } = require('../middlewares/authMiddleware')

//get all note
router.get('/allnotes/:userid/', isStudent, getAllNote)

//create a note
router.post('/createnote', isStudent, createNote)

//delete a note
router.get('/deletenote/:id', isStudent, deleteNote)

//update a note
router.post('/updatenote/:id', isStudent, updateNote)

module.exports = router
