// import "jest-dom/extend-expect";
// import axiosMock from "axios";
// import request from 'supertest';
// import express from 'express';

const mongoose = require('mongoose');
const Review = require('../models/review.js');
const Counter = require('../models/counter.js');
const request = require('supertest');
const app = require('../server.js');
const reviewsRouter = require('../routes/reviews.js');
const ReviewData = {
  "product": "2",
  "page": 0,
  "count": 5,
  "results": [
    {
      "review_id": 5,
      "rating": 3,
      "summary": "I'm enjoying wearing these shades",
      "recommend": false,
      "response": null,
      "body": "Comfortable and practical.",
      "date": "2019-04-14T00:00:00.000Z",
      "reviewer_name": "shortandsweeet",
      "helpfulness": 5,
      "photos": [{
          "id": 1,
          "url": "urlplaceholder/review_5_photo_number_1.jpg"
        },
        {
          "id": 2,
          "url": "urlplaceholder/review_5_photo_number_2.jpg"
        }
      ]
    },
    {
      "review_id": 3,
      "rating": 4,
      "summary": "I am liking these glasses",
      "recommend": false,
      "response": "Glad you're enjoying the product!",
      "body": "They are very dark. But that's good because I'm in very sunny spots",
      "date": "2019-06-23T00:00:00.000Z",
      "reviewer_name": "bigbrotherbenjamin",
      "helpfulness": 5,
      "photos": [],
    }
  ],
  ratings: {
    1: '1',
    2: '1',
    3: '1',
    4: '1',
    5: '1'
  },
  recommended: {
    false: '1',
    true: '1'
  },
  characteristics: [{
    id: 1,
    name: 'Quality',
    value: []
  }]
};

describe('Test the root path', () => {
  test('It should response the GET method', async (done) => {
    const response = await request(app).get('/reviews');
    expect(response.statusCode).toBe(200);
    done();
  });
});

describe('Test the mongodb connection', (done) => {
  test('It should connect to the database', async () => {
    const response = await request(app).get('/reviews');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Connection to Database Established!');
    done();
  });
});

describe('Test the reviews router', (done) => {
  test('It should response the GET method', async () => {
    const response = await request(app).get('/reviews/meta?product_id=1');
    expect(response.statusCode).toBe(200);
    done();
  });
});
