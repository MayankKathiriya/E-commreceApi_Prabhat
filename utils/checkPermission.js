const { UnauthorizedError } = require('../errors/index');

const checkPermission = (requestUser, resourceUserId) => {
    if (requestUser.role === 'admin') return
    if (requestUser.userId === resourceUserId.toString()) return
    throw new UnauthorizedError('not Authorized to access this route')

}

module.exports = { checkPermission }