const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: String,
  page: Number,
  count: Number,
  results: [
    {
      review_id: Number,
      rating: Number,
      summary: String,
      recommend: Boolean,
      response: String,
      body: String,
      date: Date,
      reviewer_name: String,
      helpfulness: Number, // put in here
      photos: [{
        id: Number,
        url: String
      }],
      reported: Boolean // default false
    }
  ]
});

module.exports = mongoose.model('Review', reviewSchema);
