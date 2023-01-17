require('buffer').constants.MAX_STRING_LENGTH = Infinity;
const mongoose = require('mongoose');
const Review = require('./models/review.js');
const excelData = require('./seedData/xlsxReviewMain.js');
// const excelDataPhoto = require('./seedData/xlsxPhoto.js');

// console.log("🚀 ~ file: initSeed.js:5 ~ excelDataPhoto", excelDataPhoto.headersPhoto, excelDataPhoto.dataPhoto);

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost/reviewsSDC');
const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('connected DB in seed file...'));

const productIdSaved = {}; // For logic of saving new or updating in Mongo

// const photoAllArr = excelDataPhoto.dataPhoto;

importData();

async function importData () {
  // console.log("inside importData()", excelData.data);
  for (const keyCol in excelData.data) {

    // console.log("🚀 ~ file: initSeed.js:21 ~ importData ~ keyCol", keyCol)
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

    // const photosForCurrentReview = photoAllArr.filter((photoUploaded) => {
    //   return photoUploaded.B === review_id;
    // }).map((filteredEach) => {
    //   filteredEach.id = filteredEach.A;
    //   filteredEach.url = filteredEach.C;
    //   return filteredEach;
    // });

    // const photos = photosForCurrentReview;

    const photos = [];

    if (!productIdSaved[product_id]) {
      // if the product id is not saved, need to create a new object for it in DB.
      productIdSaved[product_id] = true;

      const jsonMongo = {
        product: product_id,
        page: 1,
        count: 1,
        results: [
          {
            review_id,
            rating,
            summary,
            recommend,
            response,
            body,
            date,
            reviewer_name,
            helpfulness,
            photos,
            reported
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
        characteristics: {}
      };

      const newReview = new Review(jsonMongo);

      try {
        const done = await newReview.save();
        console.log("saved new product ID: ", product_id);
      } catch (err) {
        console.error(err);
      }

    } else {

      const productIdString = await product_id.toString();
      // console.log('Found product ID : Updating exisiting schema in mongo', productIdString, typeof productIdString);

      try {
        // If Product Id is found and we just need to update it
        const updated = await Review.findOneAndUpdate({ product: productIdString }, { $inc: { count: 1 } }, { new: true })
          .then(async (result) => {
            console.log("Product Id is found : Update!", product_id);
            const oldRating = result.ratings[rating];
            const newRating = await Number(oldRating) + 1;
            // const keyRating = "ratings." + rating;
            const newRec = await Number(result.recommended[recommend]) + 1;
            // const keyRec = "recommended." + recommend;
            // const newReview = {
            //   review_id: review_id,
            //   rating: rating,
            //   summary: summary,
            //   recommend: recommend,
            //   response: response,
            //   body: body,
            //   date: date,
            //   reviewer_name: reviewer_name,
            //   helpfulness: helpfulness,
            //   photos: photos
            // };

            await Review.updateOne({ product: productIdString }, {
              $set: {
                ["ratings." + rating]: newRating,
                ["recommended." + recommend]: newRec
              },
              $push: {
                results: {
                  review_id,
                  rating,
                  summary,
                  recommend,
                  response,
                  body,
                  date,
                  reviewer_name,
                  helpfulness,
                  photos,
                  reported
                }
              }
            })
              .then((resultUpdated) => console.log())
              .catch((err) => console.error(err));
          })
          .catch((err) => console.error(err));
      } catch (err) {
        console.error(err);
      }

    }
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

