const Joi = require("joi");

//
// const listingSchema = Joi.object({
//   listing: Joi.object({
//     title: Joi.string().required(),
//     description: Joi.string().required(),
//     price: Joi.number().required().min(0),
//     location: Joi.string().required(),
//     country: Joi.string().required(),
//   }).required(),
// });

module.exports.listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required().min(0),
  location: Joi.string().required(),
  country: Joi.string().required(),
  image: Joi.string().allow("").optional(), // Allow empty string for image
});

//exporting review schema
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
  }).required(),
});
