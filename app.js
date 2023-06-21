require('dotenv').config()
require('express-async-errors');

const express = require('express');
const app = express();

const path = require('path')
const cookieParser = require('cookie-parser');

const rateLimiter = require('express-rate-limit')
const cors = require('cors')
const helmet = require('helmet')
const xssClean = require('xss-clean')

const connectDB = require('./db/connect');
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');
const productRouter = require('./routes/product.routes');
const reviewRouter = require('./routes/review.routes');
const orderRouter = require('./routes/order.routes');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1)
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 50
}))
app.use(cors())
app.use(helmet())
app.use(xssClean())

// app.use(morgan('tiny'))
app.use(express.static('public'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.JWT_SECRET))


app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/orders', orderRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 4545
const mongoUrl =  'mongodb://127.0.0.1:27017/e-comm'
const start = async () => {
    try {
        await connectDB(mongoUrl)
        app.listen(port, console.log('server is listing on port ' + port))
    } catch (error) {
        console.log(error);
    }
}
start();