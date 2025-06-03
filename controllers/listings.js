// const Listing = require("../models/listing");

// module.exports.index = async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// };

// module.exports.renderNewForm = (req, res) => {
//   console.log("amaan");
//   res.render("listings/new.ejs");
// };

// // module.exports.createListing = async (req,  res, next) => {
// //   console.log("amaan from create listing");
// //   let url = req.file.path;
// //   let filename = req.file.filename;
// //   // console.log(req);
// //   // let { title, description, price, location, country } = req.body;
// //   // let newListing = new Listing({
// //   //   title,
// //   //   description,
// //   //   price,
// //   //   location,
// //   //   country,
// //   // });
// //   // newListing.user = req.user._id;
// //   // await newListing.save();
// //   let newListing = new Listing(req.body.listing);
// //   newListing.owner = req.user._id;
// //   newListing.image = { url, filename };
// //   await newListing.save();
// //   req.flash("success", "Successfully created a new listing!");
// //   res.redirect("/listings");
// // };

// module.exports.createListing = async (req, res, next) => {
//   let newListing = new Listing(req.body.listing);
//   newListing.owner = req.user._id;

//   if (req.file) {
//     newListing.image = { url: req.file.path, filename: req.file.filename };
//   } else {
//     newListing.image = { url: "/default-image-path.png", filename: "default" }; // Replace with your default path
//   }

//   await newListing.save();
//   req.flash("success", "Successfully created a new listing!");
//   res.redirect("/listings");
// };

// module.exports.showListing = async (req, res) => {
//   // console.log(req.user);
//   let { id } = req.params;
//   let listing = await Listing.findById(id)
//     .populate({ path: "reviews", populate: { path: "author" } })
//     .populate("owner");
//   if (!listing) {
//     req.flash("error", "Cannot find that listing!");
//     return res.redirect("/listings");
//   }
//   console.log(listing);
//   res.render("listings/show.ejs", { listing });
// };

// module.exports.renderEditForm = async (req, res) => {
//   let { id } = req.params;
//   let listing = await Listing.findById(id);
//   if (!listing) {
//     req.flash("error", "Cannot find that listing!");
//     return res.redirect("/listings");
//   }
//   res.render("listings/edit.ejs", { listing });
// };

// module.exports.updateListing = async (req, res) => {
//   let { id } = req.params;
//   let { title, description, price, location, country } = req.body;
//   let updatedListing = await Listing.findByIdAndUpdate(id, {
//     title,
//     description,
//     price,
//     location,
//     country,
//   });
//   await updatedListing.save();
//   req.flash("success", "Successfully updated the listing!");
//   res.redirect("/listings");
// };

// module.exports.destroyListing = async (req, res) => {
//   let { id } = req.params;
//   let deletedListing = await Listing.findByIdAndDelete(id);
//   // console.log(deletedListing);
//   req.flash("success", "Successfully deleted the listing!");
//   res.redirect("/listings");
// };

const Listing = require("../models/listing");
const Review = require("../models/review");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  console.log("amaan");
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
  console.log("amaan from create listing");
  let cordinates = await geoCodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  newListing.geometry = cordinates.body.features[0].geometry;

  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = { url, filename };
  }

  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "Successfully created a new listing!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace(
    "/upload",
    "/upload/e_blur:300,h_100,w_100,c_fill,g_auto" // Adjust this as needed
  );
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let { title, description, price, location, country } = req.body;
  let updatedListing = await Listing.findByIdAndUpdate(id, {
    title,
    description,
    price,
    location,
    country,
  });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = { url, filename };
    await updatedListing.save();
  }

  await updatedListing.save();
  req.flash("success", "Successfully updated the listing!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  console.log("hello from destroy listing");
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the listing!");
  res.redirect("/listings");
};
