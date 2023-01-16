const XLSX = require("xlsx");
const workbook = XLSX.readFile("/Users/admin/Documents/SDC\ Data\ and\ Docs/characteristic_reviews_test.csv");
const sheetName = workbook.SheetNames;

sheetName.forEach((worksheetname) => {

  const allCells = workbook.Sheets[worksheetname];

  const headersCharReviews = {};
  const dataCharReviews = [];

  for (const currentcell in allCells) {
    if (currentcell === '!ref') continue;
    const col = currentcell.substring(0, 1);
    const row = Number(currentcell.substring(1));
    const value = allCells[currentcell].v;
    // console.log("🚀 ~ file: xlsxCharMain.js:Reviews5 ~ col, row, value: ", col, row, value);

    if (row === 1) {
      headersCharReviews[col] = value;
      continue;
    }

    if (!dataCharReviews[row]) {
      dataCharReviews[row] = {};
      dataCharReviews[row][col] = value;
      continue;
    }
    // dataCharReviews[row][col] = value;
    dataCharReviews[row][col] = (value === "null" ? null : value);
  }
  dataCharReviews.shift();
  dataCharReviews.shift();
  console.log("🚀 ~ file: xlsxCharReviews.js:35 ~ sheetName.forEach ~ headersCharReviews", headersCharReviews, dataCharReviews)
  module.exports = { headersCharReviews, dataCharReviews };

});
