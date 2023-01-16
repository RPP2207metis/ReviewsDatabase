const mongoose = require('mongoose');
const Review = require('./models/review.js');
const excelData = require('./xlsx.js');
// const connection = require('./index.js');
// console.log("🚀 ~ file: server.js:5 ~ excelData", excelData.headers, excelData.data);

mongoose.set('strictQuery');
mongoose.connect('mongodb://localhost/reviewsSDC');
const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('connected DB in seed file...'));

const jsonData = [];

const productIdSaved = [];

for (const keyCol in excelData.data) {
  const dataObj = excelData.data[keyCol];
  const review_id = dataObj.A;
  const product_id = dataObj.B;
  const rating = dataObj.C;
  const date = dataObj.D;
  const summary = dataObj.E;
  const body = dataObj.F;
  const recommend = dataObj.G;
  const reported = dataObj.H;
  const reviewer_name = dataObj.I;
  const reviewer_email = dataObj.J;
  const response = dataObj.K;
  const helpfulness = dataObj.L;
  const photos = [{
    id: 1,
    url: 'http://res.cloudinary.com/djfpzruso/image/upload/v1673118844/r63e0zgpunosamkw2nap.jpg'
  }];
  console.log("🚀 ~ file: initialSeeding.js:13 ~ product_id", product_id);
  if (!productIdSaved[product_id - 1]) {
    productIdSaved.push(product_id);
    console.log("productIdSaved", productIdSaved)

    // if the product id is not saved
    const jsonMongo = {
      product: product_id,
      page: 1,
      count: 1,
      results: [
        {
          review_id: review_id,
          rating: rating,
          summary: summary,
          recommend: recommend,
          response: response,
          body: body,
          date: date,
          reviewer_name: reviewer_name,
          helpfulness: helpfulness,
          photos: photos
        }
      ],
      ratings: {
        1: rating === 1 ? '1' : '0',
        2: rating === 2 ? '1' : '0',
        3: rating === 3 ? '1' : '0',
        4: rating === 4 ? '1' : '0',
        5: rating === 5 ? '1' : '0'
      },
      recommended: {
        false: recommend === false ? '1' : '0',
        true: recommend === true ? '1' : '0'
      },
      characteristics: {},
      reported: reported
    };

    const newReview = new Review(jsonMongo);
    newReview.save((err) => {
      if (err) {
        console.log('!!! ERROR Saving new review in Mongo: ', err);
      }
    });
    // update ratings with number rating after

  } else {
    console.log('else : updates to exisiting schema in mongo')
    // else (id is saved)
    // updates to exisiting schema in mongo
  }
}



//   A: 'id = dataObj.
//   B: 'product_id',
//   C: 'rating',
//   D: 'date',
//   E: 'summary',
//   F: 'body',
//   G: 'recommend',
//   H: 'reported',
//   I: 'reviewer_name',
//   J: 'reviewer_email',
//   K: 'response',
//   L: 'helpfulness'

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
//       helpfulness: {
//         type: Number,
//         default: 0
//       }, // put req in here
//       photos: [{
//         id: Number,
//         url: String
//       }],
//       reported: {
//         type: Boolean,
//         default: false // default false
//       }

//     }
//   ],
//   ratings: { // default don't send if empty
//     0: String,
//     1: String,
//     2: String,
//     3: String,
//     4: String
//   },
//   recommended: {
//     false: String,
//     true: String
//   },
//   characteristics: { // default don't send if empty
//     Size: {
//       id: Number,
//       value: String
//     },
//     Width: {
//       id: Number,
//       value: String
//     },
//     Comfort: {
//       id: Number,
//       value: String
//     },
//     Quality: {
//       id: Number,
//       value: String
//     }
//   }
// });

