const Order = require('../models/order.model')
const Product = require('../models/product.model')
const { BadRequestError, NotFoundError } = require('../errors/index')
const { StatusCodes } = require('http-status-codes')
const { checkPermission } = require('../utils/index');

const fackStriprAPI = async (amount, currency) => {
    const client_secret = 'secerfgewefrff'
    return { client_secret, amount }
}

const createOrder = async (req, res) => {
    const { items: cartItems, tax, shippingFee } = req.body
    if (!cartItems || cartItems.length < 1) {
        throw new BadRequestError('No cart Items')
    }
    if (!tax || !shippingFee) {
        throw new BadRequestError('Please provide tax and shipping fees')
    }
    let orderItems = [];
    let subtotal = 0;
    for (const item of cartItems) {
        const dbProduct = await Product.findById(item.product)
        if (!dbProduct) {
            throw new NotFoundError(`No prodoct with id : ${item.product}`)
        }
        const { name, price, image, _id } = dbProduct
        const singleOrderItem = { amount: item.amount, name, price, image, product: _id }

        orderItems = [...orderItems, singleOrderItem]

        subtotal += item.amount * price

    }
    const total = tax + shippingFee + subtotal
    //get client secret stripe 
    const paymentIntent = await fackStriprAPI(total, 'usd')
    const order = await Order.create({
        tax,
        shippingFee,
        total,
        subtotal,
        orderItems,
        clientSecret: paymentIntent.client_secret,
        user: req.user.userId
    })
    res.status(StatusCodes.CREATED).json({ order })
}
const getAllOrders = async (req, res) => {
    const orders = await Order.find({})
    res.status(StatusCodes.OK).json(orders)
}
const getSingleOrder = async (req, res) => {
    const { id: orderId } = req.params
    const order = await Order.findById(orderId)
    if (!order) {
        throw new NotFoundError(`No order with id : ${orderId}`)
    }
    checkPermission(req.user, order.user)
    res.status(StatusCodes.OK).json(order)
}
const getCurrentUserOrder = async (req, res) => {
    const { userId } = req.user
    const order = await Order.find({ user: userId })
    if (!order) {
        throw new NotFoundError(`No order with id : ${orderId}`)
    }
    res.status(StatusCodes.OK).json(order)
}
const updateOrder = async (req, res) => {
    const { params: { id: orderId }, body: { paymentIntentId } } = req
    const order = await Order.findById(orderId)
    if (!order) {
        throw new NotFoundError(`No order with id : ${orderId}`)
    }
    checkPermission(req.user, order.user)

    order.paymentIntentId = paymentIntentId;
    order.status = 'paid'

    await order.save()

    res.status(StatusCodes.OK).json(order)
}

module.exports = { getAllOrders, getSingleOrder, getCurrentUserOrder, createOrder, updateOrder }