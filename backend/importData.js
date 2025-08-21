const mongoose = require("mongoose");
const fs = require("fs");
const Recipe = require("./models/Recipe.js");

mongoose.connect("mongodb+srv://muniswamykanike:munilee3@data.drnbasx.mongodb.net/?retryWrites=true&w=majority&appName=data", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let rawData = fs.readFileSync("C:\\Users\\Muniswamy.K\\Downloads\\US_recipes.json", "utf-8");

rawData = rawData
  .replace(/\bNaN\b/g, "null")
  .replace(/\bInfinity\b/g, "null")
  .replace(/\bundefined\b/g, "null");

let recipes = JSON.parse(rawData);
if (!Array.isArray(recipes)) {
  recipes = Object.values(recipes);
}

async function importData() {
  try {
    await Recipe.deleteMany();
    const cleanData = recipes
    .filter((r) => r.title) 
    .map((r) => ({
        cuisine: r.cuisine || "Unknown",
        title: r.title,
        rating: isNaN(r.rating) ? null : r.rating,
        prep_time: isNaN(r.prep_time) ? null : r.prep_time,
        cook_time: isNaN(r.cook_time) ? null : r.cook_time,
        total_time: isNaN(r.total_time) ? null : r.total_time,
        description: r.description || "",
        nutrients: r.nutrients || {},
        calories: r.nutrients?.calories || "0 kcal",
        ingredients: r.ingredients || [],
        instructions: r.instructions || [],
        serves: r.serves || null,
    }));
    await Recipe.insertMany(cleanData);
    console.log("Data Imported");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

importData();