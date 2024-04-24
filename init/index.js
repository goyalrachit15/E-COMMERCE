const mongoose = require('mongoose');
const data= require("./data.js");
const Listing = require("../model/listing.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log("err");
});

async function main(){
    await mongoose.connect(mongo_url);
};


const initDB = async()=>{
    await Listing.deleteMany({});
    data.data = data.data.map((obj)=>({ ...obj, owner : "662025358c9ff897fa11e5e7" }))
    await Listing.insertMany(data.data);
    console.log("data was initialized");
};

initDB();