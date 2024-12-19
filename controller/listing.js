const Listing = require("../models/listing.js");


module.exports.index = async (req,res) =>{
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", {alllistings});
 };

 module.exports.rendernewform = (req,res) =>{
    res.render("listings/form.ejs");
};

module.exports.showlisting = async (req,res) =>{
    let {id} = req.params;
  const listing =  await Listing.findById(id)
  .populate({path: "reviews",
    populate:{
      path: "author"
    },
  }).populate("owner");
  if(!listing){
    req.flash("e","listing you requested not found");
    res.redirect("/listings");
  }
  
  res.render("listings/show.ejs",{listing});

}

module.exports.createlisting = async (req,res) =>{
   
  let url = req.file.path;
  let filename = req.file.filename;
   
   const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url, filename};
      await newlisting.save();
      req.flash("s","new listing created");
      res.redirect("/listings");
}

module.exports.renderupdateform = async (req,res) =>{
    let {id} = req.params;
    const listing =  await Listing.findById(id);
   
  let orignalimgurl = listing.image.url;

 orignalimgurl = orignalimgurl.replace("/upload","/upload/w_250");

    res.render("listings/edit.ejs",{listing,orignalimgurl});

}

module.exports.updatelisting = async (req,res) =>{
    let {id} = req.params;
  let updatedlisting =  await Listing.findByIdAndUpdate( id,{ ...req.body.listing });

    if(typeof req.file != "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      updatedlisting.image = {url, filename};
      await updatedlisting.save();
    }
    req.flash("s","listing updated");
    res.redirect(`/listings/${id}`);
    
  }

  module.exports.destroylisting = async (req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);

   req.flash("s","listing deleted");
    res.redirect("/listings");
}


module.exports.findlisting = async(req,res) =>{
  const query = req.query.search;
 
  
  const alllistings = await Listing.find({
   title: {
       $regex: query, $options: 'i'
   }
  })



  res.render("listings/index.ejs",{alllistings});


 
}