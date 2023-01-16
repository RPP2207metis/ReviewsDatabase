const XLSX = require("xlsx");
const photoWorkBook = XLSX.readFile("/Users/admin/Documents/SDC\ Data\ and\ Docs/reviews_photos_test.csv");
const sheetNameListPhotos = photoWorkBook.SheetNames;

sheetNameListPhotos.forEach((sheetNameIndividual) => {
  const currentSheet = photoWorkBook.Sheets[sheetNameIndividual];
  console.log("Photos: currentSheet: ", currentSheet);

  const headersPhoto = {};
  const dataPhoto = [];

  // row, column value

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

  console.log("🚀 headersPhoto, dataPhoto: ", headersPhoto, dataPhoto);
  module.exports = { headersPhoto, dataPhoto };
});
