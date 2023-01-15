require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.set('strictQuery', true); // DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7. Use `mongoose.set('strictQuery', false);` if you want to prepare for this change. Or use `mongoose.set('strictQuery', true);` to suppress this warning.
mongoose.connect('mongodb://localhost/reviewsSDC'); // no need for {useNewUrlParser: true} anymore?
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connection to Database Established!'));

app.use(express.json());

const reviewsRouter = require('./routes/reviews.js');

app.use('/reviews', reviewsRouter);

app.listen(process.env.PORT, () => console.log(`Server on localhost ${process.env.PORT}...`));
