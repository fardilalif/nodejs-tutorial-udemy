const Review = require('../models/Review.js');
const Product = require('../models/Product.js');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

const createReview = async (req, res) => {
  const {
    body: { product: productID },
    user: { userID },
  } = req;

  const isProductExists = await Product.findOne({ _id: productID });
  if (!isProductExists) {
    throw new CustomError.NotFoundError(`No product with id: ${productID}`);
  }

  const alreadySubmitted = await Review.findOne({
    product: productID,
    user: userID,
  });
  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      'Already submitted review for this product'
    );
  }

  req.body.user = userID;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate('product', 'name')
    .populate('user', 'name');

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const { id: reviewID } = req.params;

  const review = await Review.findOne({ _id: reviewID });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${reviewID}`);
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const {
    params: { id: reviewID },
    user,
    body: { title, comment, rating },
  } = req;

  const review = await Review.findOne({ _id: reviewID });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${reviewID}`);
  }

  checkPermissions(user, review.user);

  review.title = title;
  review.comment = comment;
  review.rating = rating;
  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const {
    params: { id: reviewID },
    user,
  } = req;

  const review = await Review.findOne({ _id: reviewID });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${reviewID}`);
  }

  checkPermissions(user, review.user);

  await review.remove();
  res.status(StatusCodes.OK).json({ message: 'Review removed' });
};

const getSingleProductReviews = async (req, res) => {
  const {
    params: { id: productID },
  } = req;

  const reviews = await Review.find({ product: productID });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
