// // More API data information: https://learn-2.galvanize.com/cohorts/3414/blocks/94/content_files/Front%20End%20Capstone/project-atelier/reviews.md
// module.exports.dummyReviews = {
//   "product": "2",
//   "page": 0,
//   "count": 5,
//   "results": [
//     {
//       "review_id": 5,
//       "rating": 3,
//       "summary": "I'm enjoying wearing these shades",
//       "recommend": false,
//       "response": null,
//       "body": "Comfortable and practical.",
//       "date": "2019-04-14T00:00:00.000Z",
//       "reviewer_name": "shortandsweeet",
//       "helpfulness": 5,
//       "photos": [{
//           "id": 1,
//           "url": "urlplaceholder/review_5_photo_number_1.jpg"
//         },
//         {
//           "id": 2,
//           "url": "urlplaceholder/review_5_photo_number_2.jpg"
//         }
//       ]
//     },
//     {
//       "review_id": 3,
//       "rating": 4,
//       "summary": "I am liking these glasses",
//       "recommend": false,
//       "response": "Glad you're enjoying the product!",
//       "body": "They are very dark. But that's good because I'm in very sunny spots",
//       "date": "2019-06-23T00:00:00.000Z",
//       "reviewer_name": "bigbrotherbenjamin",
//       "helpfulness": 5,
//       "photos": [],
//     }
//   ]
// }

// // Meta Data
// module.exports.dummyMetaReviews = {
//   "product_id": "2",
//   "ratings": {
//     2: 1,
//     3: 1,
//     4: 2,
//   },
//   "recommended": {
//     0: 5
//   },
//   "characteristics": {
//     "Size": {
//       "id": 14,
//       "value": "4.0000"
//     },
//     "Width": {
//       "id": 15,
//       "value": "3.5000"
//     },
//     "Comfort": {
//       "id": 16,
//       "value": "4.0000"
//     }
//   }
// }


// // SCHEMA DESIGN
// const mongoose = require('mongoose');

// const Review = mongoose.model('Review', reviewSchema);
// module.exports = Review;



// // const reviewSchema = new Schema({
// //   $schema: "http://json-schema.org/draft-04/schema#",
// //   $id: "https://example.com/employee.schema.json",
// //   title: "Review Data",
// //   description: "This document records the details of the reviews",
// //   type: Object,
// //   properties : {
// //     product: {
// //       type: String
// //     },
// //     page: {
// //       type: Number
// //     },
// //     count: {
// //       type: Number
// //     },
// //     results: {
// //       type: Array
// //       items: {
// //         description: List of Reviews and their properties,
// //         type: Object,
// //         properties: {
// //           review_id: {
// //             type: Number,
// //             required: true
// //           },
// //           rating: {
// //             type: Number,
// //             required: true
// //           },
// //           summary: {
// //             type: String,
// //             required: true
// //           },
// //           recommend: {
// //             type: Boolean,
// //             required: true
// //           },
// //           response: {
// //             type: String,
// //             default: null
// //           },
// //           body: {
// //             type: String,
// //             required: true
// //           },
// //           date: {
// //             type: Date,
// //             required: true
// //           },
// //           reviewer_name: {
// //             type: String,
// //             required: true
// //           },
// //           helpfulness: {
// //             type: Number,
// //             required: true
// //           },
// //           photos: {
// //             description: List of review uploaded photos,
// //             type: Array,
// //             default: [],
// //             items: {
// //               description: each review photo id and url,
// //               type: Object,
// //               properties: {
// //                 id: {
// //                   type: Number,
// //                   required: true
// //                 },
// //                 url: {
// //                   type: String,
// //                   required: true
// //                 }
// //             }
// //           }
// //         }
// //         }
// //       }
// //     }
// //   }
// // })



// const reviewSchema = new Schema({
//   "$schema": "http://json-schema.org/draft-04/schema#",
//   "$id": "https://example.com/employee.schema.json",
//   "title": "Review Data",
//   "description": "This document records the details of the reviews",
//   "type": "object",
//   product: {
//     type: String
//   },
//   page: {
//     type: Number
//   },
//   count: {
//     type: Number
//   },
//   results: {
//     type: Array
//     items: {
//       description: List of Reviews and their properties,
//       type: Object,
//       properties: {
//         review_id: {
//           type: Number,
//           required: true
//         },
//         rating: {
//           type: Number,
//           required: true
//         },
//         summary: {
//           type: String,
//           required: true
//         },
//         recommend: {
//           type: Boolean,
//           required: true
//         },
//         response: {
//           type: String,
//           default: null
//         },
//         body: {
//           type: String,
//           required: true
//         },
//         date: {
//           type: Date,
//           required: true
//         },
//         reviewer_name: {
//           type: String,
//           required: true
//         },
//         helpfulness: {
//           type: Number,
//           required: true
//         },
//         photos: {
//           description: List of review uploaded photos,
//           type: Array,
//           default: [],
//           items: {
//             description: each review photo id and url,
//             type: Object,
//             properties: {
//               id: {
//                 type: Number,
//                 required: true
//               },
//               url: {
//                 type: String,
//                 required: true
//               }
//           }
//         }
//       }
//     }
//   }
// }



// const reviewSchema = new Schema({
//     "product": String,
//     "page": Number,
//     "count": Number,
//     "results": [
//       {
//         "review_id": Number,
//         "rating": Number,
//         "summary": String,
//         "recommend": Boolean,
//         "response": String,
//         "body": String,
//         "date": Date,
//         "reviewer_name": String,
//         "helpfulness": Number, // put in here
//         "photos": [{
//             "id": Number,
//             "url": String
//           }],
//         "reported": Boolean // default false
//       }
//     ]
//   }
// const metaSchema = new Schema({
//   "product_id": String,
//   "ratings": { // default don't send if empty
//     0: String,
//     1: String,
//     2: String,
//     3: String,
//     4: String
//   },
//   "recommended": {
//     "false": String,
//     "true": String
//   },
//   "characteristics": { // default don't send if empty

//     "Size": {
//       "id": Number,
//       "value": String
//     },
//     "Width": {
//       "id": Number,
//       "value": String
//     },
//     "Comfort": {
//       "id": Number,
//       "value": String
//     },
//     "Quality": {
//       "id": Number,
//       "value": String
//   }
// }
//   }
// }


// // POST INCOMING (send in data like this)

// this is the incoming review:  {
//   product_id: 71705,
//   rating: 5,
//   summary: 'testing',
//   body: "They are very dark. But that's good because I'm in very sunny spots",
//   recommend: true,
//   name: 'test',
//   email: 'test@test.com',
//   photos: ['http://res.cloudinary.com/djfpzruso/image/upload/v1673118844/r63e0zgpunosamkw2nap.jpg'],
//   characteristics: { '240611': 3, '240612': 1, '240613': 3, '240614': 3 }
// }

// this is the another review:  {
//   product_id: 71705,
//   rating: 1,
//   summary: 'not good',
//   body: "They hurt my feet a lot. But that's good because I'm in very sunny spots",
//   recommend: true,
//   name: 'asdf',
//   email: 'test@test.com',
//   photos: [],
//   characteristics: { '240611': 1, '240612': 1, '240613': 1, '240614': 1 }
// }
// converting to mongoose strictQuery
// {product: submitted.product_id,

//   rating: submitted.rating,
//   summary: submitted.summary,
//   body: submitted.body,
//   recommend: submitted.recommend,
//   name: submitted.name, email: submitted.email
// }

// photos: submitted.photos, characteristics: submitted.characteristics


// will need to create

// review_id, response(?)


// // GET REQUEST RESPONSE FROM DATABASE (need to get data back like this)

// [
//   {
//     product: '71705',
//     page: 1,
//     count: 5,
//     results: []
//   },



//   {
//     product_id: '71705',
//     ratings: { '1': '1', '2': '2', '3': '1', '4': '2', '5': '2' },
//     recommended: { false: '1', true: '5' },
//     characteristics: {
//       Size: [Object],
//       Width: [Object],
//       Comfort: [Object],
//       Quality: [Object]
//     }
//   }
// ]


// Inside Mongo:
// {
//     product: '71705',
//     page: 1,
//     count: 5,
//     results: [
//       {
//         review_id: 1278259,
//         rating: 4,
//         summary: 'summary',
//         recommend: true,
//         response: null,
//         body: 'rjirhturhrudhrtifhdijeiejirjifrjdirjirtjdfijdijdijed',
//         date: '2023-01-07T00:00:00.000Z',
//         reviewer_name: 'tvo',
//         helpfulness: 0,
//         photos: [
//           {
//             id: 2457050,
//             url: 'http://res.cloudinary.com/djfpzruso/image/upload/v1673118844/r63e0zgpunosamkw2nap.jpg'
//           }
//         ]
//       }, ...
//     ],
//     ratings: { // default don't send if empty
//       0: String,
//       1: String,
//       2: String,
//       3: String,
//       4: String
//     },
//     recommended: {
//       false: String,
//       true: String
//     },
//     characteristics: { // default don't send if empty
//       Size: {
//         id: Number,
//         value: String
//       },
//       Width: {
//         id: Number,
//         value: String
//       },
//       Comfort: {
//         id: Number,
//         value: String
//       },
//       Quality: {
//         id: Number,
//         value: String
//       }
//     }
//   }


