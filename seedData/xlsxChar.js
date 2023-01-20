const XLSX = require("xlsx");
require('buffer').constants.MAX_STRING_LENGTH = Infinity;
const photoWorkBook = XLSX.readFile("/Users/admin/Documents/SDC\ Data\ and\ Docs/characteristics.csv");
// const photoWorkBook = XLSX.readFile("/Users/admin/Documents/SDC\ Data\ and\ Docs/reviews_photos_test.csv");
// const photoWorkBook = XLSX.readFile("/Users/admin/Documents/SDC\ Data\ and\ Docs/split_reviews_photos/reviews_photos-1.csv");
const sheetNameListPhotos = photoWorkBook.SheetNames;

sheetNameListPhotos.forEach((sheetNameIndividual) => {
  const currentSheet = photoWorkBook.Sheets[sheetNameIndividual];
  // console.log("Photos: currentSheet: ", currentSheet);
  const headersChar = {};
  const dataChar = [];

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
  console.log("🚀 headersChar, dataChar: ", headersChar, dataChar);
  module.exports = { headersChar, dataChar };
});
