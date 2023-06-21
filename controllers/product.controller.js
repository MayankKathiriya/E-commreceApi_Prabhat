const Product = require('../models/product.model')
const { NotFoundError } = require('../errors/index')
const { StatusCodes } = require('http-status-codes')
const fs = require('fs')

const createProduct = async (req, res) => {
    req.body.user = req.user.userId
    req.body.image = `uploads/${req.file.filename}`
    const product = await Product.create(req.body)
    res.status(StatusCodes.CREATED).json({ product })
}
const getAllProduct = async (req, res) => {
    const products = await Product.find({}).populate('reviews')
    res.status(StatusCodes.OK).json({ products })
}
const getSingleProduct = async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id).populate('reviews')
    if (!product) {
        throw new NotFoundError(`No product found with id : ${id}`)
    }
    res.status(StatusCodes.OK).json({ product })
}
const updateProduct = async (req, res) => {
    const { id } = req.params

    if (req.file) {
        req.body.image = `uploads/${req.file.filename}`
        const oldProduct = await Product.findById(id)
        fs.unlinkSync(oldProduct.image)
    }
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true })
    if (!product) {
        throw new NotFoundError(`No product found with id : ${id}`)
    }

    res.status(StatusCodes.OK).json({ msg: "success" })
}
const deleteProduct = async (req, res) => {

    const { id } = req.params
    const product = await Product.findOneAndDelete({ _id: id })
    if (!product) {
        throw new NotFoundError(`No product found with id : ${id}`)
    }
    fs.unlinkSync(product.image)

    res.status(StatusCodes.OK).json({ msg: "Success" })
}

module.exports = { createProduct, getAllProduct, getSingleProduct, updateProduct, deleteProduct }