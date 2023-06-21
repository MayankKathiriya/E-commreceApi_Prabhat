const Review = require('../models/review.model')
const Product = require('../models/product.model')
const { NotFoundError, BadRequestError } = require('../errors/index')
const { StatusCodes } = require('http-status-codes')
const { checkPermission } = require('../utils/index');

const createReview = async (req, res) => {
    const { body: { product: productId }, user: { userId } } = req

    const isValidProduct = await Product.findById(productId)
    if (!isValidProduct) {
        throw new NotFoundError(`No prodcut with id : ${productId}`)
    }
    const alreadySubmitted = await Review.findOne({ product: productId, user: userId })
    if (alreadySubmitted) {
        throw new BadRequestError('Already Submitted review for this product')
    }
    req.body.user = userId
    const review = await Review.create(req.body)
    res.status(StatusCodes.CREATED).json({ review })
}
const getAllReview = async (req, res) => {
    const review = await Review.find({}).populate({ path: 'product', select: 'name company price' }).populate({ path: 'user', select: 'name' })
    res.status(StatusCodes.OK).json({ review })

}
const getSingalReview = async (req, res) => {
    const { id: reviewId } = req.params
    const review = await Review.findById(reviewId).populate({ path: 'product', select: 'name company price' }).populate({ path: 'user', select: 'name' })
    if (!review) {
        throw new NotFoundError(`No review with id : ${reviewId}`)
    }
    res.status(StatusCodes.OK).json({ review })
}
const updateReview = async (req, res) => {
    const { params: { id: reviewId }, body: { rating, title, comment } } = req
    const review = await Review.findById(reviewId)
    if (!review) {
        throw new NotFoundError(`No review with id : ${reviewId}`)
    }
    checkPermission(req.user, review.user)

    review.rating = rating
    review.title = title
    review.comment = comment

    await review.save()
    res.status(StatusCodes.OK).json({ review })
}
const deleteReview = async (req, res) => {
    const { id: reviewId } = req.params
    const review = await Review.findOne({ _id: reviewId })
    if (!review) {
        throw new NotFoundError(`No review with id : ${reviewId}`)
    }
    checkPermission(req.user, review.user)
    await review.deleteOne()
    
    res.status(StatusCodes.OK).json({ review })
}

module.exports = { createReview, getAllReview, getSingalReview, updateReview, deleteReview }