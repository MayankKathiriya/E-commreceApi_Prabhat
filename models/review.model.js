const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema(
    {
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: [true, 'Please provide rating']
        },
        title: {
            type: String,
            trim: true,
            required: [true, 'Please provide Review title'],
            maxlength: 100
        },
        comment: {
            type: String,
            required: [true, 'Please provide Review text']
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'user',
            required: true
        },
        product: {
            type: mongoose.Types.ObjectId,
            ref: 'product',
            required: true
        }
    },
    { timestamps: true }
)

ReviewSchema.index({ product: 1, user: 1 }, { unique: true })
ReviewSchema.statics.calculateAvrgRating = async function (productId) {
    const result = await this.aggregate([
        {
            $match: { product: productId }
        },
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                numOfReviews: { $sum: 1 }
            }
        }
    ])
    try {
        await mongoose.model('product').findByIdAndUpdate(productId, {
            averageRating: result[0]?.averageRating.toFixed(1) || 0,
            numOfReviews: result[0]?.numOfReviews || 0
        })
    } catch (error) {
        // console.log(error);
    }
}

ReviewSchema.post('save', async function () {
    await this.constructor.calculateAvrgRating(this.product)
})
ReviewSchema.post('deleteOne', { document: true, query: false }, async function () {
    await this.constructor.calculateAvrgRating(this.product)
})

module.exports = mongoose.model('review', ReviewSchema)