const express = require("express");
const router = express.Router();
const passport = require("passport");
const {saveredirecturl} = require("../middleware.js");
const usercontroller = require("../controller/user.js");

router.route("/signup")
.get( usercontroller.rendersignup)
.post(  usercontroller.signup);

router.route("/login")
.get(usercontroller.renderlogin)
.post(saveredirecturl,passport.authenticate("local", {failureRedirect:"/login", failureFlash: true}) , usercontroller.login);


router.get("/logout",usercontroller.logout);


module.exports = router;