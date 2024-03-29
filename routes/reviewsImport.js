// // BackUp for mongoimport path
// const express = require('express');
// const router = express.Router();

// // GET Review Data

// router.get('/:id', async (req, res) => {
//   // console.log("🚀 router.get ~ req.params.id: ", req.params.id);

//   try {
//     const reviews = await Review.find({ product_id: req.params.id });
//     const photos = await Review.find({ product_id: req.params.id });
//     // Note the Review is referencing the MODEL. Like a key into the collection reviews.

//     const filteredReviews = reviews.map((review) => {
//       return {
//         review_id: review.id,
//         rating: review.rating,
//         summary: review.summary,
//         recommend: review.recommend,
//         response: review.response,
//         body: review.body,
//         date: review.date,
//         reviewer_name: review.reviewer_name,
//         helpfulness: review.helpfulness,
//         photos: [
//           {
//             id: 2457050,
//             url: 'http://res.cloudinary.com/djfpzruso/image/upload/v1673118844/r63e0zgpunosamkw2nap.jpg'
//           }
//         ]
//       };
//     });
//     const reviewData = {
//       product: reviews[0].product_id,
//       page: 1,
//       count: reviews.length,
//       results: reviews
//     };

//     res.json(reviewData);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // GET Review Meta Data (all in one table?)
// router.get('/meta/:id', async (req, res) => {
//   // console.log("🚀 META GET req.params.id: ", req.params.id);
//   try {
//     const metaData = await Review.findOne({ product: req.params.id }).select("product ratings recommended characteristics").lean().then((result) => {
//       result.product_id = result.product;
//       delete result.product;
//       return result;
//     });

//     res.json(metaData);

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // POST

// router.post('/', async (req, res) => {
//   console.log("🚀 ~ file: reviews.js:44 ~ router.post ~ req", req.body);
//   const submitted = req.body;
//   try {
//     // const posted = Review.updateOne({ product: submitted.product_id }, { $push: { rating: submitted.rating, summary: submitted.summary, body: submitted.body, recommend: submitted.recommend, name: submitted.name, email: submitted.email } });
//     Review.findOne({ product: submitted.product_id })
//       .then((result) => {
//         // const newRating = (parseInt(result.ratings[submitted.rating]) + 1).toString();
//         const newRating = parseInt(result.ratings[submitted.rating]) + 1;
//         const newRatingKey = 'ratings.' + submitted.rating;
//         const newRec = parseInt(result.recommended[submitted.recommend]) + 1; // interesting I don't need it to be a string?
//         const newRecKey = 'recommended.' + submitted.recommend;

//         console.log("🚀 ~ file: reviews.js:51 ~ .then ~ newRating", newRating, newRatingKey);
//         Review.updateOne({ product: submitted.product_id }, { $set: { [newRatingKey]: newRating, [newRecKey]: newRec }, $inc: { count: 1 } })
//           .then((updated) => {
//             res.send(updated);
//           });
//       });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // PUT Helpful review

// // PUT Report Review

// module.exports = router;
