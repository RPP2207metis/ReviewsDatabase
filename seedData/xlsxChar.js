const XLSX = require("xlsx");
const workbook = XLSX.readFile("/Users/admin/Documents/SDC\ Data\ and\ Docs/characteristics_test.csv");
const sheetName = workbook.SheetNames;

sheetName.forEach((worksheetname) => {

  const allCells = workbook.Sheets[worksheetname];

  const headersChar = {};
  const dataChar = [];

  for (const currentcell in allCells) {
    if (currentcell === '!ref') continue;
    const col = currentcell.substring(0, 1);
    const row = Number(currentcell.substring(1));
    const value = allCells[currentcell].v;
    // console.log("🚀 ~ file: xlsxCharMain.js:15 ~ col, row, value: ", col, row, value);

    if (row === 1) {
      headersChar[col] = value;
      continue;
    }

    if (!dataChar[row]) {
      dataChar[row] = {};
      dataChar[row][col] = value;
      continue;
    }
    // dataChar[row][col] = value;
    dataChar[row][col] = (value === "null" ? null : value);
  }
  dataChar.shift();
  dataChar.shift();
  console.log("🚀 ~ file: xlsxChar.js:35 ~ sheetName.forEach ~ headersChar", headersChar, dataChar)
  module.exports = { headersChar, dataChar };
});
