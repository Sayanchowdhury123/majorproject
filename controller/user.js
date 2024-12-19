
const User = require("../models/user.js");

module.exports.rendersignup = (req,res) =>{
    res.render("users/signup.ejs");
}

module.exports.signup = async (req,res,next) =>{
    try{
    let {username,email,password} = req.body;
    let newuser = new User({email,username});
  let registereduser = await User.register(newuser,password);
  console.log(registereduser);

  req.login(registereduser,(err) =>{
   if(err){
      return next(err);
   }
   req.flash("s","welcome to wanderlust");
  res.redirect("/listings");

  
  })
  
    } catch(err){
       req.flash("e",err.message);
       res.redirect("/signup");
    }

}

module.exports.renderlogin = (req,res) =>{
    res.render("users/login.ejs");
 }

 module.exports.login =  async (req,res) =>{
       
    req.flash("s","welcome back to Wanderlust");
    let redirecturl = res.locals.redirecturl || "/listings";
    res.redirect(redirecturl);
}

module.exports.logout = (req,res,next) =>{
    req.logout((err) =>{
       if(err){
          return next(err);
       }
 
       req.flash("s","you are logged out");
       res.redirect("/listings");
    })
 }