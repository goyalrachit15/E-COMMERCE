const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const review = require("../model/reviews.js");
const Listing = require("../model/listing.js");
const { validateReview, isloggedin, isAuthor } = require("../middleware.js");

const reviewController = require("../controllers/review");
router.post(
  "/",
  isloggedin,
  validateReview,
  wrapAsync(reviewController.createReview)
);

router.delete(
  "/:reviewId",
  isloggedin,
  isAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
