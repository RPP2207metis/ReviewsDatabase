const XLSX = require("xlsx");
const workbook = XLSX.readFile("/Users/admin/Documents/SDC\ Data\ and\ Docs/reviews-30.csv");
const sheetnamNameList = workbook.SheetNames;
console.log("🚀 ~ file: xlsx.js:4 ~ sheetnamNameList", sheetnamNameList); // getting as Sheet1

sheetnamNameList.forEach(function (y) {
  const worksheet = workbook.Sheets[y];
  console.log("worksheet, ", worksheet);




});
