const jwt = require('jsonwebtoken')

//admin authentication
const isAdmin = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(
            token,
            process.env.TOKEN_SECRET,
            async (err, decodedToken) => {
                if (err) {
                    return res.status(403).json({ status: false })
                } else if (
                    decodedToken.accountType !== 'admin' &&
                    !decodedToken.status
                ) {
                    return res.status(403).json({ status: false })
                }
                next()
            }
        )
    } else {
        res.status(401).json({ status: false })
    }
}

//student authentication
const isStudent = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(
            token,
            process.env.TOKEN_SECRET,
            async (err, decodedToken) => {
                if (err) {
                    return res.status(403).json({ status: false })
                } else if (
                    decodedToken.accountType !== 'student' &&
                    !decodedToken.status
                ) {
                    return res.status(403).json({ status: false })
                }
                next()
            }
        )
    } else {
        res.status(401).json({ status: false })
    }
}

//user authentication
const isUser = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(
            token,
            process.env.TOKEN_SECRET,
            async (err, decodedToken) => {
                if (err) {
                    return res.status(403).json({ status: false })
                }
                next()
            }
        )
    } else {
        res.status(401).json({ status: false })
    }
}

module.exports = {
    isAdmin,
    isStudent,
    isUser,
}
