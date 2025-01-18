const Listing = require("../models/listing");
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken = process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken}); 

module.exports.index = async (req,res)=>{
    let allListings = await Listing.find();
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = async (req,res)=>{
    console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path: "reviews", populate:{path: "author"}}).populate({
        path: "owner",
        select: "username email",
    });
    console.log(listing.owner.username);
    if (!listing) {
        return next(new expressError(404, "Listing not found"));
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async (req,res, next)=>{

    // let response = await geocodingClient.forwardGeocode({
    //     query: req.body.location,
    //     limit: 1
    //   })
    // .send();

    // console.log(response.body.features[0].geometry);
    // res.send("done!");

    let url = req.file.path;
    let filename = req.file.filename;
    console.log("Uploaded file details ",req.file);
    console.log(url,"..",filename);
    console.log(req.body);
    let {title, description, price, location, country}= req.body;
    // console.log(req.body.title); 
    let newListing = new Listing({
        title: title,
        description: description,
        price: price,
        location: location,
        country: country
    });

    newListing.owner = req.user;
    newListing.image = {url, filename};
    // newListing.geometry = response.body.features[0].geometry;

    let saved = await newListing.save();
    console.log(saved);
    console.log(newListing);
        
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        return next(new expressError(404, "Listing not found"));
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/uplaod", "/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing, originalImageUrl});
};

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let {title, description, price, location, country} = req.body;
    let updatedList = await Listing.findByIdAndUpdate(id,
        {title, description, price, location, country},
        {runValidators: true, new: true}
    );

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        updatedList.image = {url,filename};
    
        await updatedList.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}; 

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};