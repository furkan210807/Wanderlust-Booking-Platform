const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


//reviews
//post review route




router.post("/",isLoggedIn,validateReview, reviewController.createReview );

//delete review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,reviewController.destroyReview);

module.exports = router;
