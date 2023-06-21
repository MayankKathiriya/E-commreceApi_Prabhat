const express = require('express');
const router = express.Router()
const { getAllOrders, getSingleOrder, getCurrentUserOrder, createOrder, updateOrder } = require('../controllers/order.controller');
const { authenticateUser, authorizePermission } = require('../middleware/authentication');

router.use(authenticateUser)

router.post('/', createOrder)
router.get('/', authorizePermission('admin'), getAllOrders)
router.get('/showAllMyOrders', getCurrentUserOrder)
router.get('/:id', getSingleOrder)
router.patch('/:id', updateOrder)



module.exports = router