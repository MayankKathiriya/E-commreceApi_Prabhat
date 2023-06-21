const express = require('express');
const router = express.Router()
const { getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword } = require('../controllers/user.controller');
const { authenticateUser, authorizePermission } = require('../middleware/authentication')

router.use(authenticateUser)

router.get('/', authorizePermission('admin'), getAllUsers)
router.get('/showMe', showCurrentUser)
router.patch('/updateUser', updateUser)
router.patch('/updateUserPassword', updateUserPassword)
router.get('/:id', getSingleUser)

module.exports = router