const express = require('express');
const router = express.Router();
const Review = require('../models/review.js');

// GET Review Data

router.get('/:id', async (req, res) => {
  // console.log("🚀 router.get ~ req.params.id: ", req.params.id);

  try {
    const reviews = await Review.findOne({ product: req.params.id });
    // Note the Review is referencing the MODEL. Like a key into the collection reviews.

    const reviewData = {
      product: reviews.product,
      page: reviews.page,
      count: reviews.count,
      results: reviews.results
    };
    res.json(reviewData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET Review Meta Data (all in one table?)
router.get('/meta/:id', async (req, res) => {
  // console.log("🚀 META GET req.params.id: ", req.params.id);
  try {
    const metaData = await Review.findOne({ product: req.params.id }).select("product ratings recommended characteristics").lean().then((result) => {
      result.product_id = result.product;
      delete result.product;
      return result;
    });
    res.json(metaData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST

router.post('/', async (req, res) => {
  console.log("🚀 ~ file: reviews.js:44 ~ router.post ~ req", req.body);
  const submitted = req.body;
  try {
    // const posted = Review.updateOne({ product: submitted.product_id }, { $push: { rating: submitted.rating, summary: submitted.summary, body: submitted.body, recommend: submitted.recommend, name: submitted.name, email: submitted.email } });
    Review.findOne({ product: submitted.product_id })
      .then((result) => {
        const newRating = (parseInt(result.ratings[submitted.rating]) + 1).toString();
        const newRatingKey = 'ratings.' + submitted.rating;
        const newRec = (parseInt(result.recommended[submitted.recommend]) + 1).toString();
        const newRecKey = 'recommended.' + submitted.recommend;

        console.log("🚀 ~ file: reviews.js:51 ~ .then ~ newRating", newRating, newRatingKey);
        Review.updateOne({ product: submitted.product_id }, { $set: { [newRatingKey]: newRating, [newRecKey]: newRec } })
          .then((updated) => {
            res.send(updated);
          });
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT Helpful review

// PUT Report Review

module.exports = router;
