const mongoose = require('mongoose');

const charReviewSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  characteristic_id: Number,
  review_id: Number,
  name: String
});

module.exports = mongoose.model('charReview', charReviewSchema);
