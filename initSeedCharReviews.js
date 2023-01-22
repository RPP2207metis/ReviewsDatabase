require('buffer').constants.MAX_STRING_LENGTH = Infinity;
const mongoose = require('mongoose');
const Review = require('./models/review.js');
const excelDataCharReviews = require('./seedData/xlsxCharReviews.js');

// console.log("🚀 ~ file: initSeed.js:5 ~ excelDataCharReviews", excelDataCharReviews.headersPhoto, excelDataCharReviews.dataPhoto);
mongoose.set('strictQuery', true);
// mongoose.connect('mongodb://localhost/reviewsSDC');
mongoose.connect('mongodb://localhost/cows');
const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('connected DB in CHAR REVIEWS seed file. Seeding Now...'));

importData();

async function importData () {
  // console.log("inside importData()", excelDataCharReviews.dataPhoto);
  for (const keyCol in excelDataCharReviews.dataPhoto) {

    // console.log("🚀 ~ file: initSeed.js:21 ~ importData ~ keyCol", keyCol)
    const charObj = excelDataCharReviews.dataPhoto[keyCol];
    const id = charObj.A; // of char Review
    const characteristic_id = charObj.B;
    const value = charObj.D;
    // console.log("🚀 ~ file: initSeedPhoto.js:28 ~ importData ~ charObj", charObj, " review_id: ", review_id);
    await Review.updateOne({ "characteristics.id": characteristic_id }, {
      $push: {
        "characteristics.$.value": {
          id,
          value
        }
      }
    })
      .then((res) => console.log(id, 'char Id Updated', res))
      .catch((err) => console.error(err));
  }
}
