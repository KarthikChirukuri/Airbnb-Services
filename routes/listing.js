const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const {listingSchema} = require("../schema.js");
const expressError = require("../utils/expressError.js");
const Listing = require("../models/listing");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController= require("../controllers/listings.js");

const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('image'), validateListing, wrapAsync(listingController.createListing));
    // .post(upload.single('image'), (req ,res)=>{
    //     res.send(req.file);
    // });

// router.get("/", wrapAsync(listingController.index));

//always create /listing/new on top of the /listings/:id else it will give error
router.get("/new", isLoggedIn ,wrapAsync(listingController.renderNewForm));

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .patch(isLoggedIn, isOwner, upload.single('image'),validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner  ,wrapAsync(listingController.destroyListing));

// router.get("/:id",wrapAsync(listingController.showListing));

// router.post("/", validateListing, wrapAsync(listingController.createListing));

router.get("/:id/edit", isLoggedIn, isOwner ,wrapAsync(listingController.renderEditForm));

// router.patch("/:id", isLoggedIn, isOwner ,validateListing, wrapAsync(listingController.updateListing));

// router.delete("/:id",isLoggedIn, isOwner  ,wrapAsync(listingController.destroyListing));

module.exports = router;