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

// const fileName = "/Users/admin/Documents/SDC\ Data\ and\ Docs/reviews-30.csv";
const fileName = "/Users/admin/Documents/SDC\ Data\ and\ Docs/reviews.csv";

const stream = fs.createReadStream(fileName);
const chunkSize = 10000;

let totalRows = 0;
let productToSaveNewData = {};
const productIdSavedAlready = {}; // For logic of saving new or updating in Mongo
let updateData = [];

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

      // process create() productToSaveNewData and then clear it

      await importDataNewSave(productToSaveNewData)
        .then(async (res) => {

          await importDataUpdateAll(updateData)
            .then((res) => {
              console.log("done updating chunk.");

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
          // recommend: (currentObj.recommend === "TRUE" || currentObj.recommend === "true"),
          response: currentObj.response === "null" ? null : currentObj.response,
          body: currentObj.body,
          date: currentObj.date,
          reviewer_name: currentObj.reviewer_name,
          helpfulness: currentObj.helpfulness,
          photos,
          reported: currentObj.reported === "true"
          // reported: (currentObj.reported === "TRUE" || currentObj.reported === "true")
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

    jsonReady.push(jsonMongo);

  }

  // After all new saves are ready

  try {
    console.log("saving", jsonReady.length, "new product id reviews. Currently processing", totalRows, "rows.");
    // await Review.create(jsonReady)
    await Review.insertMany(jsonReady)
      // .then((res) => {
      //   // console.log("after create: ", res);
      //   console.log("insert many complete.");
      // })
      .catch((err) => console.log('ERROR CREATING: ', err));

  } catch (err) {
    console.error(err);
  }
};

async function importDataUpdateAll (data) {
  // console.log("inside importData()", data[0]);
  const photos = [];

  for (let i = 0; i < data.length; i++) {

    // const productIdString = await product_id.toString();
    const productIdString = data[i].product_id;
    // console.log('Found product ID : Updating exisiting schema in mongo', productIdString, typeof productIdString);

    try {
      // If Product Id is found and we just need to update it
      const updated = await Review.findOne({ product: productIdString })
        .then(async (result) => {
          // console.log("Product Id is found : Update!", data[i].product_id);
          const newCount = result.count + 1;
          const oldRating = result.ratings[data[i].rating];
          const newRating = await Number(oldRating) + 1;
          const newRec = await Number(result.recommended[(data[i].recommend).toLowerCase()]) + 1;
          const keyRec = "recommended." + ((data[i].recommend).toLowerCase());

          await Review.updateOne({ product: productIdString }, {
            $set: {
              ["ratings." + data[i].rating]: newRating,
              [keyRec]: newRec,
              count: newCount
            },
            $push: {
              results: {
                review_id: data[i].id,
                rating: data[i].rating,
                summary: data[i].summary,
                recommend: data[i].recommend === "true", // could be TRUE
                response: data[i].response === "null" ? null : data[i].response,
                body: data[i].body,
                date: data[i].date,
                reviewer_name: data[i].reviewer_name,
                helpfulness: data[i].helpfulness,
                photos,
                reported: data[i].reported === "true"
              }
            }
          })
            // .then((resultUpdated) => console.log("updated ", data.length, " into already existing product id."))
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.error(err);
    }
  }
};
