const { model } = require("mongoose");
const Review = require("./review.js");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  //chatgpt se help leke isko shi kiya hai
  image: {
    filename: {
      type: String,
      default:
        "https://png.pngtree.com/png-vector/20190115/ourmid/pngtree-ui-default-page-page-404-page-loss-no-content-yet-png-image_344465.jpg",
    },
    url: {
      type: String,
      default:
        "https://png.pngtree.com/png-vector/20190115/ourmid/pngtree-ui-default-page-page-404-page-loss-no-content-yet-png-image_344465.jpg",
    },
  },

  price: Number,
  location: String,
  country: String,
  //creatinf a relationship with review model[one to many relationship]
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"], // 'geometry.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
});

//deleting all the reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({
      _id: {
        $in: listing.reviews,
      },
    });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
