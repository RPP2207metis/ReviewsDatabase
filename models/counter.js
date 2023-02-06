const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  count: { type: Number, default: 5775000 }
});

module.exports = mongoose.model('Counter', CounterSchema);
