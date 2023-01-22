const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  count: { type: Number, default: 5775000 }
});

// CounterSchema.methods.increment = function (cb) {
//   const doc = this;
//   return Counter.findByIdAndUpdate(
//     { _id: 'review_id' },
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true, select: { seq: 1 } }
//   ).then(counter => counter.seq);
// };

module.exports = mongoose.model('Counter', CounterSchema);
