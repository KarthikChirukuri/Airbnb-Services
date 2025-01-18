const express = require("express");
const router = express.Router({mergeParams: true});
// const {reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review= require("../models/review");
const expressError = require("../utils/expressError.js");
const Listing = require("../models/listing");
const {isLoggedIn, validateReview, isreviewAuthor} = require("../middleware.js");

const reviewControllers = require("../controllers/review.js");

router.post("/", isLoggedIn,validateReview, wrapAsync(reviewControllers.createReview));

router.delete("/:reviewId", isLoggedIn,isreviewAuthor,wrapAsync(reviewControllers.destroyReview));

module.exports= router;