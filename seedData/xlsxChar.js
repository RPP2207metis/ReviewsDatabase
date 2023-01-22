const XLSX = require("xlsx");
// require('buffer').constants.MAX_STRING_LENGTH = Infinity;
console.log("🚀");
const charWorkBook = XLSX.readFile('/Users/admin/Documents/SDC Data and Docs/characteristics.csv');
console.log("🚀🚀🚀🚀🚀");
// const charWorkBook = XLSX.readFile("/Users/admin/Documents/SDC\ Data\ and\ Docs/reviews_photos_test.csv");
// const charWorkBook = XLSX.readFile("/Users/admin/Documents/SDC\ Data\ and\ Docs/split_reviews_photos/reviews_photos-1.csv");
const sheetNameListPhotos = charWorkBook.SheetNames;

sheetNameListPhotos.forEach((sheetNameIndividual) => {
  const currentSheet = charWorkBook.Sheets[sheetNameIndividual];
  console.log("INSIDE CHARACTER START: currentSheet: ", currentSheet);
  const headersChar = {};
  const dataChar = [];

  for (const cell in currentSheet) {
    if (cell === "!ref") continue;

    const col = cell.substring(0, 1);
    const row = Number(cell.slice(1));
    const value = currentSheet[cell].v;

    if (row === 1) {
      headersChar[col] = value;
      continue;
    }

    if (!dataChar[row]) {
      dataChar[row] = {};
      dataChar[row][col] = value;
      continue;
    }
    dataChar[row][col] = (value === "null" ? null : value); // Sets value in the object and then Cleans "null"
  }
  dataChar.shift();
  dataChar.shift();
  console.log("🚀 headersChar, dataChar: ", headersChar, dataChar);
  module.exports = { headersChar, dataChar };
});
