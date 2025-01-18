const Review= require("../models/review");
const Listing= require("../models/listing");

module.exports.createReview = async (req,res)=>{
    const { id } = req.params; // Extract 'id' from req.params
    console.log("ID from req.params:", id);


    const listing = await Listing.findById(id);
    // let listing = await Listing.findById(req.params.id);
    // console.log("Fetching listing with ID:", req.params.id);
    // let newReview = new Review(req.body.review);
    const newReview = new Review({
        comment: req.body.comment,
        rating: req.body.rating
    }); 

    newReview.author = req.user._id;
    // console.log(newReview.author);

    listing.reviews.push(newReview);
    await newReview.save();
    // console.log(newReview);
    await listing.save();
    // console.log(listing);
    // res.send("New response saved!");
    console.log(req.body);
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing.id}`);
};

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};//end of destroyReview