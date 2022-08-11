const Note = require('../models/noteModel')

//error handling
const handleErrors = (err) => {
    let errors = { title: '', description: '' }
    if (err.message.includes('Note validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    return errors
}

//create note
const createNote = async (req, res) => {
    try {
        const { title, description, date, userid } = req.body
        const note = await Note.create({
            title,
            description,
            date,
            userid,
        })
        res.status(201).json({ note: note._id, created: true })
    } catch (error) {
        console.log(error)
        const errors = handleErrors(error)
        res.json({ errors, created: false })
    }
}

//note feching handling
const getAllNote = async (req, res) => {
    try {
        const { userId } = req.params
        const notes = await Note.find({ userid: userId })
        res.status(200).json({ notes: notes })
    } catch (error) {
        console.log(error)
        const errors = handleErrors(error)
        res.json({ errors, created: false })
    }
}

//update note by id
const updateNote = async (req, res) => {
    try {
        const { id } = req.params
        const noteUpdated = await Note.findOneAndUpdate({ _id: id }, req.body, {
            upsert: true,
        })
        res.status(200).json({ success: true, noteUpdated })
    } catch (error) {
        console.log(error)
        const errors = handleErrors(error)
        res.json({ errors, updated: false })
    }
}

//delete the note by id
const deleteNote = async (req, res) => {
    try {
        const { id } = req.params
        const noteDeleted = await Note.findOneAndDelete({ _id: id })
        res.status(200).json({ success: true, noteDeleted })
    } catch (error) {
        console.log(error)
        const errors = handleErrors(error)
        res.json({ errors, noteDeleted: false })
    }
}

module.exports = { deleteNote, updateNote, getAllNote, createNote }
