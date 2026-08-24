const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

reviewSchema.add({
  images: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model('Review', reviewSchema);
