const Listing = require("./models/listing.js");
const {listingschema , reviewschme} = require("./schema.js");
const expresserror = require("./utils/expresserror.js");
const Review = require("./models/review.js");




module.exports.isloggedin = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirecturl = req.originalUrl;
        req.flash("e","you need to be logged in");
       return res.redirect("/login");
      }
      next();
}

module.exports.saveredirecturl = (req,res,next) =>{
    if(req.session.redirecturl){
        res.locals.redirecturl = req.session.redirecturl;
    }
    next();
}

module.exports.isowner = async(req,res,next) =>{
   let {id} = req.params;
  
   let listing = await Listing.findById(id);
   if(!listing.owner.equals(res.locals.curruser._id)){
      req.flash("e","you don't have permission to do this");
      return res.redirect(`/listings/${id}`);
   }
   next();

}

module.exports.validatelisting = (req,res,next) =>{
    let {error} = listingschema.validate(req.body);
      
    if(error){
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new expresserror(404,errmsg);
    } else{
        next();
    }
  }


  module.exports.validatereview = (req,res,next) =>{
    let {error} = reviewschme.validate(req.body);
      
    if(error){
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new expresserror(404,errmsg);
    } else{
        next();
    }
}

module.exports.isreviewauthor = async(req,res,next) =>{
    let {reviewid,id} = req.params;
   
    let review = await Review.findById(reviewid);
    if(!review.author.equals(res.locals.curruser._id)){
       req.flash("e","you are not the author of this review");
       return res.redirect(`/listings/${id}`);
    }
    next();
 
 }

