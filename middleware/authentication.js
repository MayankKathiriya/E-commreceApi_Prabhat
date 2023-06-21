const { UnauthenticatedError, UnauthorizedError } = require('../errors/index')
const { isTokenValid } = require('../utils/index')

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token
    if (!token) { throw new UnauthenticatedError('Authentication Invalid') }
    try {
        const { name, userId, role } = isTokenValid(token)
        req.user = { name, userId, role }
        next()
    } catch (error) {
        throw new UnauthenticatedError('Authentication Invalid')
    }
}

const authorizePermission = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new UnauthorizedError('Unauthorized to access this route')
        }
        next()
    }
}

module.exports = { authenticateUser, authorizePermission }