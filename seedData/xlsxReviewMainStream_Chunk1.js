require('buffer').constants.MAX_STRING_LENGTH = Infinity;
// const XLSX = require("xlsx");
const fs = require('fs');
const csv = require('csvtojson');
const mongoose = require('mongoose');
const Review = require('../models/review.js');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost/reviews_sdc');
const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('connected DB in STREAM file...'));

const fileName = "/Users/admin/Documents/SDC\ Data\ and\ Docs/reviews-30.csv";
// const fileName = "/Users/admin/Documents/SDC\ Data\ and\ Docs/reviews.csv";
const stream = fs.createReadStream(fileName);
const chunkSize = 1;

let totalRows = 0;
const productIdSaved = {}; // For logic of saving new or updating in Mongo

let data = [];

csv()
  .fromStream(stream)
  .subscribe(async (row) => {
    // console.log("🚀 ~ file: xlsxReviewMainStream.js:22 ~ .subscribe ~ json", row);

    data.push(row);

    totalRows++;

    if (totalRows % chunkSize === 0) {
      console.log(`CHUNK OF ${chunkSize} REACHED!`, data);

      await importData(data)
        .then((res) => {
          console.log("clearing data array...");
          data = [];
        });

      // } catch (err) {
      //   console.log("Error in csv saving chunk! ", err);
      // } finally {
      //   data = [];
      // }
    }
  });


async function importData (data) {
  // console.log("inside importData()", data);
  for (let i = 0; i < data.length; i++) {

    const photos = [];

    if (!productIdSaved[data[i].product_id]) {
      console.log('create new case!');
      // if the product id is not saved, need to create a new object for it in DB.
      productIdSaved[data[i].product_id] = true;

      const jsonMongo = {
        product: data[i].product_id,
        page: 1,
        count: 1,
        results: [
          {
            review_id: data[i].id,
            rating: data[i].rating,
            summary: data[i].summary,
            recommend: Boolean(data[i].recommend),
            response: data[i].response === "null" ? null : data[i].response,
            body: data[i].body,
            date: data[i].date,
            reviewer_name: data[i].reviewer_name,
            helpfulness: data[i].helpfulness,
            photos,
            reported: Boolean(data[i].reported)
          }
        ],
        ratings: {
          1: data[i].rating === '1' ? '1' : '0',
          2: data[i].rating === '2' ? '1' : '0',
          3: data[i].rating === '3' ? '1' : '0',
          4: data[i].rating === '4' ? '1' : '0',
          5: data[i].rating === '5' ? '1' : '0'
        },
        recommended: {
          false: data[i].recommend === "TRUE" ? '1' : '0',
          true: data[i].recommend === "FALSE" ? '1' : '0'
        },
        characteristics: {}
      };

      const newReview = new Review(jsonMongo);

      try {
        const done = await newReview.save();
        console.log("saved new product ID: ", data[i].id);
        return done;

      } catch (err) {
        console.error(err);
      }

    } else {

      // const productIdString = await product_id.toString();
      const productIdString = data[i].product_id;
      console.log('Found product ID : Updating exisiting schema in mongo', productIdString, typeof productIdString);

      try {
        // If Product Id is found and we just need to update it
        const updated = await Review.findOneAndUpdate({ product: productIdString }, { $inc: { count: 1 } }, { new: true })
          .then(async (result) => {
            console.log("Product Id is found : Update!", data[i].product_id);
            const oldRating = result.ratings[data[i].rating];
            const newRating = await Number(oldRating) + 1;
            const newRec = await Number(result.recommended[(data[i].recommend).toLowerCase()]) + 1;
            const keyRec = "recommended." + ((data[i].recommend).toLowerCase());

            await Review.updateOne({ product: productIdString }, {
              $set: {
                ["ratings." + data[i].rating]: newRating,
                [keyRec]: newRec
              },
              $push: {
                results: {
                  review_id: data[i].id,
                  rating: data[i].rating,
                  summary: data[i].summary,
                  recommend: Boolean(data[i].recommend),
                  response: data[i].response === "null" ? null : data[i].response,
                  body: data[i].body,
                  date: data[i].date,
                  reviewer_name: data[i].reviewer_name,
                  helpfulness: data[i].helpfulness,
                  photos,
                  reported: Boolean(data[i].reported)
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

// sheetNameListReviews.forEach(function (sheetNameIndividual) {
//   console.log('inside main!');
//   const worksheet = workbook.Sheets[sheetNameIndividual]; // *.Sheets ('Sheet Name') to access the data
//   // worksheet is a giant object = { A1: { t: 's', v: 'id' }, etc...)

//   const headers = {};
//   const data = [];
//   // const mergeHeaderAndData = {};

//   for (const currentCell in worksheet) {
//     if (currentCell === "!ref") {
//       // console.log("skips !ref column");
//       continue;
//     }
//     const currentCellObj = worksheet[currentCell]; // i.e. worksheet[A2] = { t: 'n', w: '1', v: 1 }
//     const currentValue = currentCellObj.v;
//     const col = currentCell.substring(0, 1);
//     const row = parseInt(currentCell.substring(1));
//     // console.log("currentCell: ", currentCell, " col, row and Value: ", col, row, currentValue);

//     if (row === 1) {
//       // console.log("🚀 ~ file: xlsx.js:27 ~ console.log ~ row", row)
//       headers[col] = currentValue;
//       continue;
//     }

//     if (!data[row]) {
//       data[row] = {}; // data should now be [undef,undef, {}]
//       data[row][col] = currentValue;
//       continue;
//     }

//     data[row][col] = (currentValue === "null" ? null : currentValue); // Cleans "null"
//   }

//   data.shift();
//   data.shift();
//   // console.log("headers:", headers, " data:", data);
//   console.log("Testing...");

//   module.exports = { headers, data };
// });
