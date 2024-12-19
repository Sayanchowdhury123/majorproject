const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const {isloggedin, isowner,validatelisting} = require("../middleware.js");
const listingcontroller = require("../controller/listing.js");
const multer  = require('multer');

const {storage} = require("../cloudconfig.js");

const upload = multer({ storage });


router.route("/")
.get( wrapasync(listingcontroller.index))
.post(isloggedin,upload.single("listing[image]"),validatelisting ,wrapasync(listingcontroller.createlisting));


//search
router.get("/search",wrapasync(listingcontroller.findlisting));



 //new route
 router.get("/new",isloggedin,listingcontroller.rendernewform);
 
 router.route("/:id")
 .get(wrapasync(listingcontroller.showlisting))
 .put(isloggedin,isowner,upload.single("listing[image]"),validatelisting,wrapasync( listingcontroller.updatelisting))
 .delete(isloggedin,isowner,wrapasync( listingcontroller.destroylisting))



 
 //update route
 router.get("/:id/edit",isloggedin,isowner,wrapasync( listingcontroller.renderupdateform));
 
 
 
 
 

 module.exports = router;