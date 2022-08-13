const UserModel = require('../Models/UserModel')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const validator = require('validator')
const maxAge = 3 * 24 * 60 * 60

//jwt create token
const createToken = (id, accountType, email, status) => {
    return jwt.sign(
        { id, accountType, email, status },
        process.env.TOKEN_SECRET,
        {
            expiresIn: maxAge,
        }
    )
}

//error handling
const handleErrors = (err) => {
    let errors = {
        email: '',
        password: '',
        phone: '',
        firstName: '',
        lastName: '',
    }
    if (err.message === 'All fields must be filled') {
        errors.email = 'All fields must be filled'
        errors.password = 'All fields must be filled'
    }

    if (
        err.message === 'Incorrect email' ||
        err.message === 'Incorrect password'
    ) {
        errors.email = 'Please enter valid credentials !'
    }
    if (err.message === 'Password not strong enough') {
        errors.password =
            'minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1'
    }
    if (err.message === 'Invalid phone number') {
        errors.phone = 'Please provide valid phone number'
    }

    if (err.message === 'Not activated') {
        errors.email = 'Please activate your account first !'
    }

    if (err.code === 11000) {
        errors.email = 'Email is already registered!'
        return errors
    }
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    return errors
}

var transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL,
        pass: process.env.PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
})

//user creation handling
const createUser = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            dateOfBirth,
            phone,
            accountType,
            email,
            password,
        } = req.body

        const user = new UserModel({
            firstName,
            lastName,
            dateOfBirth,
            phone,
            accountType,
            email,
            password,
            emailToken: crypto.randomBytes(64).toString('hex'),
        })
        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !phone ||
            !dateOfBirth
        ) {
            throw Error('All fields must be filled')
        }
        if (!validator.isStrongPassword(req.body.password)) {
            throw Error('Password not strong enough')
        }
        if (!validator.isMobilePhone(req.body.phone)) {
            throw Error('Invalid phone number')
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(user.password, salt)
        user.password = hashedPassword
        await user.save()

        //send veryfication mail  to the student
        var mailOptions = {
            from: '"Verify your Email" <adadfisk@gmail.com>',
            to: user.email,
            subject: 'Verify your login to access WasToWill',
            html: `
             <div style="max-width: 700px; margin:auto; border: 8px solid #ddd; padding: 50px 20px; font-size: 110%;">
          
             <h2 style="text-align: center; color: teal;"> Hello ${user.firstName} ! </h2>
             <h3>Please verify your account to continue to<span> <b>WasToWill </b></span> </h3>
             <p><b>Your Temporary Password : ${req.body.password}</b></p>
             <p>Using Temporary password update your profile with New Password</p>
              <a href="http://${req.headers.host}/user/verify-email?token=${user.emailToken}" style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">Verify Your Email</a>
           
            </div>
             `,
        }

        //sending mail
        transport.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log(
                    'Verification mail sent to the student gmail account'
                )
            }
        })

        res.status(201).json({ user: user._id })
    } catch (error) {
        console.log(error)
        const errors = handleErrors(error)
        res.json({ errors })
    }
}

//fetch all user
const getAllUser = async (req, res) => {
    try {
        const users = await UserModel.find({ accountType: 'student' })
        res.status(200).json({
            users: users,
        })
    } catch (error) {
        console.log(error)
        const errors = handleErrors(error)
        res.json({ errors })
    }
}

const getOneUser = async (req, res) => {
    let userId = req.params.id
    await UserModel.findById(userId)
        .then((user) => {
            res.status(200).json({ user })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                status: 'Error with find user',
                error: err.message,
            })
        })
}

const deleteUser = async (req, res) => {
    let userId = req.params.id
    await UserModel.findByIdAndDelete(userId)
        .then(() => {
            res.status(200).json({ status: 'User deleted' })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({
                status: 'Error with delete user',
                error: err.message,
            })
        })
}

const verifyEmail = async (req, res) => {
    try {
        const token = req.query.token
        const user = await UserModel.findOne({ emailToken: token })
        if (user) {
            ;(user.emailToken = null), (user.status = true)
            await user.save()

            res.status(200).redirect(process.env.FRONTEND_URL)
        } else {
            console.log('email is not verified')
        }
    } catch (error) {
        console.log(error)
        const errors = handleErrors(error)
        res.json({ errors })
    }
}

//login
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.login(email, password)
        const token = createToken(
            user._id,
            user.accountType,
            user.email,
            user.status
        )
        res.cookie('jwt', token, {
            withCredentials: true,
            httpOnly: false,
            maxAge: maxAge * 1000,
        })
        res.status(200).json({ user: user._id })
    } catch (error) {
        console.log(error)
        const errors = handleErrors(error)
        res.json({ errors })
    }
}

//user search
const userSearch = async (req, res) => {
    try {
        const { item } = req.params
        const users = await UserModel.find({
            accountType: 'student',
            email: new RegExp(item, 'i'),
        }).select('-password')
        res.status(200).json({ users: users })
    } catch (error) {
        console.log(error)
        const errors = handleErrors(error)
        res.json({ errors })
    }
}

//user registration   handling
const userUpdate = async (req, res) => {
    try {
        const { id } = req.params
        const userUpdated = await UserModel.findOneAndUpdate(
            { _id: id },

            req.body,
            {
                upsert: true,
                new: true,
            }
        )
        await bcrypt.genSalt()
        res.status(200).json({ userUpdated })
    } catch (error) {
        console.log(error)
    }
}

//user logout handling
const logout = async (req, res) => {
    res.clearCookie('jwt')
    res.redirect('http://localhost:3000/')
}

module.exports = {
    logout,
    userUpdate,
    userSearch,
    getOneUser,
    deleteUser,
    getAllUser,
    login,
    createUser,
    verifyEmail,
}
