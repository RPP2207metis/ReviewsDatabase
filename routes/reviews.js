const express = require('express');
const router = express.Router();
const Review = require('../models/review.js');

// GET Review Data

router.get('/:id', async (req, res) => {
  console.log("🚀 router.get ~ req.params.id: ", req.params.id);

  try {
    const reviews = await Review.findOne({ product: req.params.id });
    // Note the Review is referencing the MODEL. Like a key into the collection reviews.

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET Review Meta Data (all in one table?)
router.get('/meta/:id', async (req, res) => {
  console.log("🚀 META GET req.params.id: ", req.params.id);
  try {
    const metaData = await Review.findOne({ product: req.params.id });
    res.json(metaData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST

// PUT Helpful review

// PUT Report Review

module.exports = router;
