const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userController = {
    registerUser: async (req, res) => {
        try {
            const {
                firstName,
                lastName,
                email,
                dateOfBirth,
                mobile,
                status,
                password,
                accountType,
            } = req.body
            const user = await User.findOne({ email: email })
            if (user)
                return res
                    .status(400)
                    .json({ msg: 'The email already exists.' })

            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                dateOfBirth: dateOfBirth,
                mobile: mobile,
                status: status,
                password: passwordHash,
                accountType: accountType,
            })
            await newUser.save()
            res.json({ msg: 'Sign up Success' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email: email })
            if (!user)
                return res.status(400).json({ msg: 'User does not exist.' })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch)
                return res.status(400).json({ msg: 'Incorrect password.' })

            // if login success create token
            const payload = { id: user._id, name: user.username }
            const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
                expiresIn: '1d',
            })

            res.json({ token })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUsers: async (req, res) => {
        try {
            const users = await User.find()
            //console.log(req)
            res.send(users)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    verifiedToken: (req, res) => {
        try {
            const token = req.header('Authorization')
            if (!token) return res.send(false)

            jwt.verify(
                token,
                process.env.TOKEN_SECRET,
                async (err, verified) => {
                    if (err) return res.send(false)

                    const user = await User.findById(verified.id)
                    if (!user) return res.send(false)

                    return res.send(true)
                }
            )
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}

module.exports = userController
