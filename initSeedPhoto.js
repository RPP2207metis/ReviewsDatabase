require('buffer').constants.MAX_STRING_LENGTH = Infinity;
const mongoose = require('mongoose');
const Review = require('./models/review.js');
// const Review = require('./models/reviewMimport.js');
const excelDataPhoto = require('./seedData/xlsxPhoto.js');

// console.log("🚀 ~ file: initSeed.js:5 ~ excelDataPhoto", excelDataPhoto.headersPhoto, excelDataPhoto.dataPhoto);
mongoose.set('strictQuery', true);
// mongoose.connect('mongodb://localhost/reviewsSDC');
mongoose.connect('mongodb://localhost/cows');
const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('connected DB in PHOTO seed file. Seeding Now...'));

importData();

async function importData () {
  // console.log("inside importData()", excelDataPhoto.dataPhoto);
  for (const keyCol in excelDataPhoto.dataPhoto) {

    // console.log("🚀 ~ file: initSeed.js:21 ~ importData ~ keyCol", keyCol)
    const photoObj = excelDataPhoto.dataPhoto[keyCol];
    const id = photoObj.A; // of photo
    const review_id = photoObj.B;
    const url = photoObj.C;

    // console.log("🚀 ~ file: initSeedPhoto.js:28 ~ importData ~ photoObj", photoObj, " review_id: ", review_id);
    await Review.updateOne({ "results.review_id": review_id }, {
      $push: {
        "results.$.photos": {
          id,
          url
        }
      }
    })
      .then((res) => console.log(id, 'photo Id Updated', res))
      .catch((err) => console.error(err));
  }
}