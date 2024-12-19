
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended: true}));
const methodoveride = require("method-override");
app.use(methodoveride("_method"));
const ejsmate = require("ejs-mate");
app.engine("ejs", ejsmate);
const session = require("express-session");
const MongoStore = require('connect-mongo');
const passport = require("passport");
const Localstatargey = require("passport-local");
const User = require("./models/user.js");
//multer
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
//flash
const flash = require("connect-flash");

const dburl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error", ()=>{
    console.log("error in mongo session store", err);
});

//sessions
const sessionoption = {
    store,
    secret:  process.env.SECRET,
     resave: false,
     saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge : 1000 * 60 * 60 * 24 * 3,
        httpOnly : true
    },
 };
app.use(session(sessionoption));




//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstatargey(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash

app.use(flash());
app.use((req,res,next) =>{
    res.locals.success = req.flash("s");
    res.locals.error = req.flash("e");
    res.locals.curruser = req.user;
    next();
});








//error class
const expresserror = require("./utils/expresserror.js");



//routes
const listingsrouter = require("./routes/listing.js");
const reviewsrouter = require("./routes/review.js");
const { date } = require("joi");
const userrouter = require("./routes/user.js");







async function main() {
    await mongoose.connect(dburl);
}
main().then(() =>{
    console.log(`connected to db`);
}).catch((err) =>{
    console.log(err);
})

// router
app.use("/listings", listingsrouter);
app.use("/listings/:id/reviews", reviewsrouter);
app.use("/", userrouter);






app.listen(8080, ()=>{
    console.log(`app is starting`);
});




app.all("*",(req,res,next) =>{
    next(new expresserror(404,"page not found"));
})


app.use((err,req,res,next) =>{
    let {statuscode = 500,message = "something went wrong"} = err;
    res.status(statuscode).render("listings/error.ejs",{message});
});


