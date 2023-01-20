require('buffer').constants.MAX_STRING_LENGTH = Infinity;
const mongoose = require('mongoose');
// const Review = require('./models/review.js');

// console.log("🚀 ~ file: initSeed.js:5 ~ excelDataPhoto", excelDataPhoto.headersPhoto, excelDataPhoto.dataPhoto);

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost/test');
const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('connected DB in INDEX seed file...'));

const bulk = [];
for (let i = 0; i < 100000; i++) {
  bulk.push({ _id: i });
}
// db.collectionName.createIndex({ _id: 1 });
db.collectionName.insert(bulk);
