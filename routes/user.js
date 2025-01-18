const express = require("express");
const { route } = require("./listing");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/users.js");

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

// router.get("/signup", userController.renderSignupForm);

// router.post("/signup", wrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderloginform)
    .post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}),userController.login)

// router.get("/login", userController.renderloginform);

// router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}),userController.login);

router.get("/logout", userController.logout);

module.exports= router;