const mongoose = require('mongoose');

const charSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  product_id: Number,
  name: String
});

module.exports = mongoose.model('char', charSchema);
