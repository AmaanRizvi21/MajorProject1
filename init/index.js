const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const Mongo_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(Mongo_URL);
}

const initDB = async () => {
  await Listing.deleteMany({}); //before inserting the new data, I am deleting all the existing data in the collection.
  console.log("Deleted all existing data in the collection");
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "6820808b882d8bc1dba1633e", //amaan_rizvi_21 wali owner id h
  }));
  await Listing.insertMany(initdata.data);
  console.log("Data was inserted successfully");
};

initDB();
