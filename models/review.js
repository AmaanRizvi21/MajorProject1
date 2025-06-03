const { ref } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

//create a review schema
const reviewSchema = new Schema({
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

//create a review model
const Review = mongoose.model("Review", reviewSchema);

//export the review model
module.exports = Review;
