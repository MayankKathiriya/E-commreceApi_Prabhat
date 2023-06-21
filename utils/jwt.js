const jwt = require('jsonwebtoken');

const createJwt = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFE })
    return token
}

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET)

const setCookies = (res, user) => {
    const token = createJwt(user)
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        secure: process.env.NODE_ENV === 'production',
        signed: true
    })
}

module.exports = { createJwt, isTokenValid, setCookies }