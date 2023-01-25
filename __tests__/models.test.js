// import "jest-dom/extend-expect";
// import axiosMock from "axios";
// import request from 'supertest';
// import express from 'express';

const mongoose = require('mongoose');
const Review = require('../models/review.js');
const Counter = require('../models/counter.js');
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

describe('Review Model Test', () => {

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true }, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  });

  it('create & save Review successfully', async () => {
    const validReview = new Review(ReviewData);
    const savedReview = await validReview.save();
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedReview._id).toBeDefined();
    expect(savedReview.product).toBe(ReviewData.product);
    expect(savedReview.page).toBe(ReviewData.page);
    expect(savedReview.count).toBe(ReviewData.count);
    expect(savedReview.results).toHaveLength(2);
    expect(savedReview.ratings).toBeTruthy();
  });

  // Test Schema is working!!!
  // You shouldn't be able to add in any field that isn't defined in the schema
  it('insert user successfully, but the field does not defined in schema should be undefined', async () => {
    const reviewInvalidField = new Review({ product: '123', nickName: 'not avail' });
    const savedReviewWithInvalidField = await reviewInvalidField.save();
    expect(savedReviewWithInvalidField._id).toBeDefined();
    expect(savedReviewWithInvalidField.nickName).toBeUndefined();
  });
});

describe('Counter Model Test', () => {

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true }, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  });

  it('create Counter successfully', async () => {
    const validCounter = new Counter({
      _id: 'String',
      count: 5775000
    });
    const savedCounter = await validCounter.save();
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedCounter._id).toBeDefined();
    expect(savedCounter.count).toBe(5775000);
  });
});
