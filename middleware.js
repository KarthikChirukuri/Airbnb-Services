const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const expressError = require("./utils/expressError.js");

module.exports.isLoggedIn = (req,res,next) =>{
    // console.log(req.path, ".." ,req.originalUrl); 
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged In");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next) =>{
    let {id} = req.params;
    let {title, description, price, location, country} = req.body;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);  //using Joi
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        return next(new expressError(400, errMsg));
    }
    else{
        next();
    }
};

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);  //using Joi
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        return next(new expressError(400, errMsg));
    }
    else{
        next();
    }
};

module.exports.isreviewAuthor = async (req,res,next) =>{
    let {id, reviewId} = req.params;
    // let {title, description, price, location, country} = req.body;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have permission to Delete");
        return res.redirect(`/listings/${id}`);
    }
    next();
}