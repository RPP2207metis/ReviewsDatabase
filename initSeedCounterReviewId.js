require('buffer').constants.MAX_STRING_LENGTH = Infinity;
const mongoose = require('mongoose');
const Counter = require('./models/counter.js');

mongoose.set('strictQuery', true);
// mongoose.connect('mongodb://localhost/cows');
mongoose.connect('mongodb://localhost/fetcher');
const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('connected DB in INDEX seed file...'));

// const bulk = [];
// for (let i = 0; i < 100000; i++) {
//   bulk.push({ _id: i });
// }
// // db.collectionName.createIndex({ _id: 1 });
// db.collectionName.insert(bulk);

Counter.insertMany([{
  _id: 'review_id',
  count: 5775000
}]);
