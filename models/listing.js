const mongoose = require("mongoose");

const Review = require("./review.js");
const User = require("./user.js");
const { string } = require("joi");

const schema = mongoose.Schema;

const listingschema = new schema({
  title:{
   type: String,
   required: true
  } ,
  descriptipn: String,
  image:{
    url:String,
    filename: String,
  } ,
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: schema.Types.ObjectId,
      ref: "Review"
    },
  ],
  owner: {
    type: schema.Types.ObjectId,
    ref: "User"
  },

    
});

listingschema.post("findOneAndDelete",async(listing) =>{
   if(listing){
      await Review.deleteMany({ _id : {$in: listing.reviews}})
   }
});


const Listing = mongoose.model("Listing", listingschema);
module.exports = Listing;