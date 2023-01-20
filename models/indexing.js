const mongoose = require('mongoose');

const index = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  }
});

module.exports = mongoose.model('char', index);
