const User = require('../models/user.model')
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors/index');
const { setCookies, createUserToken } = require('../utils/index');


const register = async (req, res) => {
    const { name, email, password } = req.body
    const isEmailExists = await User.findOne({ email })
    if (isEmailExists) {
        throw new BadRequestError('Email already exists')
    }
    const isFirstAccount = await User.countDocuments({}) === 0
    const role = isFirstAccount ? 'admin' : 'user';
    const user = await User.create({ name, email, password, role })

    const tokenUser = createUserToken(user)
    setCookies(res, tokenUser)
    res.status(StatusCodes.CREATED).json({ user: tokenUser })
}
const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) { throw new BadRequestError('Please provide email and password') }
    const user = await User.findOne({ email })

    if (!user || !(await user.comparePassword(password))) { throw new UnauthenticatedError('Invalid email and password') }
    const tokenUser = createUserToken(user)
    setCookies(res, tokenUser)
    res.status(StatusCodes.OK).json({ user: tokenUser })
}
const logout = async (req, res) => {
    res.clearCookie('token').send('logout')
    // res.send('logout')
}

module.exports = { register, login, logout }