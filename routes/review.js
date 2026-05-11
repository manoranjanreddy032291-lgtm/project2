const express = require("express");

const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");

const reviewController = require("../controllers/review.js");

const {
  isLoggedIn,
  validateReview,
  isReviewAuthor,
} = require("../middleware.js");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.addreview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deletereview)
);

module.exports = router;