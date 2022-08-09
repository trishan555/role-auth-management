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
}

module.exports = userCtrl
