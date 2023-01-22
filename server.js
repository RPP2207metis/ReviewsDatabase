require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const reviewsRouter = require('./routes/reviews.js');
const autoIncrement = require('mongoose-auto-increment');

const app = express();

mongoose.set('strictQuery', true); // DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7. Use `mongoose.set('strictQuery', false);` if you want to prepare for this change. Or use `mongoose.set('strictQuery', true);` to suppress this warning.
// mongoose.connect('mongodb://localhost/reviewsSDC'); // Old copy with 600k reviews seeded
// mongoose.connect('mongodb://localhost/reviews_sdc');
// mongoose.connect('mongodb://localhost/reviewsImport');
mongoose.connect('mongodb://localhost/cows');
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connection to Database Established!'));

app.use(express.json());

app.use('/reviews', reviewsRouter);

// autoIncrement.initialize(db);

// const reviewSchema = new mongoose.Schema({
//   product: String,
//   page: Number,
//   count: Number,
//   results: [
//     {
//       review_id: {
//         type: Number,
//         unique: true
//       },
//       rating: Number,
//       summary: String,
//       recommend: Boolean,
//       response: {
//         type: String,
//         default: null
//       },
//       body: String,
//       date: Date,
//       reviewer_name: String,
//       reviewer_email: String,
//       helpfulness: {
//         type: Number,
//         default: 0
//       },
//       photos: [{
//         id: Number,
//         url: String
//       }],
//       reported: {
//         type: Boolean
//       }
//     }
//   ],
//   ratings: { // default don't send if empty
//     1: String,
//     2: String,
//     3: String,
//     4: String,
//     5: String
//   },
//   recommended: {
//     false: String,
//     true: String
//   },
//   characteristics: [{
//     id: Number,
//     name: String,
//     value: []
//   }]
// });
// reviewSchema.plugin(autoIncrement.plugin, {
//   model: 'Review',
//   field: 'results.review_id',
//   startAt: 5775000,
//   incrementBy: 1
// });

app.listen(process.env.PORT, () => console.log(`Server on localhost ${process.env.PORT}...`));

// module.exports = db;
