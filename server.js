require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const reviewsRouter = require('./routes/reviews.js');

// const newrelic = require('newrelic');
// require('newrelic');

const app = express();

mongoose.set('strictQuery', true);

// mongoose.connect('mongodb://localhost/cows');
// mongoose.connect(`mongodb://usersdc2:sdcsdc@18.188.134.179:27017/sdcdatabase`);
mongoose.connect(`mongodb://usersdc2:sdcsdc@ec2-18-188-134-179.us-east-2.compute.amazonaws.com:27017/sdcdatabase?authSource=sdcdatabase`);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connection to Database Established!'));

app.use(express.json());

app.use('/reviews', reviewsRouter);

app.listen(process.env.PORT, () => console.log(`Server on localhost ${process.env.PORT}...`)); // Comment out for Jest

module.exports = app;
