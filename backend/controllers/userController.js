const UserModel = require('../Models/UserModel')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
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
    let errors = { email: '', password: '' }

    if (
        err.message === 'Password is invalid' ||
        err.message === 'Email is invalid'
    ) {
        errors.email = 'Email/Password is invalid'
    }
    if (err.code === 11000) {
        errors.email = 'Email is already exist!'
        return errors
    }
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    return errors
}

let transport = nodemailer.createTransport({
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
        const user = await UserModel.create({
            firstName,
            lastName,
            dateOfBirth,
            phone,
            accountType,
            email,
            password,
        })

        //send veryfication mail  to the student

        let mailOptions = {
            from: '"Verify your Email" <adadfisk@gmail.com>',
            to: user.email,
            subject: 'Verify your login',
            html: `<h2> Hello ${user.firstName}! </h2>
            <h4>Please verify your account to continue... </h4>
            <h4><B>Your temporary password : ${req.body.password}</B></h4>
             <a href="http://localhost:3000">Verify Your Email</a>`,
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

        res.status(201).json({ user: user._id, created: true })
    } catch (error) {
        console.log(error)
        const errors = handleErrors(error)
        res.json({ errors, created: false })
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
        res.json({ errors, created: false })
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
        res.status(200).json({ user: user._id, login: true })
    } catch (error) {
        console.log(error)
        const errors = handleErrors(error)
        res.json({ errors, login: false })
    }
}

//user search handling
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
        res.json({ errors, created: false })
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
            }
        )
        res.status(200).json({ success: true, userUpdated })
    } catch {
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
    getAllUser,
    login,
    createUser,
}
