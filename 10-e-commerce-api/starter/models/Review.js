const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide rating'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide review title'],
      maxLength: 100,
    },
    comment: {
      type: String,
      required: [true, 'Please provide review comment'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, product: 1 }, { unique: true });

reviewSchema.statics.calculateAverageRating = async function (productID) {
  const result = await this.aggregate([
    { $match: { product: productID } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        numberOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model('Product').findOneAndUpdate(
      { _id: productID },
      {
        averageRating: result[0]?.averageRating || 0,
        numberOfReviews: result[0]?.numberOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.product);
});

reviewSchema.post('remove', async function () {
  await this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);
