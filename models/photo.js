const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  review_id: Number,
  url: String
});

module.exports = mongoose.model('photo', photoSchema);
