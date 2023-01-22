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
const fileName = "/Users/admin/Documents/SDC\ Data\ and\ Docs/reviews.csv";

const stream = fs.createReadStream(fileName);
const chunkSize = 5000; // default 5000

let totalRows = 0;
let productToSaveNewData = {};
const productIdSavedAlready = {}; // For logic of saving new or updating in Mongo
let updateData = [];
const updateDetails = {};
let toDelete = 0;
let newSave = 0;

csv()
  .fromStream(stream)
  .subscribe(async (eachReviewRow) => {

    if (!productIdSavedAlready[eachReviewRow.product_id]) {
      productToSaveNewData[eachReviewRow.product_id] = eachReviewRow; // saved to productToSaveNewData object
      productIdSavedAlready[eachReviewRow.product_id] = true;
      totalRows++;
    } else {
      updateData.push(eachReviewRow);
      totalRows++;
    }
    if (totalRows % chunkSize === 0) {

      await importDataNewSave(productToSaveNewData)
        .then(async (res) => {
          await importDataUpdateAll(updateData)
            .then((res) => {
              console.log("done updating chunk.");
              while (toDelete < newSave - 3) {
                delete updateDetails[toDelete];
                delete productIdSavedAlready[toDelete];
                toDelete++;
              }
              productToSaveNewData = {};
              updateData = []; // { 123: [{header: 1, etc...},{ each review: 123}, etc      ]  , 124: [reviewobjects inside];
            })
            .catch((err) => {
              console.log("ERROR in csv UPDATE chunk! ", err);
            });
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
      await importDataNewSave(productToSaveNewData)
        .then(async (res) => {
          await importDataUpdateAll(updateData)
            .then((res) => {
              productToSaveNewData = {};
              updateData = [];
            })
            .catch((err) => {
              console.log("ERROR in csv UPDATE last chunk! ", err);
            });
        })
        .catch((err) => {
          console.log("ERROR in csv SAVING last chunk! ", err);
        });
      console.log('Stream finished');
      process.exit(0);
    }
  });

async function importDataNewSave (data) { // now data is an object {productid: {headers: all data}}
  // console.log("inside importData()", data[0]);
  const jsonReady = [];
  for (const productIdKey in data) {
    const currentObj = data[productIdKey];
    const photos = [];
    const jsonMongo = {
      product: currentObj.product_id,
      page: 1,
      count: 1,
      results: [
        {
          review_id: currentObj.id,
          rating: currentObj.rating,
          summary: currentObj.summary,
          recommend: currentObj.recommend === "true",
          response: currentObj.response === "null" ? null : currentObj.response,
          body: currentObj.body,
          date: currentObj.date,
          reviewer_name: currentObj.reviewer_name,
          helpfulness: currentObj.helpfulness,
          photos,
          reported: currentObj.reported === "true"
        }
      ],
      ratings: {
        1: currentObj.rating === '1' ? '1' : '0',
        2: currentObj.rating === '2' ? '1' : '0',
        3: currentObj.rating === '3' ? '1' : '0',
        4: currentObj.rating === '4' ? '1' : '0',
        5: currentObj.rating === '5' ? '1' : '0'
      },
      recommended: {
        false: currentObj.recommend === "false" ? '1' : '0',
        true: currentObj.recommend === "true" ? '1' : '0'
      },
      characteristics: {}
    };
    updateDetails[currentObj.product_id] = {};
    updateDetails[currentObj.product_id]["ratings." + currentObj.rating] = 1;
    updateDetails[currentObj.product_id]["recommended." + (currentObj.recommend).toLowerCase()] = 1;
    jsonReady.push(jsonMongo);
    newSave++;
  }
  // After all new saves are ready
  try {
    console.log("saving", jsonReady.length, "new product id reviews. Currently processing", totalRows, "rows.");

    return await Review.insertMany(jsonReady)
      .catch((err) => console.log('ERROR CREATING: ', err));
  } catch (err) {
    console.error(err);
  }
};

async function importDataUpdateAll (data) {
  // console.log("inside importData()", data[0]);
  const photos = [];
  const bulkOps = [];
  for (let i = 0; i < data.length; i++) {
    const productIdString = data[i].product_id;
    // console.log('Found product ID : Updating exisiting schema in mongo', productIdString, typeof productIdString);

    try {
      // If Product Id is found and we just need to update it
      await Review.findOneAndUpdate({ product: productIdString }, { $inc: { count: 1 } })
        .then(async (result) => {
          const keyRec = "recommended." + (data[i].recommend).toLowerCase();

          if (!updateDetails[productIdString]["ratings." + data[i].rating]) {
            updateDetails[productIdString]["ratings." + data[i].rating] = 1;
          } else {
            updateDetails[productIdString]["ratings." + data[i].rating]++;
          }
          if (!updateDetails[productIdString][keyRec]) {
            updateDetails[productIdString][keyRec] = 1;
          } else {
            updateDetails[productIdString][keyRec]++;
          }
          bulkOps.push(
            {
              updateOne: {
                filter: {
                  product: productIdString
                },
                update: {
                  $set: updateDetails[productIdString],
                  $push: {
                    results: {
                      review_id: data[i].id,
                      rating: data[i].rating,
                      summary: data[i].summary,
                      recommend: data[i].recommend === "true",
                      response: data[i].response === "null" ? null : data[i].response,
                      body: data[i].body,
                      date: data[i].date,
                      reviewer_name: data[i].reviewer_name,
                      helpfulness: data[i].helpfulness,
                      photos,
                      reported: data[i].reported === "true"
                    }
                  }
                }
              }
            }
          );
        })
        .catch((err) => console.error('catch for findOne, ', err));
    } catch (err) {
      console.error(err);
    }
  }
  Review.bulkWrite(bulkOps)
    .then(bulkResult => console.log(`bulkWrite.then: Successfully added ${bulkResult.nModified} reviews to the results array`))
    .catch(err => console.log(err));
};
