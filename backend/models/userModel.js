const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        mobile: {
            type: Number,
            required: true,
        },
        status: {
            type: Boolean,
            default: false,
        },
        password: {
            type: String,
            required: true,
        },
        accountType: {
            type: String,
            default: 'student',
        },
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model('User', userSchema)
module.exports = User
