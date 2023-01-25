require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const reviewsRouter = require('./routes/reviews.js');

const app = express();

mongoose.set('strictQuery', true); // DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7. Use `mongoose.set('strictQuery', false);` if you want to prepare for this change. Or use `mongoose.set('strictQuery', true);` to suppress this warning.
// mongoose.connect('mongodb://localhost/reviewsSDC'); // Old copy with 600k reviews seeded
// mongoose.connect('mongodb://localhost/reviews_sdc');
// mongoose.connect('mongodb://localhost/reviewsImport');
mongoose.connect('mongodb://localhost/cows');
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connection to Database Established!'));

app.use(express.json());

app.use('/reviews', reviewsRouter);

app.listen(process.env.PORT, () => console.log(`Server on localhost ${process.env.PORT}...`));

// module.exports = db;
