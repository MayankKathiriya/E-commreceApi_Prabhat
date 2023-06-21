
const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "Please provide Product Name"],
            maxlength: [100, 'Product name can not be more than 100 characters']
        },
        price: {
            type: Number,
            required: [true, "Please provide Product Price"],
            default: 0
        },
        description: {
            type: String,
            required: [true, "Please provide Product description"],
            maxlength: [1000, 'Product description can not be more than 1000 characters']
        },
        image: {
            type: String,
            default: '/uploads/example.jpeg'
        },
        category: {
            type: String,
            required: [true, 'Please provide product category'],
            enum: ['office', 'kitchen', 'bedroom']
        },
        company: {
            type: String,
            required: [true, 'Please provide product company'],
            enum: {
                values: ['ikea', 'liddy', 'marcos'],
                message: '{VALUE} is not supported'
            }
        },
        colors: {
            type: [String],
            required: true
        },
        featured: {
            type: Boolean,
            default: false
        },
        freeShipping: {
            type: Boolean,
            default: false
        },
        inventory: {
            type: Number,
            required: true,
            default: 15
        },
        averageRating: {
            type: Number,
            default: 0
        },
        numOfReviews: {
            type: Number,
            default: 0
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'user',
            required: true
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

ProductSchema.pre('findOneAndDelete', async function () {
    const id = this.getQuery()._id
    await mongoose.models['review'].deleteMany({ product: id })
})
ProductSchema.virtual('reviews', {
    ref: 'review',
    localField: '_id',
    foreignField: 'product',
    // justOne: false
})

module.exports = mongoose.model('product', ProductSchema)