const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");



const mongourl = 'mongodb://127.0.0.1:27017/wonderlust';
async function main() {
    await mongoose.connect(mongourl);
}
main().then(() =>{
    console.log(`connected to db`);
}).catch((err) =>{
    console.log(err);
})


const initDB = async() =>{
    await Listing.deleteMany({});
  initdata.data =  initdata.data.map((obj) => ({...obj, owner:'6755af1c6e07ce1cb152efb3'}));
    await Listing.insertMany(initdata.data);
    console.log(`data was intialized`);
}

initDB();