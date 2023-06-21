const express = require('express');
const router = express.Router()
const { createProduct, getAllProduct, getSingleProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { authenticateUser, authorizePermission } = require('../middleware/authentication')
const imageUpload = require('../middleware/fileUpload')


router.get('/', getAllProduct)
router.post('/', [authenticateUser, authorizePermission('admin'), imageUpload], createProduct)
router.get('/:id', getSingleProduct)
router.patch('/:id', imageUpload, updateProduct)
router.delete('/:id', deleteProduct)


module.exports = router