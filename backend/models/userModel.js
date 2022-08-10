const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            validate: {
                validator: validator.isEmail,
                message: 'Please provide a valid email address',
            },
        },
        password: {
            type: String,
        },
        accountType: {
            type: String,
            default: 'student',
        },
        status: {
            type: Boolean,
            default: false,
        },
        phone: {
            type: String,
        },
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        dateOfBirth: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        timestamps: true,
    }
)
//encrypt password before save
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

//encrypt password before update(registraion)
userSchema.pre('findOneAndUpdate', async function (next) {
    const salt = await bcrypt.genSalt()
    this._update.password = await bcrypt.hash(this._update.password, salt)
    next()
})

//login credentials verification
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email })
    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user
        }
        throw Error('Password is invalid')
    }
    throw Error('Email is invalid')
}

const User = mongoose.model('User', userSchema)
module.exports = User
