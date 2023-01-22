// Master File
const fs = require('fs');
const csv = require('csvtojson');
const mongoose = require('mongoose');
const Review = require('../models/review.js');

mongoose.set('strictQuery', true);
// mongoose.connect('mongodb://localhost/reviews_sdc'); // REAL DATA IMPORT
// mongoose.connect('mongodb://localhost/test'); // TEST DB
mongoose.connect('mongodb://localhost/cows'); // TEST DB
const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('connected DB in STREAM file...'));

// const fileName = "/Users/admin/Documents/SDC\ Data\ and\ Docs/reviews-30.csv";
// const fileName = "/Users/admin/Downloads/splitcsv-ca5d7231-2a3d-49d2-9b66-95d92bb74b2c-results/reviews-2.csv";
const fileName = "/Users/admin/Documents/SDC\ Data\ and\ Docs/characteristic_reviews.csv";

const stream = fs.createReadStream(fileName);
const chunkSize = 5000; // default 5000

let totalRows = 0;
let updateData = [];

csv()
  .fromStream(stream)
  .subscribe(async (eachReviewRow) => {

    updateData.push(eachReviewRow);
    totalRows++;

    if (totalRows % chunkSize === 0) {

      await importDataChar(updateData)
        .then(async (res) => {
          updateData = []; // { 123: [{header: 1, etc...},{ each review: 123}, etc      ]  , 124: [reviewobjects inside];
        })
        .catch((err) => {
          console.log("ERROR in csv SAVING chunk! ", err);
        });
    }
  })
  .on('done', async (error) => {
    if (error) {
      console.error(error);
    } else {
      await importDataChar(updateData)
        .then(async (res) => {
          console.log("🚀 ~ file: xlsxReviewChars.js:67 ~ .then ~ res", res);
        })
        .catch((err) => {
          console.log("ERROR in csv SAVING last chunk! ", err);
        });
      console.log('Stream finished');
    }
  });

async function importDataChar (data) {
  console.log("inside importData()", data[0]);
  for (let i = 0; i < data.length; i++) {
    const charObj = data[i];
    const id = charObj.id; // of char
    const characteristic_id = charObj.characteristic_id;
    const value = charObj.value;
    console.log('Found product ID : Updating exisiting schema in mongo', charObj);
    try {
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
    } catch (err) {
      console.error(err);
    }
  }
};
