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
      reviewer_email: String,
      helpfulness: {
        type: Number,
        default: 0
      },
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
  characteristics: [{
    id: Number,
    name: String,
    value: []
  }]
});

module.exports = mongoose.model('Review', reviewSchema);
