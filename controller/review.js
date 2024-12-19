const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.createreview = async (req,res) =>{
  
    let listing = await Listing.findById(req.params.id);

    let newreview = new Review(req.body.review);
     newreview.author = req.user;
    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();
    req.flash("s","review posted");

  res.redirect(`/listings/${listing._id}`);
}


module.exports.destroyreview = async(req,res) =>{

    let {id,reviewid} = req.params;
    
    await Listing.findByIdAndUpdate( id, {$pull: {reviews: reviewid}});
     await Review.findByIdAndDelete(reviewid);
     req.flash("s","review deleted");
     res.redirect(`/listings/${id}`);
     
    
    };