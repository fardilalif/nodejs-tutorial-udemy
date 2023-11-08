require('dotenv').config();
require('express-async-errors');

// connect db
const connectDB = require('./db/connect.js');

// middlewares
const errorHandlerMiddleware = require('./middlewares/error-handler.js');
const notFoundMiddleware = require('./middlewares/not-found.js');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

// routers
const authRouter = require('./routes/authRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const productRouter = require('./routes/productRoutes.js');
const reviewRouter = require('./routes/reviewRoutes.js');
const orderRouter = require('./routes/orderRoutes.js');

// express
const express = require('express');
const app = express();

app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'));
app.use(fileUpload());
app.use(express.json());
app.set('trust proxy', 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 60, // Limit each IP to 60 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);
app.use(helmet());
app.use(xss());
app.use(cors());
app.use(mongoSanitize());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
})();
