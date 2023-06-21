const express = require('express');
const router = express.Router()
const { createReview, getAllReview, getSingalReview, updateReview, deleteReview } = require('../controllers/review.controller');
const { authenticateUser } = require('../middleware/authentication');

router.get('/', getAllReview)
router.post('/', authenticateUser, createReview)
router.get('/:id', getSingalReview)
router.patch('/:id', authenticateUser, updateReview)
router.delete('/:id', authenticateUser, deleteReview)

module.exports = router