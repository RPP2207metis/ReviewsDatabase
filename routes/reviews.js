const express = require('express');
const router = express.Router();
const Review = require('../models/review.js');
const Counter = require('../models/counter.js');

// GET Review Data
router.get('/', async (req, res) => {
  console.log("🚀 router.get ~ req.query.product_id: ", req.query.product_id);
  try {
    const reviews = await Review.findOne({ product: req.query.product_id }).select({ _id: 0, "results._id": 0 });
    // Note the Review is referencing the MODEL. Like a key into the collection reviews.
    const reviewData = {
      product: reviews.product,
      page: 1,
      count: reviews.count,
      results: reviews.results
    };
    res.json(reviewData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET Review Meta Data (all in one table?)
// router.get('/meta/:id', async (req, res) => {
router.get('/meta', async (req, res) => {
  console.log("🚀🚀 META GET req.query.id: ", req.query.product_id);
  try {
    const metaData = await Review.findOne({ product: req.query.product_id }).select("product ratings recommended characteristics").lean().then((result) => {
      result.product_id = result.product;
      delete result.product;
      (result.characteristics).shift();
      const charArray = result.characteristics;
      const charObj = {};
      const transformedChars = charArray.map((obj) => {
        // const charObj = {};
        charObj[obj.name] = {
          id: obj.id,
          value: ((((obj.value).reduce((acc, currentObj) => {
            return acc + Number(currentObj.value);
          }, 0))) / (obj.value).length).toString()
        };
        return charObj;
      });
      // result.characteristics = transformedChars;
      result.characteristics = charObj;
      delete result._id;
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
    await Review.findOne({ product: submitted.product_id })
      .then(async (result) => {

        // const newMaxReviewId = await Review.aggregate([
        //   {
        //     $group: { _id: { $max: "$results.review_id" }, maxReviewId: { $max: "$results.review_id" } }
        //   }
        // ])
        //   .then((res) => {
        //     // console.log("🚀 ~ file: reviews.js:112 ~ .then ~ res", res);
        //     return res[res.length - 1]._id + 1;
        //   });

        const newMaxReviewId = await Counter.findOneAndUpdate({ _id: 'review_id' }, { $inc: { count: 1 } }, {new: true})
          .then(res => {
            return res.count;
          });

        const newRating = parseInt(result.ratings[submitted.rating]) + 1;
        const newRatingKey = 'ratings.' + submitted.rating;
        const newRec = parseInt(result.recommended[submitted.recommend]) + 1; // interesting I don't need it to be a string?
        const newRecKey = 'recommended.' + submitted.recommend;
        // console.log("newRating", newRating, newRatingKey);

        const photoTransform = (submitted.photos).map((photo) => {
          return {
            id: newMaxReviewId, // might need unique counter or null
            url: photo
          };
        });
        for (const charId in submitted.characteristics) {
          await Review.updateOne({ "characteristics.id": charId }, {
            $push: {
              "characteristics.$.value": {
                id: newMaxReviewId, // might need unique counter or null
                value: (submitted.characteristics[charId]).toString()
              }
            }
          })
            .then((res) => console.log(charId, 'char ID Updated', res))
            .catch((err) => console.error(err));
        }

        await Review.updateOne({ product: submitted.product_id }, {
          $set: {
            [newRatingKey]: newRating,
            [newRecKey]: newRec
          },
          $inc: {
            count: 1
          },
          $push:
            {
              results: {
                review_id: newMaxReviewId,
                rating: submitted.rating,
                summary: submitted.summary,
                recommend: submitted.recommend,
                response: null,
                body: submitted.body,
                reviewer_name: submitted.name,
                reviewer_email: submitted.email,
                date: Date.now(),
                helpfulness: 0,
                photos: photoTransform,
                reported: false
              }
            }
        })
          .then((updated) => {
            res.status(201).send(updated);
          });
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT Helpful review

router.put("/:reviewid/helpful", async (req, res) => {
  const review_id = req.params.reviewid;
  console.log("🚀 ~ file: reviews.js:144 ~ router.put help ~ review_id", review_id)
  await Review.updateOne({ "results.review_id": review_id }, {
    $inc: {
      "results.$.helpfulness": 1
    }
  })
    .then((result) => {
      console.log(review_id, 'helpfulness Updated', result);
      res.status(204).send();
    })
    .catch((err) => console.error(err));

});

// PUT Report Review

router.put("/:reviewid/report", async (req, res) => {
  const review_id = req.params.reviewid;
  console.log("🚀 ~ file: reviews.js:162 ~ router.put REPORT~ review_id", review_id)

  await Review.updateOne({ "results.review_id": review_id }, {
    $set: {
      "results.$.reported": true
    }
  })
    .then((result) => {
      console.log(review_id, 'reported Updated', result);
      res.status(204).send();
    })
    .catch((err) => console.error(err));
});

module.exports = router;
