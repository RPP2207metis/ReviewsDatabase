const mongoose = require('mongoose');
const Review = require('./models/review.js');

// Database connection
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost/cows');
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('POST TEST: Connection to Database Established!'));

var query = Review.find({product: '1000000'}).explain('allPlansExecution')
query.exec(function (err, res) {
  if (err) console.log(err.message)
  else console.log(res)
});
