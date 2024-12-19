const express = require("express");
const router = express.Router({mergeParams: true});
const wrapasync = require("../utils/wrapasync.js");
const {validatereview, isloggedin,isreviewauthor} = require("../middleware.js");
const reviewcontroller = require("../controller/review.js");




  


//review post route

router.post("/",isloggedin,validatereview,wrapasync(reviewcontroller.createreview ));

//delete review route

router.delete("/:reviewid", isloggedin,isreviewauthor,wrapasync(reviewcontroller.destroyreview));

module.exports = router;



