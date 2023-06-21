const User = require('../models/user.model')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError, UnauthenticatedError } = require('../errors/index')
const { createUserToken, setCookies, checkPermission } = require('../utils/index');

const getAllUsers = async (req, res) => {
    const users = await User.find({ role: 'user' }).select('-password')
    res.status(StatusCodes.OK).json({ users })
}
const getSingleUser = async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) { throw new NotFoundError(`No user with id : ${req.params.id}`) }
    checkPermission(req.user, req.params.id)
    res.status(StatusCodes.OK).json({ user })
}
const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user })
}
const updateUser = async (req, res) => {
    const { body: { name, email }, user: { userId } } = req
    if (!name || !email) {
        throw new BadRequestError('Please provide all value ')
    }
    const user = await User.findByIdAndUpdate(userId, { name, email }, { runValidators: true, returnOriginal: false })
    const tokenUser = createUserToken(user)
    setCookies(res, tokenUser)
    res.status(StatusCodes.OK).json({ user: tokenUser })
}
const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) {
        throw new BadRequestError('Provide both value')
    }
    const user = await User.findOne({ _id: req.user.userId })
    if (!(await user.comparePassword(oldPassword))) {
        throw new UnauthenticatedError('Invalid Password')
    }
    user.password = newPassword
    await user.save()
    res.status(StatusCodes.OK).json({ success: true, msg: 'Password Updated' })
}

module.exports = { getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword }