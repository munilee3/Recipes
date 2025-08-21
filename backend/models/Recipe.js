const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  cuisine: { type: String },
  title: { type: String, required: true },
  rating: { type: Number },
  prep_time: { type: Number },
  cook_time: { type: Number },
  total_time: { type: Number },
  description: { type: String },
  nutrients: {
    calories: String,
    carbohydrateContent: String,
    cholesterolContent: String,
    fiberContent: String,
    proteinContent: String,
    saturatedFatContent: String,
    sodiumContent: String,
    sugarContent: String,
    fatContent: String,
    unsaturatedFatContent: String,
  },
  calories: { type: String },
  ingredients: [{ type: String }],
  instructions: [{ type: String }],
  serves: { type: String },
});

module.exports = mongoose.model("Recipe", RecipeSchema);