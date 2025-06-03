const express = require("express");
const router = express.Router({ mergeParams: true }); //to merge params from listing.js and review.js

const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressErr = require("../utils/expressErr.js");
const reviewController = require("../controllers/reviews.js");

// const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

//class - 53
//Review
//post route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

//exporting router
module.exports = router;
