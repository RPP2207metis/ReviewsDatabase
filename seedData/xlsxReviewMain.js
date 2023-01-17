const XLSX = require("xlsx");

require('buffer').constants.MAX_STRING_LENGTH = Infinity;
const workbook = XLSX.readFile("/Users/admin/Documents/SDC\ Data\ and\ Docs/reviews.csv");
// const workbook = XLSX.readFile("/Users/admin/Documents/SDC\ Data\ and\ Docs/reviews-30.csv");
const sheetNameListReviews = workbook.SheetNames; // sheetNameListReviews =[ 'Sheet1' ] // getting as Sheet1

sheetNameListReviews.forEach(function (sheetNameIndividual) {
  console.log('inside main!');
  const worksheet = workbook.Sheets[sheetNameIndividual]; // *.Sheets ('Sheet Name') to access the data
  // worksheet is a giant object = { A1: { t: 's', v: 'id' }, etc...)

  const headers = {};
  const data = [];
  // const mergeHeaderAndData = {};

  for (const currentCell in worksheet) {
    if (currentCell === "!ref") {
      // console.log("skips !ref column");
      continue;
    }
    const currentCellObj = worksheet[currentCell]; // i.e. worksheet[A2] = { t: 'n', w: '1', v: 1 }
    const currentValue = currentCellObj.v;
    const col = currentCell.substring(0, 1);
    const row = parseInt(currentCell.substring(1));
    // console.log("currentCell: ", currentCell, " col, row and Value: ", col, row, currentValue);

    if (row === 1) {
      // console.log("🚀 ~ file: xlsx.js:27 ~ console.log ~ row", row)
      headers[col] = currentValue;
      continue;
    }

    if (!data[row]) {
      data[row] = {}; // data should now be [undef,undef, {}]
      data[row][col] = currentValue;
      continue;
    }

    data[row][col] = (currentValue === "null" ? null : currentValue); // Cleans "null"
  }

  data.shift();
  data.shift();
  // console.log("headers:", headers, " data:", data);
  console.log("Testing...");

  module.exports = { headers, data };
});
