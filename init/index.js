const mongoose = require("mongoose");
let initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then((res)=>{
    console.log("Database connection was succesful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDb = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
      ...obj, owner: '676d31b2f172ebce13b2c93d', 
    }))
    await Listing.insertMany(initData.data);
    console.log("data saving was successful");
}; 

initDb(); 