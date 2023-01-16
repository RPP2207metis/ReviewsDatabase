const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: String,
  page: Number,
  count: Number,
  results: [
    {
      review_id: {
        type: Number,
        unique: true
      },
      rating: Number,
      summary: String,
      recommend: Boolean,
      response: {
        type: String,
        default: null
      },
      body: String,
      date: Date,
      reviewer_name: String,
      helpfulness: {
        type: Number,
        default: 0
      }, // put req in here
      photos: [{
        id: Number,
        url: String
      }],
      reported: {
        type: Boolean
      }

    }
  ],
  ratings: { // default don't send if empty
    1: String,
    2: String,
    3: String,
    4: String,
    5: String
  },
  recommended: {
    false: String,
    true: String
  },
  characteristics: {
    Size: {
      id: Number,
      value: String
    },
    Width: {
      id: Number,
      value: String
    },
    Comfort: {
      id: Number,
      value: String
    },
    Quality: {
      id: Number,
      value: String
    }
  }
});

module.exports = mongoose.model('Review', reviewSchema);
