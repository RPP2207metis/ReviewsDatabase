const XLSX = require("xlsx");
require('buffer').constants.MAX_STRING_LENGTH = Infinity;
console.log("🚀🚀");

const charReviewsWorkBook = XLSX.readFile("/Users/admin/Documents/SDC\ Data\ and\ Docs/characteristic_reviews.csv");

console.log("🚀🚀🚀🚀🚀");
// const charReviewsWorkBook = XLSX.readFile("/Users/admin/Documents/SDC\ Data\ and\ Docs/reviews_photos_test.csv");
// const charReviewsWorkBook = XLSX.readFile("/Users/admin/Documents/SDC\ Data\ and\ Docs/split_reviews_photos/reviews_photos-1.csv");
const sheetNameListPhotos = charReviewsWorkBook.SheetNames;

sheetNameListPhotos.forEach((sheetNameIndividual) => {
  const currentSheet = charReviewsWorkBook.Sheets[sheetNameIndividual];
  // console.log("Photos: currentSheet: ", currentSheet);
  const headersPhoto = {};
  const dataPhoto = [];

  for (const cell in currentSheet) {
    if (cell === "!ref") continue;

    const col = cell.substring(0, 1);
    const row = Number(cell.slice(1));
    const value = currentSheet[cell].v;

    if (row === 1) {
      headersPhoto[col] = value;
      continue;
    }

    if (!dataPhoto[row]) {
      dataPhoto[row] = {};
      dataPhoto[row][col] = value;
      continue;
    }
    dataPhoto[row][col] = (value === "null" ? null : value); // Sets value in the object and then Cleans "null"
  }
  dataPhoto.shift();
  dataPhoto.shift();
  // console.log("🚀 headersPhoto, dataPhoto: ", headersPhoto, dataPhoto);
  module.exports = { headersPhoto, dataPhoto };
});
