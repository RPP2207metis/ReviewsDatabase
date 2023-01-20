require('buffer').constants.MAX_STRING_LENGTH = Infinity;
const mongoose = require('mongoose');
const Review = require('./models/review.js');
const excelDataPhoto = require('./seedData/xlsxChar.js');

// console.log("🚀 ~ file: initSeed.js:5 ~ excelDataPhoto", excelDataPhoto.headersPhoto, excelDataPhoto.dataPhoto);
mongoose.set('strictQuery', true);
// mongoose.connect('mongodb://localhost/reviewsSDC');
mongoose.connect('mongodb://localhost/cows');
const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('connected DB in CHAR seed file. Seeding Now...'));

importData();

async function importData () {
  // console.log("inside importData()", excelDataPhoto.dataPhoto);
  for (const keyCol in excelDataPhoto.dataPhoto) {

    // console.log("🚀 ~ file: initSeed.js:21 ~ importData ~ keyCol", keyCol)
    const charObj = excelDataPhoto.dataPhoto[keyCol];
    const id = charObj.A; // of char
    const product_id = charObj.B;
    const name = charObj.C;
    // console.log("🚀 ~ file: initSeedPhoto.js:28 ~ importData ~ charObj", charObj, " review_id: ", review_id);
    await Review.updateOne({ product: product_id }, {
      $push: {
        id,
        name,
        value: []
      }
    })
      .then((res) => console.log(id, 'char Id Updated', res))
      .catch((err) => console.error(err));
  }
}
