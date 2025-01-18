if(process.env.NODE_ENV != "producation");{ //if is used for not allowing to access this file in further
    require('dotenv').config();
    // console.log(process.env.SECRET);
}

const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
// const Listing = require("./models/listing");     Here we are commenting many parts because we shifted them to routes
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
// const {listingSchema, reviewSchema} = require("./schema.js");
// const Review= require("./models/review");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { cookie } = require("express/lib/response.js");

const dbUrl = process.env.ATLASDB_URL;

main().then((res)=>{
    console.log("Database connection was succesful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine('ejs',ejsMate);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter: 24 * 60 * 60
});

store.on("error", ()=>{
    console.log("ERROR in Mongo Session store!", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,  
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3
    }
};


app.get("/",(req,res)=>{
    res.send("Root is working!");
});

app.use(session(sessionOptions));
app.use(flash()); //we need to use this before the routes

app.use(passport.initialize());
app.use(passport.session()); //helps user to login only once
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/demouser", async (req,res)=>{
//     let fakeuser = new  User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });
//     let registeredUser = await User.register(fakeuser ,"HelloWorld"); //here HelloWorld is our password
//     res.send(registeredUser);
// });

// const validateListing = (req,res,next)=>{
//     let {error} = listingSchema.validate(req.body);  //using Joi
//     if(error){
//         let errMsg = error.details.map((el)=> el.message).join(",");
//         return next(new expressError(400, errMsg));
//     }
//     else{
//         next();
//     }
// };

// const validateReview = (req,res,next)=>{
//     let {error} = reviewSchema.validate(req.body);  //using Joi
//     if(error){
//         let errMsg = error.details.map((el)=> el.message).join(",");
//         return next(new expressError(400, errMsg));
//     }
//     else{
//         next();
//     }
// };

// instead of all listings we use
app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/listings", listingsRouter);
app.use("/listing", listingsRouter);

//now for reviews
app.use("/listing/:id/review", reviewsRouter);
app.use("/listings/:id/review", reviewsRouter);

app.use("/", userRouter);

//for all router middleware
app.get("*", (req,res,next)=>{
    next(new expressError(404, "Page not Found!"));
});

//middleware
app.use((err,req,res,next)=>{
    let {status = 500,message="Something wrong!"}= err;
    // res.status(status).send(message);
    res.render("error.ejs", {message});
});

app.listen(port,()=>{
    console.log("server connected at " + port);
});